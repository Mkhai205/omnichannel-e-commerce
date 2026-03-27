export const APP_CONFIG_KEY = {
  APP_HOST: 'localhost',
  APP_PORT: 8000,
  APP_ENV: 'development',
  CORS_ORIGIN:
    '["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]',
} as const;

export const JWT_CONFIG_KEY = {
  JWT_ACCESS_EXPIRES_IN_SECONDS: 900,
  JWT_REFRESH_EXPIRES_IN_SECONDS: 2592000,
} as const;

export const AUTH_COOKIE_CONFIG_KEY = {
  AUTH_COOKIE_ACCESS_NAME: 'ecommerce_access_token',
  AUTH_COOKIE_REFRESH_NAME: 'ecommerce_refresh_token',
  AUTH_COOKIE_OAUTH_STATE_NAME: 'ecommerce_oauth_state',
  AUTH_COOKIE_STATE_MAX_AGE_SECONDS: 300,
  AUTH_COOKIE_SAME_SITE: 'lax',
} as const;

export const GOOGLE_OAUTH_CONFIG_KEY = {
  FRONTEND_LOGIN_SUCCESS_REDIRECT:
    'http://localhost:3000/auth/callback/success',
  FRONTEND_LOGIN_FAILURE_REDIRECT: 'http://localhost:3000/auth/callback/error',
} as const;

export const DATABASE_CONFIG_KEY = {
  DATABASE_POOL_MIN: 2,
  DATABASE_POOL_MAX: 10,
  DATABASE_CONNECTION_TIMEOUT: 30000,
} as const;
