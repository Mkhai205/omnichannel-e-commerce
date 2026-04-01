import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import { slugify } from "../utils.js";

export async function seedShops(prisma: PrismaClient): Promise<number> {
    const approvedShopName = `${faker.company.name()} Store`;
    const pendingShopName = `${faker.company.name()} Depot`;
    const rejectedShopName = `${faker.company.name()} Outlet`;

    const shops: Prisma.ShopCreateManyInput[] = [
        {
            id: SEED_IDS.shops.approved,
            userId: SEED_IDS.users.sellerApproved,
            shopName: approvedShopName,
            slug: `${slugify(approvedShopName)}-approved`,
            description: faker.company.catchPhrase(),
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "APPROVED",
            rejectionReason: null,
        },
        {
            id: SEED_IDS.shops.pending,
            userId: SEED_IDS.users.sellerPending,
            shopName: pendingShopName,
            slug: `${slugify(pendingShopName)}-pending`,
            description: faker.company.catchPhrase(),
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "PENDING",
            rejectionReason: null,
        },
        {
            id: SEED_IDS.shops.rejected,
            userId: SEED_IDS.users.sellerRejected,
            shopName: rejectedShopName,
            slug: `${slugify(rejectedShopName)}-rejected`,
            description: faker.company.catchPhrase(),
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "REJECTED",
            rejectionReason: "Missing legal paperwork",
        },
    ];

    await prisma.shop.createMany({ data: shops });

    return shops.length;
}
