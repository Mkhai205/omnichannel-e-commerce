import type { PrismaClient } from "../generated/prisma/client.js";
import type { SeedSummary } from "./types.js";
import { seedAddresses } from "./modules/addresses.js";
import { seedCarts } from "./modules/carts.js";
import { seedCatalog } from "./modules/catalog.js";
import { seedCategories } from "./modules/categories.js";
import { seedOrders } from "./modules/orders.js";
import { seedShops } from "./modules/shops.js";
import { seedUsers } from "./modules/users.js";

export async function seedCore(prisma: PrismaClient): Promise<SeedSummary> {
    const users = await seedUsers(prisma);
    const shops = await seedShops(prisma);
    const categories = await seedCategories(prisma);
    const { products, productVariants, variants } = await seedCatalog(prisma);
    const addresses = await seedAddresses(prisma);
    const { carts, cartItems } = await seedCarts(prisma);
    const { orders, orderItems } = await seedOrders(prisma, variants);

    return {
        users,
        shops,
        categories,
        products,
        productVariants,
        addresses,
        carts,
        cartItems,
        orders,
        orderItems,
    };
}
