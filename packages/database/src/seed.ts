import "dotenv/config";
import { faker } from "./seed/faker.js";
import { createPrismaClient } from "./client.js";
import { cleanDatabase, previewCleanup } from "./seed/cleanup.js";
import { assertLocalDatabase, getRequiredDatabaseUrl, parseSeedRunOptions } from "./seed/config.js";
import { seedCore } from "./seed/core.js";

async function main(): Promise<void> {
    const databaseUrl = getRequiredDatabaseUrl();
    const runOptions = parseSeedRunOptions(process.argv.slice(2), process.env);

    const shouldEnforceLocalGuard = process.env.SEED_LOCAL_ONLY !== "false";

    if (shouldEnforceLocalGuard) {
        assertLocalDatabase(databaseUrl);
    }

    faker.seed(runOptions.seedValue);

    const prisma = createPrismaClient({
        connectionString: databaseUrl,
        log: ["error", "warn"],
    });

    try {
        console.log(`[seed] Using seed value: ${runOptions.seedValue}`);
        console.log("[seed] Cleanup mode: reset-all");
        console.log(`[seed] Dry run: ${runOptions.dryRun ? "enabled" : "disabled"}`);

        const preview = await previewCleanup(prisma);

        if (Object.keys(preview).length > 0) {
            console.log("[seed] Cleanup preview:");
            console.table(preview);
        }

        if (runOptions.dryRun) {
            console.log("[seed] Dry-run completed. No data was modified.");

            return;
        }

        console.log("[seed] Running cleanup...");
        const cleanupSummary = await cleanDatabase(prisma);

        if (Object.keys(cleanupSummary).length > 0) {
            console.log("[seed] Cleanup result:");
            console.table(cleanupSummary);
        }

        console.log("[seed] Creating core fixtures...");
        const summary = await seedCore(prisma);

        console.log("[seed] Completed successfully.");
        console.table(summary);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
});
