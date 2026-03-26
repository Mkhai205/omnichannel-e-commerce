import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "./generated/prisma/client.js";
import { PrismaClient } from "./generated/prisma/client.js";

type PrismaClientFactoryOptions = {
    connectionString: string;
    min?: number;
    max?: number;
    connectionTimeoutMillis?: number;
    log?: Prisma.PrismaClientOptions["log"];
    errorFormat?: Prisma.PrismaClientOptions["errorFormat"];
};

export function createPrismaAdapter(options: {
    connectionString: string;
    min?: number;
    max?: number;
    connectionTimeoutMillis?: number;
}) {
    return new PrismaPg({
        connectionString: options.connectionString,
        min: options.min,
        max: options.max,
        connectionTimeoutMillis: options.connectionTimeoutMillis,
    });
}

export function createPrismaClient(options: PrismaClientFactoryOptions) {
    const adapter = createPrismaAdapter({
        connectionString: options.connectionString,
        min: options.min,
        max: options.max,
        connectionTimeoutMillis: options.connectionTimeoutMillis,
    });

    return new PrismaClient({
        adapter,
        log: options.log,
        errorFormat: options.errorFormat ?? "pretty",
    });
}

const connectionString = `${process.env.DATABASE_URL}`;

const prisma = createPrismaClient({ connectionString });

export { prisma };
