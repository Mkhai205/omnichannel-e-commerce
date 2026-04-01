import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import { slugify } from "../utils.js";
import { randomVietnameseShopDescription, randomVietnameseShopName } from "../vietnamese.js";

export async function seedShops(prisma: PrismaClient): Promise<number> {
    const approvedShopName = randomVietnameseShopName();
    const pendingShopName = randomVietnameseShopName();
    const rejectedShopName = randomVietnameseShopName();

    const shops: Prisma.ShopCreateManyInput[] = [
        {
            id: SEED_IDS.shops.approved,
            userId: SEED_IDS.users.sellerApproved,
            shopName: approvedShopName,
            slug: `${slugify(approvedShopName)}-approved`,
            description: randomVietnameseShopDescription(),
            avatarKey: `shops/${SEED_IDS.shops.approved}/avatar.jpg`,
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "APPROVED",
            rejectionReason: null,
        },
        {
            id: SEED_IDS.shops.pending,
            userId: SEED_IDS.users.sellerPending,
            shopName: pendingShopName,
            slug: `${slugify(pendingShopName)}-pending`,
            description: randomVietnameseShopDescription(),
            avatarKey: `shops/${SEED_IDS.shops.pending}/avatar.jpg`,
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "PENDING",
            rejectionReason: null,
        },
        {
            id: SEED_IDS.shops.rejected,
            userId: SEED_IDS.users.sellerRejected,
            shopName: rejectedShopName,
            slug: `${slugify(rejectedShopName)}-rejected`,
            description: randomVietnameseShopDescription(),
            avatarKey: `shops/${SEED_IDS.shops.rejected}/avatar.jpg`,
            businessLicense: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            status: "REJECTED",
            rejectionReason: "Thiếu hồ sơ pháp lý",
        },
    ];

    await prisma.shop.createMany({ data: shops });

    return shops.length;
}
