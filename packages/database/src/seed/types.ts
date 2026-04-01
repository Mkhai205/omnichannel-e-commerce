import type { Prisma } from "../generated/prisma/client.js";

export type SeedSummary = {
    users: number;
    shops: number;
    categories: number;
    products: number;
    productVariants: number;
    inventoryLogs: number;
    addresses: number;
    carts: number;
    cartItems: number;
    orders: number;
    orderItems: number;
};

export type VariantSeedInput = {
    id: string;
    productId: string;
    sku: string;
    attributes: Prisma.InputJsonValue;
    price: string;
    imageKey: string;
    stockQuantity: number;
};

export type CatalogSeedResult = {
    products: number;
    productVariants: number;
    inventoryLogs: number;
    variants: VariantSeedInput[];
};
