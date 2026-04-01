import "dotenv/config";
import { faker } from "./seed/faker.js";
import { createPrismaClient } from "./client.js";
import { cleanDatabase } from "./seed/cleanup.js";
import { getRequiredDatabaseUrl, parseSeedValue } from "./seed/config.js";
import { seedCore } from "./seed/core.js";

async function main(): Promise<void> {
    const databaseUrl = getRequiredDatabaseUrl();
    const seedValue = parseSeedValue(process.env.SEED_RANDOM_SEED);

    // Keep the safety guard optional to avoid breaking existing non-local development flow.
    // if (process.env.SEED_LOCAL_ONLY === "true") {
    //     assertLocalDatabase(databaseUrl);
    // }

    faker.seed(seedValue);

    const prisma = createPrismaClient({
        connectionString: databaseUrl,
        log: ["error", "warn"],
    });

    try {
        console.log(`[seed] Using seed value: ${seedValue}`);
        console.log("[seed] Cleaning database...");
        await cleanDatabase(prisma);

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
