import { DEFAULT_SEED_VALUE } from "./constants.js";

export function getRequiredDatabaseUrl(): string {
    const databaseUrl = process.env.DATABASE_URL?.trim();

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is required to run seed");
    }

    return databaseUrl;
}

export function assertLocalDatabase(databaseUrl: string): void {
    const allowedHosts = new Set([
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "postgres",
        "db",
        "host.docker.internal",
    ]);
    let parsed: URL;

    try {
        parsed = new URL(databaseUrl);
    } catch {
        throw new Error("DATABASE_URL is invalid. Seed is blocked for safety (local-only mode).");
    }

    if (!allowedHosts.has(parsed.hostname)) {
        throw new Error(`Refusing to seed non-local database host \"${parsed.hostname}\".`);
    }
}

export function parseSeedValue(rawValue: string | undefined): number {
    if (!rawValue) {
        return DEFAULT_SEED_VALUE;
    }

    const parsed = Number.parseInt(rawValue, 10);

    if (!Number.isFinite(parsed)) {
        return DEFAULT_SEED_VALUE;
    }

    return parsed;
}
