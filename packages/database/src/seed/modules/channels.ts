import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";

const CHANNEL_TYPES = ["WEB", "TIKTOK_MOCK", "SHOPEE_MOCK"] as const;

export async function seedChannels(prisma: PrismaClient): Promise<number> {
    const shops = await prisma.shop.findMany({
        select: {
            id: true,
        },
    });

    if (shops.length === 0) {
        return 0;
    }

    const records: Prisma.SellerChannelConnectionCreateManyInput[] = shops.flatMap((shop) =>
        CHANNEL_TYPES.map((channelType) => ({
            shopId: shop.id,
            channelType,
            status: channelType === "WEB" ? "CONNECTED" : "DISCONNECTED",
            externalShopId: null,
            accessToken: null,
            refreshToken: null,
            tokenExpiresAt: null,
            lastSyncedAt: null,
        })),
    );

    const result = await prisma.sellerChannelConnection.createMany({
        data: records,
        skipDuplicates: true,
    });

    return result.count;
}
