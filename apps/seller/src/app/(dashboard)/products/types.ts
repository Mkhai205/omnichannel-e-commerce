export type ProductActionId = "add-csv-file" | "sync-all";

export type ProductActionStyle = "outline" | "primary";

export type ProductStatus = "ĐANG BÁN" | "NGỪNG BÁN" | "BẢN NHÁP";

export type ProductChannel = "Shopee" | "TikTok" | "Lazada" | "Khác";

export type ProductChannelFilter = "all" | "tiktok" | "lazada" | "shopee" | "other";

export type ProductSyncFilter = "all" | "synced" | "not-synced";

export type ProductSyncStatus = "ĐÃ ĐỒNG BỘ" | "CHƯA ĐỒNG BỘ";

export interface ProductActionButton {
    id: ProductActionId;
    label: string;
    style: ProductActionStyle;
    isDisabled?: boolean;
    tooltip?: string;
}

export interface ProductOverviewStats {
    totalGoodsCount: number;
    sellingGoodsCount: number;
    unsyncedGoodsCount: number;
    channelCount: number;
}

export interface ProductFilterOption<TValue extends string> {
    value: TValue;
    label: string;
}

export interface ProductFilterValues {
    syncStatus: ProductSyncFilter;
    channel: ProductChannelFilter;
    keyword: string;
}

export interface ProductRow {
    id: string;
    productId: string;
    sku: string;
    productName: string;
    categoryLabel: string;
    channel: ProductChannel;
    listedPrice: number;
    promotionalPrice: number;
    status: ProductStatus;
    syncStatus: ProductSyncStatus;
}
