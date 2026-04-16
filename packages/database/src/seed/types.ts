import type { Prisma } from "../generated/prisma/client.js";

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

export type SeedUserContext = {
    count: number;
    adminId: string;
    sellerIds: string[];
    customerIds: string[];
};

export type SeedShopContext = {
    count: number;
    records: Array<{
        id: string;
        userId: string;
    }>;
};

export type SeedAddressContext = {
    count: number;
    records: Array<{
        id: string;
        userId: string;
    }>;
};

export type SeedOrderRecord = {
    id: string;
    orderNumber: string;
    shopId: string;
    userId: string;
    status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: string;
};

export type SeedSummary = {
    users: number;
    shops: number;
    channels: number;
    categories: number;
    products: number;
    productVariants: number;
    productReviews: number;
    addresses: number;
    carts: number;
    cartItems: number;
    orders: number;
    orderItems: number;
    payments: number;
    paymentOrders: number;
    paymentWebhookLogs: number;
    adminWallets: number;
    adminWalletLedgers: number;
    sellerWallets: number;
    sellerSettlements: number;
};

export type VariantSeedInput = {
    id: string;
    productId: string;
    shopId: string;
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
