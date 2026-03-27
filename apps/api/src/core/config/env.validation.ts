/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  APP_CONFIG_KEY,
  AUTH_COOKIE_CONFIG_KEY,
  DATABASE_CONFIG_KEY,
  GOOGLE_OAUTH_CONFIG_KEY,
  JWT_CONFIG_KEY,
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

export function validateEnv(config: RawEnv): RawEnv {
  const jwtAccessSecret = String(config.JWT_ACCESS_SECRET).trim();
  const jwtRefreshSecret = String(config.JWT_REFRESH_SECRET).trim();
  const googleClientId = String(config.GOOGLE_CLIENT_ID).trim();
  const googleClientSecret = String(config.GOOGLE_CLIENT_SECRET).trim();
  const googleCallbackUrl = String(config.GOOGLE_CALLBACK_URL).trim();
  const databaseUrl = String(config.DATABASE_URL).trim();

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
  };
}
