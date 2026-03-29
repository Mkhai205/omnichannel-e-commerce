import type {
  ProductActionButton,
  ProductChannelFilter,
  ProductFilterOption,
  ProductOverviewStats,
  ProductSyncFilter,
  ProductRow,
  ProductSyncStatus,
} from "../types";

export const productsActionButtons: ProductActionButton[] = [
  {
    id: "add-csv-file",
    label: "Thêm file CSV",
    style: "outline",
  },
  {
    id: "sync-all",
    label: "Đồng bộ tất cả",
    style: "primary",
  },
];

// Temporary mock total. Replace with database aggregate value later.
export const totalProductsCount = 1248;

// Temporary mock values for overview cards. Replace with real aggregates from database later.
export const sellingGoodsCount = 932;
export const unsyncedGoodsCount = 115;

export const syncStatusOptions: ProductFilterOption<ProductSyncFilter>[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "synced", label: "Đồng bộ" },
  { value: "not-synced", label: "Chưa đồng bộ" },
];

export const channelOptions: ProductFilterOption<ProductChannelFilter>[] = [
  { value: "all", label: "Tất cả các kênh" },
  { value: "tiktok", label: "TikTok" },
  { value: "lazada", label: "Lazada" },
  { value: "shopee", label: "Shopee" },
];

export const channelCount = channelOptions.filter((option) => option.value !== "all").length;

export const productsOverviewStats: ProductOverviewStats = {
  totalGoodsCount: totalProductsCount,
  sellingGoodsCount,
  unsyncedGoodsCount,
  channelCount,
};

const syncStatusByFilter: Record<Exclude<ProductSyncFilter, "all">, ProductSyncStatus> = {
  synced: "ĐÃ ĐỒNG BỘ",
  "not-synced": "CHƯA ĐỒNG BỘ",
};

export const syncStatusLabelByFilter = syncStatusByFilter;

export const channelLabelByFilter: Record<Exclude<ProductChannelFilter, "all">, ProductRow["channel"]> = {
  tiktok: "TikTok",
  lazada: "Lazada",
  shopee: "Shopee",
};

const baseProductRows: [ProductRow, ...ProductRow[]] = [
  {
    id: "PRD-120001",
    sku: "APL-IP15-128-BLK",
    productName: "iPhone 15 128GB",
    categoryLabel: "ĐIỆN THOẠI",
    channel: "Shopee",
    listedPrice: 21990000,
    promotionalPrice: 20990000,
    status: "ĐANG BÁN",
    syncStatus: "ĐÃ ĐỒNG BỘ",
  },
  {
    id: "PRD-120002",
    sku: "SMS-S24-256-GRY",
    productName: "Samsung Galaxy S24 256GB",
    categoryLabel: "ĐIỆN THOẠI",
    channel: "TikTok",
    listedPrice: 19890000,
    promotionalPrice: 19290000,
    status: "ĐANG BÁN",
    syncStatus: "ĐÃ ĐỒNG BỘ",
  },
  {
    id: "PRD-120003",
    sku: "SNY-WHXM5-BLK",
    productName: "Sony WH-1000XM5",
    categoryLabel: "PHỤ KIỆN",
    channel: "Lazada",
    listedPrice: 7490000,
    promotionalPrice: 6990000,
    status: "NGỪNG BÁN",
    syncStatus: "CHƯA ĐỒNG BỘ",
  },
  {
    id: "PRD-120004",
    sku: "LOG-MXM3S-GR",
    productName: "Logitech MX Master 3S",
    categoryLabel: "PHỤ KIỆN",
    channel: "Shopee",
    listedPrice: 2490000,
    promotionalPrice: 2290000,
    status: "ĐANG BÁN",
    syncStatus: "ĐÃ ĐỒNG BỘ",
  },
  {
    id: "PRD-120005",
    sku: "DLS-G15-5510",
    productName: "Dell G15 5510",
    categoryLabel: "LAPTOP",
    channel: "Lazada",
    listedPrice: 26500000,
    promotionalPrice: 24990000,
    status: "NGỪNG BÁN",
    syncStatus: "CHƯA ĐỒNG BỘ",
  },
];

export const productRows: ProductRow[] = Array.from({ length: 36 }, (_, index) => {
  const seed = baseProductRows[index % baseProductRows.length]!;
  const serial = (index + 1).toString().padStart(2, "0");

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
    sku: `${seed.sku}-${serial}`,
  };
});
