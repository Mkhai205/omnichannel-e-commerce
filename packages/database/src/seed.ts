import "dotenv/config";
import { faker } from "./seed/faker.js";
import { createPrismaClient } from "./client.js";
import { cleanDatabase } from "./seed/cleanup.js";
import { getRequiredDatabaseUrl, parseSeedRunOptions } from "./seed/config.js";
import { seedCore } from "./seed/core.js";
import { seedCatalog } from "./seed/modules/catalog.js";
import { seedCategories } from "./seed/modules/categories.js";

async function main(): Promise<void> {
    const databaseUrl = getRequiredDatabaseUrl();
    const runOptions = parseSeedRunOptions(process.argv.slice(2), process.env);

    // Keep the safety guard optional to avoid breaking existing non-local development flow.
    // if (process.env.SEED_LOCAL_ONLY === "true") {
    //     assertLocalDatabase(databaseUrl);
    // }

    faker.seed(runOptions.seedValue);

    const prisma = createPrismaClient({
        connectionString: databaseUrl,
        log: ["error", "warn"],
    });

    try {
        console.log(`[seed] Using seed value: ${runOptions.seedValue}`);
        console.log(`[seed] Mode: ${runOptions.mode}`);

        if (runOptions.mode === "full") {
            console.log("[seed] Cleaning database...");
            await cleanDatabase(prisma);

            console.log("[seed] Creating core fixtures...");
            const summary = await seedCore(prisma, {
                catalog: {
                    includeFixedProducts: true,
                    productsPerCategory: runOptions.productsPerCategory,
                    variantsMin: runOptions.variantsMin,
                    variantsMax: runOptions.variantsMax,
                    activeRatio: runOptions.activeRatio,
                },
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
        });
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
});
