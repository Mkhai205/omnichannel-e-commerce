import { parseArgs } from "node:util";
import { DEFAULT_SEED_VALUE } from "./constants.js";

export type SeedRunOptions = {
    seedValue: number;
    dryRun: boolean;
};

export function getRequiredDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
    const databaseUrl = env.DATABASE_URL?.trim();

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

function parseSeedValue(rawValue: string | undefined): number {
    if (!rawValue) {
        return DEFAULT_SEED_VALUE;
    }

    const parsed = Number.parseInt(rawValue, 10);

    if (!Number.isFinite(parsed)) {
        return DEFAULT_SEED_VALUE;
    }

    return parsed;
}

function parseBooleanLike(rawValue: string | boolean | undefined, fallbackValue: boolean): boolean {
    if (rawValue === undefined) {
        return fallbackValue;
    }

    if (typeof rawValue === "boolean") {
        return rawValue;
    }

    const normalized = rawValue.trim().toLowerCase();

    if (["true", "1", "yes", "y", "on"].includes(normalized)) {
        return true;
    }

    if (["false", "0", "no", "n", "off"].includes(normalized)) {
        return false;
    }

    throw new Error("dry-run must be a boolean value");
}

export function parseSeedRunOptions(args: string[], env: NodeJS.ProcessEnv): SeedRunOptions {
    const normalizedArgs = args.filter((arg) => arg !== "--");

    const { values } = parseArgs({
        args: normalizedArgs,
        allowPositionals: true,
        options: {
            "seed-value": { type: "string" },
            "dry-run": { type: "boolean" },
        },
    });

    return {
        seedValue: parseSeedValue(values["seed-value"] ?? env.SEED_RANDOM_SEED),
        dryRun: parseBooleanLike(values["dry-run"] ?? env.SEED_DRY_RUN, false),
    };
}
