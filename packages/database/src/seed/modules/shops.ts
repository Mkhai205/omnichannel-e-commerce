import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import type { SeedShopContext } from "../types.js";
import { slugify } from "../utils.js";
import { randomVietnameseShopDescription, randomVietnameseShopName } from "../vietnamese.js";

export async function seedShops(prisma: PrismaClient): Promise<SeedShopContext> {
    const sellerAShopName = randomVietnameseShopName();
    const sellerBShopName = randomVietnameseShopName();

    const shops: Prisma.ShopCreateManyInput[] = [
        {
            id: SEED_IDS.shops.sellerA,
            userId: SEED_IDS.users.sellerA,
            shopName: sellerAShopName,
            slug: `${slugify(sellerAShopName)}-seller-a`,
            description: randomVietnameseShopDescription(),
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "APPROVED",
            rejectionReason: null,
        },
        {
            id: SEED_IDS.shops.sellerB,
            userId: SEED_IDS.users.sellerB,
            shopName: sellerBShopName,
            slug: `${slugify(sellerBShopName)}-seller-b`,
            description: randomVietnameseShopDescription(),
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "APPROVED",
            rejectionReason: null,
        },
    ];

    await prisma.shop.createMany({ data: shops });

    return {
        count: shops.length,
        records: [
            {
                id: SEED_IDS.shops.sellerA,
                userId: SEED_IDS.users.sellerA,
            },
            {
                id: SEED_IDS.shops.sellerB,
                userId: SEED_IDS.users.sellerB,
            },
        ],
    };
}
