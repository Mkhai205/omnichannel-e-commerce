import type { ProductItem } from "@repo/shared-types";
import type {
    ProductChannel,
    ProductOverviewStats,
    ProductRow,
    ProductStatus,
    ProductSyncStatus,
} from "../types";

const syncedStatusTokens = ["success", "synced", "ok", "done"];
const channelPriority: ProductChannel[] = ["Shopee", "TikTok", "Lazada"];

function mapProductStatus(status: ProductItem["status"]): ProductStatus {
    if (status === "ACTIVE") {
        return "ĐANG BÁN";
    }

    if (status === "DRAFT") {
        return "BẢN NHÁP";
    }

    return "NGỪNG BÁN";
}

function mapPrimaryChannel(syncStatus: ProductItem["omnichannelSyncStatus"]): ProductChannel {
    const keys = Object.keys(syncStatus).map((channel) => channel.toLowerCase());

    if (keys.includes("shopee")) {
        return "Shopee";
    }

    if (keys.includes("tiktok")) {
        return "TikTok";
    }

    if (keys.includes("lazada")) {
        return "Lazada";
    }

    return "Khác";
}

function mapSyncStatus(syncStatus: ProductItem["omnichannelSyncStatus"]): ProductSyncStatus {
    const values = Object.values(syncStatus);

    if (values.length === 0) {
        return "CHƯA ĐỒNG BỘ";
    }

    const isSynced = values.every((value) => {
        const normalized = String(value).toLowerCase();
        return syncedStatusTokens.some((token) => normalized.includes(token));
    });

    return isSynced ? "ĐÃ ĐỒNG BỘ" : "CHƯA ĐỒNG BỘ";
}

function toDisplayPrice(price?: string): number {
    if (!price) {
        return 0;
    }

    const parsed = Number(price);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function toProductRow(
    product: ProductItem,
    categoryMap: Record<string, string>,
): ProductRow {
    const primaryVariant = product.variants[0];
    const listedPrice = toDisplayPrice(primaryVariant?.price);

    return {
        id: product.id,
        productId: product.id,
        sku: primaryVariant?.sku ?? "N/A",
        productName: product.name,
        categoryLabel: categoryMap[product.categoryId] ?? "Chưa phân loại",
        channel: mapPrimaryChannel(product.omnichannelSyncStatus),
        listedPrice,
        promotionalPrice: listedPrice,
        status: mapProductStatus(product.status),
        syncStatus: mapSyncStatus(product.omnichannelSyncStatus),
    };
}

export function toProductsOverviewStats(input: {
    totalGoodsCount: number;
    sellingGoodsCount: number;
    rows: ProductRow[];
}): ProductOverviewStats {
    const channelSet = new Set(
        input.rows
            .map((row) => row.channel)
            .filter((channel): channel is Exclude<ProductChannel, "Khác"> =>
                channelPriority.includes(channel as Exclude<ProductChannel, "Khác">),
            ),
    );

    return {
        totalGoodsCount: input.totalGoodsCount,
        sellingGoodsCount: input.sellingGoodsCount,
        unsyncedGoodsCount: input.rows.filter((row) => row.syncStatus === "CHƯA ĐỒNG BỘ").length,
        channelCount: channelSet.size,
    };
}
