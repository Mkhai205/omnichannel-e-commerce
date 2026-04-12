export const APP_CONFIG_KEY = {
  NODE_ENV: 'development',
  CORS_ORIGIN:
    '["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]',
} as const;

export const JWT_CONFIG_KEY = {
  JWT_ACCESS_EXPIRES_IN_SECONDS: 900,
  JWT_REFRESH_EXPIRES_IN_SECONDS: 2592000,
  RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS: 900,
  VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS: 86400,
} as const;

export const AUTH_COOKIE_CONFIG_KEY = {
  AUTH_COOKIE_ACCESS_NAME: 'ecommerce_access_token',
  AUTH_COOKIE_REFRESH_NAME: 'ecommerce_refresh_token',
  AUTH_COOKIE_DOMAIN: '',
  AUTH_COOKIE_OAUTH_STATE_NAME: 'ecommerce_oauth_state',
  AUTH_COOKIE_OAUTH_SOURCE_NAME: 'ecommerce_oauth_source',
  AUTH_COOKIE_STATE_MAX_AGE_SECONDS: 300,
  AUTH_COOKIE_SAME_SITE: 'lax',
} as const;

export const FRONTEND_REDIRECT_URI_CONFIG_KEY = {
  FRONTEND_LOGIN_SUCCESS_REDIRECT:
    'http://localhost:3000/auth/callback/success',
  FRONTEND_LOGIN_FAILURE_REDIRECT: 'http://localhost:3000/auth/callback/error',
  FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT:
    'http://localhost:3002/auth/callback/success',
  FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT:
    'http://localhost:3002/auth/callback/error',
  FRONTEND_RESET_PASSWORD_REDIRECT: 'http://localhost:3000/reset-password',
  FRONTEND_SELLER_RESET_PASSWORD_REDIRECT:
    'http://localhost:3002/reset-password',
  FRONTEND_VERIFY_EMAIL_REDIRECT: 'http://localhost:3000/verify-email',
  FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT: 'http://localhost:3002/verify-email',
} as const;

export const DATABASE_CONFIG_KEY = {
  DATABASE_POOL_MIN: 2,
  DATABASE_POOL_MAX: 10,
  DATABASE_CONNECTION_TIMEOUT: 30000,
} as const;

export const MINIO_CONFIG_KEY = {
  MINIO_PORT: 9000,
  MINIO_SECURE: false,
  MINIO_REGION: 'us-east-1',
  MINIO_BUCKETS: 'products,evidence,avatars',
  MINIO_PUBLIC_BUCKETS: 'products',
  MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS: 900,
} as const;

export const MAIL_CONFIG_KEY = {
  MAIL_ENABLED: false,
  MAIL_SMTP_HOST: 'smtp.gmail.com',
  MAIL_SMTP_PORT: 587,
  MAIL_SMTP_SECURE: false,
  MAIL_SMTP_CONNECTION_TIMEOUT: 10000,
  MAIL_FROM_NAME: 'Omnichannel E-commerce',
} as const;

export const VNPAY_CONFIG_KEY = {
  VNPAY_HOST: 'https://sandbox.vnpayment.vn',
  VNPAY_LOCALE: 'vn',
  VNPAY_ORDER_TYPE: 'other',
  VNPAY_PAYMENT_EXPIRE_MINUTES: 15,
} as const;

export const SETTLEMENT_CONFIG_KEY = {
  SETTLEMENT_ADMIN_COMMISSION_PERCENT: 5,
} as const;
