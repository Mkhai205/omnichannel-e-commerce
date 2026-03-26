/* eslint-disable @typescript-eslint/no-base-to-string */
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
  const databaseUrl = String(config.DATABASE_URL ?? '').trim();

  if (!databaseUrl) {
    throw new Error('Environment variable DATABASE_URL is required');
  }

  return {
    ...config,
    PORT: parseNumber(config.PORT, 8000, 'PORT'),
    DB_POOL_MIN: parseNumber(config.DB_POOL_MIN, 2, 'DB_POOL_MIN'),
    DB_POOL_MAX: parseNumber(config.DB_POOL_MAX, 10, 'DB_POOL_MAX'),
    DB_TIMEOUT: parseNumber(config.DB_TIMEOUT, 30000, 'DB_TIMEOUT'),
    NODE_ENV: String(config.NODE_ENV ?? 'development'),
    DATABASE_URL: databaseUrl,
  };
}
