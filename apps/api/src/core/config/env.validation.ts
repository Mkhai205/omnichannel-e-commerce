/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  APP_CONFIG_KEY,
  AUTH_COOKIE_CONFIG_KEY,
  DATABASE_CONFIG_KEY,
  GOOGLE_OAUTH_CONFIG_KEY,
  JWT_CONFIG_KEY,
  MINIO_CONFIG_KEY,
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
  const jwtAccessSecret = normalizeRequiredString(config.JWT_ACCESS_SECRET);
  const jwtRefreshSecret = normalizeRequiredString(config.JWT_REFRESH_SECRET);
  const googleClientId = normalizeRequiredString(config.GOOGLE_CLIENT_ID);
  const googleClientSecret = normalizeRequiredString(
    config.GOOGLE_CLIENT_SECRET,
  );
  const googleCallbackUrl = normalizeRequiredString(config.GOOGLE_CALLBACK_URL);
  const databaseUrl = normalizeRequiredString(config.DATABASE_URL);
  const minioEndpoint = normalizeRequiredString(config.MINIO_ENDPOINT);
  const minioRootUser = normalizeRequiredString(config.MINIO_ROOT_USER);
  const minioRootPassword = normalizeRequiredString(config.MINIO_ROOT_PASSWORD);

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
    APP_HOST: String(config.APP_HOST ?? APP_CONFIG_KEY.APP_HOST),
    APP_PORT: parseNumber(config.APP_PORT, APP_CONFIG_KEY.APP_PORT, 'APP_PORT'),
    APP_ENV: String(config.APP_ENV ?? APP_CONFIG_KEY.APP_ENV),
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
    // Cookie configuration
    AUTH_COOKIE_ACCESS_NAME: String(
      config.AUTH_COOKIE_ACCESS_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_ACCESS_NAME,
    ),
    AUTH_COOKIE_REFRESH_NAME: String(
      config.AUTH_COOKIE_REFRESH_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_REFRESH_NAME,
    ),
    AUTH_COOKIE_OAUTH_STATE_NAME: String(
      config.AUTH_COOKIE_OAUTH_STATE_NAME ??
        AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_OAUTH_STATE_NAME,
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
        GOOGLE_OAUTH_CONFIG_KEY.FRONTEND_LOGIN_SUCCESS_REDIRECT,
    ),
    FRONTEND_LOGIN_FAILURE_REDIRECT: String(
      config.FRONTEND_LOGIN_FAILURE_REDIRECT ??
        GOOGLE_OAUTH_CONFIG_KEY.FRONTEND_LOGIN_FAILURE_REDIRECT,
    ),
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
    MINIO_PUBLIC_ENDPOINT: String(
      config.MINIO_PUBLIC_ENDPOINT ?? `${minioEndpoint}:${minioPort}`,
    ).trim(),
    MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS: parseNumber(
      config.MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS,
      MINIO_CONFIG_KEY.MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS,
      'MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS',
    ),
  };
}
