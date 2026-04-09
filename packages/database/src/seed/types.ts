import type { Prisma } from "../generated/prisma/client.js";

export type SeedMode = "full" | "catalog";

export type SeedCategoryRecord = {
    key: string;
    id: string;
    slug: string;
    catalogKey: string;
    includeInExtraCatalog: boolean;
};

export type SeedCategoriesResult = {
    count: number;
    records: SeedCategoryRecord[];
};

export type CatalogSeedOptions = {
    includeFixedProducts?: boolean;
    categoryRecords?: SeedCategoryRecord[];
    productsPerCategory?: number;
    variantsMin?: number;
    variantsMax?: number;
    activeRatio?: number;
};

export type SeedSummary = {
    users: number;
    shops: number;
    categories: number;
    products: number;
    productVariants: number;
    productReviews: number;
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
    stockQuantity: number;
};

export type ProductReviewSeedInput = {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment?: string | null;
};

export type CatalogSeedResult = {
    products: number;
    productVariants: number;
    productReviews: number;
    variants: VariantSeedInput[];
};
