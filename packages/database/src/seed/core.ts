import type { PrismaClient } from "../generated/prisma/client.js";
import type { SeedSummary } from "./types.js";
import { seedAddresses } from "./modules/addresses.js";
import { seedCarts } from "./modules/carts.js";
import { seedCatalog } from "./modules/catalog.js";
import { seedCategories } from "./modules/categories.js";
import { seedChannels } from "./modules/channels.js";
import { seedFinance } from "./modules/finance.js";
import { seedOrders } from "./modules/orders.js";
import { seedShops } from "./modules/shops.js";
import { seedUsers } from "./modules/users.js";

export async function seedCore(prisma: PrismaClient): Promise<SeedSummary> {
    const users = await seedUsers(prisma);
    const shops = await seedShops(prisma);
    const channels = await seedChannels(prisma);
    const categoriesResult = await seedCategories(prisma);
    const { products, productVariants, productReviews, variants } = await seedCatalog(prisma, {
        categoryRecords: categoriesResult.records,
        customerIds: users.customerIds,
        shopIds: shops.records.map((item) => item.id),
    });
    const addresses = await seedAddresses(prisma);
    const { carts, cartItems } = await seedCarts(prisma, {
        customerIds: users.customerIds,
        variants,
    });
    const { orders, orderItems, records } = await seedOrders(prisma, {
        customerIds: users.customerIds,
        shopIds: shops.records.map((item) => item.id),
        variants,
        addresses: addresses.records,
    });
    const finance = await seedFinance(prisma, {
        orderRecords: records,
        shopIds: shops.records.map((item) => item.id),
    });

    return {
        users: users.count,
        shops: shops.count,
        channels,
        categories: categoriesResult.count,
        products,
        productVariants,
        productReviews,
        addresses: addresses.count,
        carts,
        cartItems,
        orders,
        orderItems,
        payments: finance.payments,
        paymentOrders: finance.paymentOrders,
        paymentWebhookLogs: finance.paymentWebhookLogs,
        adminWallets: finance.adminWallets,
        adminWalletLedgers: finance.adminWalletLedgers,
        sellerWallets: finance.sellerWallets,
        sellerSettlements: finance.sellerSettlements,
    };
}
