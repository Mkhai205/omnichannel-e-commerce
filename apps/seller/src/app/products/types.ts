export type ProductActionId = "add-csv-file" | "sync-all";

export type ProductActionStyle = "outline" | "primary";

export type ProductStatus = "ĐANG BÁN" | "NGỪNG BÁN";

export type ProductChannel = "Shopee" | "TikTok" | "Lazada";

export type ProductChannelFilter = "all" | "tiktok" | "lazada" | "shopee";

export type ProductSyncFilter = "all" | "synced" | "not-synced";

export type ProductSyncStatus = "ĐÃ ĐỒNG BỘ" | "CHƯA ĐỒNG BỘ";

export interface ProductActionButton {
  id: ProductActionId;
  label: string;
  style: ProductActionStyle;
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
  sku: string;
  productName: string;
  categoryLabel: string;
  channel: ProductChannel;
  listedPrice: number;
  promotionalPrice: number;
  status: ProductStatus;
  syncStatus: ProductSyncStatus;
}
