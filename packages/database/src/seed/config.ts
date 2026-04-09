import { parseArgs } from "node:util";
import {
    DEFAULT_ACTIVE_RATIO,
    DEFAULT_PRODUCTS_PER_CATEGORY,
    DEFAULT_SEED_VALUE,
    DEFAULT_VARIANTS_MAX,
    DEFAULT_VARIANTS_MIN,
} from "./constants.js";
import type { SeedMode } from "./types.js";

export type SeedRunOptions = {
    mode: SeedMode;
    seedValue: number;
    productsPerCategory: number;
    variantsMin: number;
    variantsMax: number;
    activeRatio: number;
};

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

function parsePositiveInteger(
    rawValue: string | undefined,
    fallbackValue: number,
    fieldName: string,
): number {
    if (!rawValue) {
        return fallbackValue;
    }

    const parsed = Number.parseInt(rawValue, 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error(`${fieldName} must be a positive integer`);
    }

    return parsed;
}

function parseRatio(rawValue: string | undefined): number {
    if (!rawValue) {
        return DEFAULT_ACTIVE_RATIO;
    }

    const parsed = Number.parseFloat(rawValue);

    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        throw new Error("active-ratio must be a number between 0 and 1");
    }

    return parsed;
}

function parseSeedMode(rawValue: string | undefined): SeedMode {
    if (!rawValue || rawValue === "full") {
        return "full";
    }

    if (rawValue === "catalog") {
        return "catalog";
    }

    throw new Error(`Unsupported seed mode \"${rawValue}\". Expected \"full\" or \"catalog\".`);
}

export function parseSeedRunOptions(args: string[], env: NodeJS.ProcessEnv): SeedRunOptions {
    const { values } = parseArgs({
        args,
        allowPositionals: true,
        options: {
            mode: { type: "string" },
            "seed-value": { type: "string" },
            "products-per-category": { type: "string" },
            "variants-min": { type: "string" },
            "variants-max": { type: "string" },
            "active-ratio": { type: "string" },
        },
    });

    const mode = parseSeedMode(values.mode ?? env.SEED_MODE);
    const seedValue = parseSeedValue(values["seed-value"] ?? env.SEED_RANDOM_SEED);
    const productsPerCategory = parsePositiveInteger(
        values["products-per-category"] ?? env.SEED_PRODUCTS_PER_CATEGORY,
        DEFAULT_PRODUCTS_PER_CATEGORY,
        "products-per-category",
    );
    const variantsMin = parsePositiveInteger(
        values["variants-min"] ?? env.SEED_VARIANTS_MIN,
        DEFAULT_VARIANTS_MIN,
        "variants-min",
    );
    const variantsMax = parsePositiveInteger(
        values["variants-max"] ?? env.SEED_VARIANTS_MAX,
        DEFAULT_VARIANTS_MAX,
        "variants-max",
    );

    if (variantsMin > variantsMax) {
        throw new Error("variants-min must be less than or equal to variants-max");
    }

    const activeRatio = parseRatio(values["active-ratio"] ?? env.SEED_ACTIVE_RATIO);

    return {
        mode,
        seedValue,
        productsPerCategory,
        variantsMin,
        variantsMax,
        activeRatio,
    };
}
