import { parseArgs } from "node:util";
import {
    DEFAULT_ACTIVE_RATIO,
    DEFAULT_PRODUCTS_PER_CATEGORY,
    DEFAULT_SEED_VALUE,
    DEFAULT_VARIANTS_MAX,
    DEFAULT_VARIANTS_MIN,
} from "./constants.js";
import type { SeedCleanupMode, SeedMode, SeedProfile } from "./types.js";

export type SeedRunOptions = {
    profile: SeedProfile;
    mode: SeedMode;
    cleanupMode: SeedCleanupMode;
    dryRun: boolean;
    includeFinance: boolean;
    seedValue: number;
    productsPerCategory: number;
    variantsMin: number;
    variantsMax: number;
    activeRatio: number;
};

type ProfilePreset = {
    mode: SeedMode;
    cleanupMode: SeedCleanupMode;
    includeFinance: boolean;
    productsPerCategory: number;
    variantsMin: number;
    variantsMax: number;
    activeRatio: number;
};

const PROFILE_PRESETS: Record<SeedProfile, ProfilePreset> = {
    core: {
        mode: "full",
        cleanupMode: "reset-seed-only",
        includeFinance: false,
        productsPerCategory: DEFAULT_PRODUCTS_PER_CATEGORY,
        variantsMin: DEFAULT_VARIANTS_MIN,
        variantsMax: DEFAULT_VARIANTS_MAX,
        activeRatio: DEFAULT_ACTIVE_RATIO,
    },
    qa: {
        mode: "full",
        cleanupMode: "reset-seed-only",
        includeFinance: true,
        productsPerCategory: 5,
        variantsMin: 2,
        variantsMax: 4,
        activeRatio: 0.85,
    },
    "catalog-load": {
        mode: "catalog",
        cleanupMode: "prune-catalog-generated",
        includeFinance: false,
        productsPerCategory: 120,
        variantsMin: 3,
        variantsMax: 5,
        activeRatio: 0.9,
    },
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

function parseSeedProfile(rawValue: string | undefined): SeedProfile {
    if (!rawValue || rawValue === "core") {
        return "core";
    }

    if (rawValue === "qa" || rawValue === "catalog-load") {
        return rawValue;
    }

    throw new Error(
        `Unsupported seed profile "${rawValue}". Expected "core", "qa", or "catalog-load".`,
    );
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

function parseBooleanLike(
    rawValue: string | boolean | undefined,
    fallbackValue: boolean,
    fieldName: string,
): boolean {
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

    throw new Error(`${fieldName} must be a boolean value`);
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

function parseCleanupMode(rawValue: string | undefined): SeedCleanupMode {
    if (!rawValue || rawValue === "none") {
        return "none";
    }

    if (
        rawValue === "reset-all" ||
        rawValue === "reset-seed-only" ||
        rawValue === "prune-catalog-generated"
    ) {
        return rawValue;
    }

    throw new Error(
        `Unsupported cleanup mode "${rawValue}". Expected "none", "reset-all", "reset-seed-only", or "prune-catalog-generated".`,
    );
}

function resolveDefaultCleanupMode(profile: SeedProfile, mode: SeedMode): SeedCleanupMode {
    const presetCleanupMode = PROFILE_PRESETS[profile].cleanupMode;

    if (mode === "catalog") {
        return presetCleanupMode === "none" ? "none" : presetCleanupMode;
    }

    if (presetCleanupMode === "none" || presetCleanupMode === "prune-catalog-generated") {
        return "reset-seed-only";
    }

    return presetCleanupMode;
}

export function parseSeedRunOptions(args: string[], env: NodeJS.ProcessEnv): SeedRunOptions {
    const { values } = parseArgs({
        args,
        allowPositionals: true,
        options: {
            profile: { type: "string" },
            mode: { type: "string" },
            "cleanup-mode": { type: "string" },
            "dry-run": { type: "boolean" },
            "include-finance": { type: "boolean" },
            "seed-value": { type: "string" },
            "products-per-category": { type: "string" },
            "variants-min": { type: "string" },
            "variants-max": { type: "string" },
            "active-ratio": { type: "string" },
        },
    });

    const profile = parseSeedProfile(values.profile ?? env.SEED_PROFILE);
    const preset = PROFILE_PRESETS[profile];
    const mode = parseSeedMode(values.mode ?? env.SEED_MODE ?? preset.mode);
    const cleanupMode = parseCleanupMode(
        values["cleanup-mode"] ?? env.SEED_CLEANUP_MODE ?? resolveDefaultCleanupMode(profile, mode),
    );
    const dryRun = parseBooleanLike(values["dry-run"] ?? env.SEED_DRY_RUN, false, "dry-run");
    const includeFinance =
        mode === "catalog"
            ? false
            : parseBooleanLike(
                  values["include-finance"] ?? env.SEED_INCLUDE_FINANCE,
                  preset.includeFinance,
                  "include-finance",
              );
    const seedValue = parseSeedValue(values["seed-value"] ?? env.SEED_RANDOM_SEED);
    const productsPerCategory = parsePositiveInteger(
        values["products-per-category"] ?? env.SEED_PRODUCTS_PER_CATEGORY,
        preset.productsPerCategory,
        "products-per-category",
    );
    const variantsMin = parsePositiveInteger(
        values["variants-min"] ?? env.SEED_VARIANTS_MIN,
        preset.variantsMin,
        "variants-min",
    );
    const variantsMax = parsePositiveInteger(
        values["variants-max"] ?? env.SEED_VARIANTS_MAX,
        preset.variantsMax,
        "variants-max",
    );

    if (variantsMin > variantsMax) {
        throw new Error("variants-min must be less than or equal to variants-max");
    }

    const activeRatio = parseRatio(
        values["active-ratio"] ?? env.SEED_ACTIVE_RATIO ?? String(preset.activeRatio),
    );

    return {
        profile,
        mode,
        cleanupMode,
        dryRun,
        includeFinance,
        seedValue,
        productsPerCategory,
        variantsMin,
        variantsMax,
        activeRatio,
    };
}
