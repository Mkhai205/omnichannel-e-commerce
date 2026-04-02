import type {
  InventoryActionButton,
  InventoryOverviewStats,
  InventoryProductRow,
  WarehouseFilterOption,
} from "../types";

export const inventoryActionButtons: InventoryActionButton[] = [
  {
    id: "audit-report",
    label: "Báo cáo kiểm kê",
    style: "outline",
  },
  {
    id: "stock-in",
    label: "Nhập kho",
    style: "primary",
  },
  {
    id: "stock-out",
    label: "Xuất kho",
    style: "outline",
  },
];

export const inventoryOverviewStats: InventoryOverviewStats = {
  totalInventoryValue: "4.82B",
  totalInventoryCurrency: "VND",
  monthlyGrowthPercent: "+12.4% so với tháng trước",
  lowStockCount: 18,
  lowStockLabel: "MẶT HÀNG DƯỚI NGƯỠNG",
  lowStockCta: "Xem chi tiết cảnh báo",
  inboundToday: 124,
  outboundToday: 256,
  inboundProgressPercent: 68,
};

export const warehouseFilterOptions: WarehouseFilterOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "hcm", label: "Kho HCM" },
  { value: "hn", label: "Kho HN" },
];

export const totalInventoryProducts = 1452;

const inventoryRowSeeds: [InventoryProductRow, ...InventoryProductRow[]] = [
  {
    sku: "APL-M3P-14BK",
    productName: "MacBook Pro 14\" M3",
    categoryLabel: "ELECTRONICS",
    brandLabel: "APPLE",
    warehouseName: "HCM - Quận 7",
    warehouseFilterValue: "hcm",
    currentStock: 42,
    status: "CÒN HÀNG",
  },
  {
    sku: "SNY-WH1-MX5",
    productName: "Sony WH-1000XM5",
    categoryLabel: "AUDIO",
    brandLabel: "SONY",
    warehouseName: "HN - Mỹ Đình",
    warehouseFilterValue: "hn",
    currentStock: 8,
    status: "SẮP HẾT",
  },
  {
    sku: "LOG-MXM-3S",
    productName: "Logitech MX Master 3S",
    categoryLabel: "ACCESSORIES",
    brandLabel: "LOGITECH",
    warehouseName: "HCM - Quận 7",
    warehouseFilterValue: "hcm",
    currentStock: 0,
    status: "HẾT HÀNG",
  },
  {
    sku: "DLS-G15-5510",
    productName: "Dell G15 5510",
    categoryLabel: "ELECTRONICS",
    brandLabel: "DELL",
    warehouseName: "HN - Cầu Giấy",
    warehouseFilterValue: "hn",
    currentStock: 17,
    status: "CÒN HÀNG",
  },
  {
    sku: "APL-IPD-AIR6",
    productName: "iPad Air 6",
    categoryLabel: "TABLET",
    brandLabel: "APPLE",
    warehouseName: "HCM - Thủ Đức",
    warehouseFilterValue: "hcm",
    currentStock: 10,
    status: "SẮP HẾT",
  },
  {
    sku: "SMS-S24-ULTR",
    productName: "Samsung S24 Ultra",
    categoryLabel: "MOBILE",
    brandLabel: "SAMSUNG",
    warehouseName: "HN - Mỹ Đình",
    warehouseFilterValue: "hn",
    currentStock: 31,
    status: "CÒN HÀNG",
  },
];

export const inventoryProductRows: InventoryProductRow[] = Array.from({ length: 36 }, (_, index) => {
  const seed = inventoryRowSeeds[index % inventoryRowSeeds.length]!;
  const skuOrder = (index + 1).toString().padStart(2, "0");

  return {
    ...seed,
    sku: `${seed.sku}-${skuOrder}`,
    currentStock: Math.max(0, seed.currentStock - (index % 4)),
  };
});
