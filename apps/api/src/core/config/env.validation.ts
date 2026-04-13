/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  APP_CONFIG_KEY,
  AUTH_COOKIE_CONFIG_KEY,
  DATABASE_CONFIG_KEY,
  FRONTEND_REDIRECT_URI_CONFIG_KEY,
  JWT_CONFIG_KEY,
  MAIL_CONFIG_KEY,
  MINIO_CONFIG_KEY,
  SETTLEMENT_CONFIG_KEY,
  VNPAY_CONFIG_KEY,
} from './env.constant';

type RawEnv = Record<string, unknown>;

function parseNumber(value: unknown, fallback: number, key: string): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }

  return parsed;
}

function parseBoolean(value: unknown, fallback: boolean, key: string): boolean {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  throw new Error(`Environment variable ${key} must be a valid boolean`);
}

function normalizeCsv(value: unknown): string {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .join(',');
}

function normalizeRequiredString(value: unknown): string {
  const normalized = String(value).trim();

  if (
    !normalized ||
    normalized.toLowerCase() === 'undefined' ||
    normalized.toLowerCase() === 'null'
  ) {
    return '';
  }

  return normalized;
}

export function validateEnv(config: RawEnv): RawEnv {
  const nodeEnv = String(config.NODE_ENV ?? APP_CONFIG_KEY.NODE_ENV)
    .trim()
    .toLowerCase();
  const jwtAccessSecret = normalizeRequiredString(config.JWT_ACCESS_SECRET);
  const jwtRefreshSecret = normalizeRequiredString(config.JWT_REFRESH_SECRET);
  const googleClientId = normalizeRequiredString(config.GOOGLE_CLIENT_ID);
  const googleClientSecret = normalizeRequiredString(
    config.GOOGLE_CLIENT_SECRET,
  );
  const googleCallbackUrl = normalizeRequiredString(config.GOOGLE_CALLBACK_URL);
  const databaseUrl = normalizeRequiredString(config.DATABASE_URL);
  const minioEndpoint = normalizeRequiredString(config.MINIO_ENDPOINT);
  const minioPublicEndpoint = normalizeRequiredString(
    config.MINIO_PUBLIC_ENDPOINT,
  );
  const minioRootUser = normalizeRequiredString(config.MINIO_ROOT_USER);
  const minioRootPassword = normalizeRequiredString(config.MINIO_ROOT_PASSWORD);
  const gmailSmtpUser = normalizeRequiredString(config.GMAIL_SMTP_USER);
  const gmailSmtpAppPassword = normalizeRequiredString(
    config.GMAIL_SMTP_APP_PASSWORD,
  );
  const vnpayTmnCode = normalizeRequiredString(config.VNPAY_TMN_CODE);
  const vnpaySecureSecret = normalizeRequiredString(config.VNPAY_SECURE_SECRET);
  const vnpayReturnUrl = normalizeRequiredString(config.VNPAY_RETURN_URL);
  const vnpayIpnUrl = normalizeRequiredString(config.VNPAY_IPN_URL);

  if (!jwtAccessSecret || !jwtRefreshSecret) {
    throw new Error(
      'Environment variables JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required for JWT authentication',
    );
  }

  if (!googleClientId || !googleClientSecret || !googleCallbackUrl) {
    throw new Error(
      'Environment variables GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL are required for Google OAuth',
    );
  }

  if (!databaseUrl) {
    throw new Error('Environment variable DATABASE_URL is required');
  }

  if (!minioEndpoint || !minioRootUser || !minioRootPassword) {
    throw new Error(
      'Environment variables MINIO_ENDPOINT, MINIO_ROOT_USER, and MINIO_ROOT_PASSWORD are required for MinIO storage',
    );
  }

  if (nodeEnv === 'production') {
    if (!minioPublicEndpoint) {
      throw new Error(
        'Environment variable MINIO_PUBLIC_ENDPOINT is required in production and must point to a public host',
      );
    }

    const normalizedPublicHost = minioPublicEndpoint
      .replace(/^https?:\/\//i, '')
      .toLowerCase();

    if (
      /^(minio|localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/.test(
        normalizedPublicHost,
      )
    ) {
      throw new Error(
        'MINIO_PUBLIC_ENDPOINT cannot use internal hosts (minio/localhost/127.0.0.1) in production',
      );
    }
  }

  const mailEnabled = parseBoolean(
    config.MAIL_ENABLED,
    MAIL_CONFIG_KEY.MAIL_ENABLED,
    'MAIL_ENABLED',
  );

  if (mailEnabled && (!gmailSmtpUser || !gmailSmtpAppPassword)) {
    throw new Error(
      'Environment variables GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD are required when MAIL_ENABLED is true',
    );
  }

  if (!vnpayTmnCode || !vnpaySecureSecret || !vnpayReturnUrl || !vnpayIpnUrl) {
    throw new Error(
      'Environment variables VNPAY_TMN_CODE, VNPAY_SECURE_SECRET, VNPAY_RETURN_URL, and VNPAY_IPN_URL are required for VNPay integration',
    );
  }

  const minioPort = parseNumber(
    config.MINIO_PORT ?? config.MINIO_API_PORT,
    MINIO_CONFIG_KEY.MINIO_PORT,
    'MINIO_PORT',
  );
  const minioBuckets = normalizeCsv(
    config.MINIO_BUCKETS ?? MINIO_CONFIG_KEY.MINIO_BUCKETS,
  );
  const minioPublicBuckets = normalizeCsv(
    config.MINIO_PUBLIC_BUCKETS ?? MINIO_CONFIG_KEY.MINIO_PUBLIC_BUCKETS,
  );

  return {
    ...config,
    // Application configuration
    NODE_ENV: nodeEnv,
    CORS_ORIGIN: String(config.CORS_ORIGIN ?? APP_CONFIG_KEY.CORS_ORIGIN),
    // JWT configuration
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_ACCESS_EXPIRES_IN_SECONDS: parseNumber(
      config.JWT_ACCESS_EXPIRES_IN_SECONDS,
      JWT_CONFIG_KEY.JWT_ACCESS_EXPIRES_IN_SECONDS,
      'JWT_ACCESS_EXPIRES_IN_SECONDS',
    ),
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_REFRESH_EXPIRES_IN_SECONDS: parseNumber(
      config.JWT_REFRESH_EXPIRES_IN_SECONDS,
      JWT_CONFIG_KEY.JWT_REFRESH_EXPIRES_IN_SECONDS,
      'JWT_REFRESH_EXPIRES_IN_SECONDS',
    ),
    RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS: parseNumber(
      config.RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS,
      JWT_CONFIG_KEY.RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS,
      'RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS',
    ),
    VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS: parseNumber(
      config.VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS,
      JWT_CONFIG_KEY.VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS,
      'VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS',
    ),
    // Cookie configuration
    AUTH_COOKIE_ACCESS_NAME: String(
      config.AUTH_COOKIE_ACCESS_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_ACCESS_NAME,
    ),
    AUTH_COOKIE_REFRESH_NAME: String(
      config.AUTH_COOKIE_REFRESH_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_REFRESH_NAME,
    ),
    AUTH_COOKIE_DOMAIN: String(
      config.AUTH_COOKIE_DOMAIN ?? AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_DOMAIN,
    ).trim(),
    AUTH_COOKIE_OAUTH_STATE_NAME: String(
      config.AUTH_COOKIE_OAUTH_STATE_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_OAUTH_STATE_NAME,
    ),
    AUTH_COOKIE_OAUTH_SOURCE_NAME: String(
      config.AUTH_COOKIE_OAUTH_SOURCE_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_OAUTH_SOURCE_NAME,
    ),
    AUTH_COOKIE_STATE_MAX_AGE_SECONDS: parseNumber(
      config.AUTH_COOKIE_STATE_MAX_AGE_SECONDS,
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_STATE_MAX_AGE_SECONDS,
      'AUTH_COOKIE_STATE_MAX_AGE_SECONDS',
    ),
    // Google OAuth configuration
    GOOGLE_CLIENT_ID: googleClientId,
    GOOGLE_CLIENT_SECRET: googleClientSecret,
    GOOGLE_CALLBACK_URL: googleCallbackUrl,
    FRONTEND_LOGIN_SUCCESS_REDIRECT: String(
      config.FRONTEND_LOGIN_SUCCESS_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_LOGIN_SUCCESS_REDIRECT,
    ).trim(),
    FRONTEND_LOGIN_FAILURE_REDIRECT: String(
      config.FRONTEND_LOGIN_FAILURE_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_LOGIN_FAILURE_REDIRECT,
    ).trim(),
    FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT: String(
      config.FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT,
    ).trim(),
    FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT: String(
      config.FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT,
    ).trim(),
    FRONTEND_RESET_PASSWORD_REDIRECT: String(
      config.FRONTEND_RESET_PASSWORD_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_RESET_PASSWORD_REDIRECT,
    ).trim(),
    FRONTEND_SELLER_RESET_PASSWORD_REDIRECT: String(
      config.FRONTEND_SELLER_RESET_PASSWORD_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_RESET_PASSWORD_REDIRECT,
    ).trim(),
    FRONTEND_VERIFY_EMAIL_REDIRECT: String(
      config.FRONTEND_VERIFY_EMAIL_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_VERIFY_EMAIL_REDIRECT,
    ).trim(),
    FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT: String(
      config.FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT ??
        FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT,
    ).trim(),
    // Database configuration
    DATABASE_URL: databaseUrl,
    DATABASE_POOL_MIN: parseNumber(
      config.DATABASE_POOL_MIN,
      DATABASE_CONFIG_KEY.DATABASE_POOL_MIN,
      'DATABASE_POOL_MIN',
    ),
    DATABASE_POOL_MAX: parseNumber(
      config.DATABASE_POOL_MAX,
      DATABASE_CONFIG_KEY.DATABASE_POOL_MAX,
      'DATABASE_POOL_MAX',
    ),
    DATABASE_CONNECTION_TIMEOUT: parseNumber(
      config.DATABASE_CONNECTION_TIMEOUT,
      DATABASE_CONFIG_KEY.DATABASE_CONNECTION_TIMEOUT,
      'DATABASE_CONNECTION_TIMEOUT',
    ),
    // MinIO configuration
    MINIO_ENDPOINT: minioEndpoint,
    MINIO_PORT: minioPort,
    MINIO_SECURE: parseBoolean(
      config.MINIO_SECURE,
      MINIO_CONFIG_KEY.MINIO_SECURE,
      'MINIO_SECURE',
    ),
    MINIO_ROOT_USER: minioRootUser,
    MINIO_ROOT_PASSWORD: minioRootPassword,
    MINIO_REGION: String(
      config.MINIO_REGION ?? MINIO_CONFIG_KEY.MINIO_REGION,
    ).trim(),
    MINIO_BUCKETS: minioBuckets,
    MINIO_PUBLIC_BUCKETS: minioPublicBuckets,
    MINIO_PUBLIC_ENDPOINT:
      minioPublicEndpoint || `${minioEndpoint}:${minioPort}`,
    MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS: parseNumber(
      config.MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS,
      MINIO_CONFIG_KEY.MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS,
      'MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS',
    ),
    // Mail configuration
    MAIL_ENABLED: mailEnabled,
    MAIL_SMTP_HOST: String(
      config.MAIL_SMTP_HOST ?? MAIL_CONFIG_KEY.MAIL_SMTP_HOST,
    ).trim(),
    MAIL_SMTP_PORT: parseNumber(
      config.MAIL_SMTP_PORT,
      MAIL_CONFIG_KEY.MAIL_SMTP_PORT,
      'MAIL_SMTP_PORT',
    ),
    MAIL_SMTP_SECURE: parseBoolean(
      config.MAIL_SMTP_SECURE,
      MAIL_CONFIG_KEY.MAIL_SMTP_SECURE,
      'MAIL_SMTP_SECURE',
    ),
    MAIL_SMTP_CONNECTION_TIMEOUT: parseNumber(
      config.MAIL_SMTP_CONNECTION_TIMEOUT,
      MAIL_CONFIG_KEY.MAIL_SMTP_CONNECTION_TIMEOUT,
      'MAIL_SMTP_CONNECTION_TIMEOUT',
    ),
    MAIL_FROM_EMAIL: String(config.MAIL_FROM_EMAIL ?? gmailSmtpUser).trim(),
    MAIL_FROM_NAME: String(
      config.MAIL_FROM_NAME ?? MAIL_CONFIG_KEY.MAIL_FROM_NAME,
    ).trim(),
    GMAIL_SMTP_USER: gmailSmtpUser,
    GMAIL_SMTP_APP_PASSWORD: gmailSmtpAppPassword,
    // VNPay configuration
    VNPAY_TMN_CODE: vnpayTmnCode,
    VNPAY_SECURE_SECRET: vnpaySecureSecret,
    VNPAY_HOST: String(config.VNPAY_HOST ?? VNPAY_CONFIG_KEY.VNPAY_HOST).trim(),
    VNPAY_RETURN_URL: vnpayReturnUrl,
    VNPAY_IPN_URL: vnpayIpnUrl,
    VNPAY_LOCALE: String(
      config.VNPAY_LOCALE ?? VNPAY_CONFIG_KEY.VNPAY_LOCALE,
    ).trim(),
    VNPAY_ORDER_TYPE: String(
      config.VNPAY_ORDER_TYPE ?? VNPAY_CONFIG_KEY.VNPAY_ORDER_TYPE,
    ).trim(),
    VNPAY_PAYMENT_EXPIRE_MINUTES: parseNumber(
      config.VNPAY_PAYMENT_EXPIRE_MINUTES,
      VNPAY_CONFIG_KEY.VNPAY_PAYMENT_EXPIRE_MINUTES,
      'VNPAY_PAYMENT_EXPIRE_MINUTES',
    ),
    // Settlement configuration
    SETTLEMENT_ADMIN_COMMISSION_PERCENT: parseNumber(
      config.SETTLEMENT_ADMIN_COMMISSION_PERCENT,
      SETTLEMENT_CONFIG_KEY.SETTLEMENT_ADMIN_COMMISSION_PERCENT,
      'SETTLEMENT_ADMIN_COMMISSION_PERCENT',
    ),
  };
}
