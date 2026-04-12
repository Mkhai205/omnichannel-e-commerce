import "dotenv/config";
import { faker } from "./seed/faker.js";
import { createPrismaClient } from "./client.js";
import { cleanDatabase, previewCleanup } from "./seed/cleanup.js";
import { assertLocalDatabase, getRequiredDatabaseUrl, parseSeedRunOptions } from "./seed/config.js";
import { seedCore } from "./seed/core.js";
import { seedCatalog } from "./seed/modules/catalog.js";
import { seedCategories } from "./seed/modules/categories.js";

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
        const cleanupLabel =
            runOptions.cleanupMode === "none" ? "none" : `${runOptions.cleanupMode} (scoped)`;

        console.log(`[seed] Profile: ${runOptions.profile}`);
        console.log(`[seed] Using seed value: ${runOptions.seedValue}`);
        console.log(`[seed] Mode: ${runOptions.mode}`);
        console.log(`[seed] Cleanup: ${cleanupLabel}`);
        console.log(`[seed] Dry run: ${runOptions.dryRun ? "enabled" : "disabled"}`);

        if (runOptions.cleanupMode !== "none") {
            const preview = await previewCleanup(prisma, runOptions.cleanupMode);

            if (Object.keys(preview).length > 0) {
                console.log("[seed] Cleanup preview:");
                console.table(preview);
            }

            if (runOptions.dryRun) {
                console.log("[seed] Dry-run completed. No data was modified.");

                return;
            }

            console.log("[seed] Running cleanup...");
            const cleanupSummary = await cleanDatabase(prisma, runOptions.cleanupMode);

            if (Object.keys(cleanupSummary).length > 0) {
                console.log("[seed] Cleanup result:");
                console.table(cleanupSummary);
            }
        } else if (runOptions.dryRun) {
            console.log("[seed] Dry-run completed with cleanup disabled. No data was modified.");

            return;
        }

        if (runOptions.mode === "full") {
            console.log("[seed] Creating core fixtures...");
            const summary = await seedCore(prisma, {
                catalog: {
                    includeFixedProducts: true,
                    productsPerCategory: runOptions.productsPerCategory,
                    variantsMin: runOptions.variantsMin,
                    variantsMax: runOptions.variantsMax,
                    activeRatio: runOptions.activeRatio,
                },
                includeFinance: runOptions.includeFinance,
            });

            console.log("[seed] Completed successfully.");
            console.table(summary);

            return;
        }

        console.log("[seed] Ensuring catalog categories...");
        const categoriesResult = await seedCategories(prisma);

        console.log("[seed] Seeding catalog products/variants (append mode)...");
        const catalogResult = await seedCatalog(prisma, {
            includeFixedProducts: false,
            categoryRecords: categoriesResult.records,
            productsPerCategory: runOptions.productsPerCategory,
            variantsMin: runOptions.variantsMin,
            variantsMax: runOptions.variantsMax,
            activeRatio: runOptions.activeRatio,
        });

        console.log("[seed] Completed successfully.");
        console.table({
            categories: categoriesResult.count,
            products: catalogResult.products,
            productVariants: catalogResult.productVariants,
            productReviews: catalogResult.productReviews,
        });
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
});
