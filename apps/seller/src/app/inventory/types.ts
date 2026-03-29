export type InventoryActionId = "audit-report" | "stock-in" | "stock-out";

export type InventoryActionStyle = "outline" | "primary";

export type WarehouseFilter = "all" | "hcm" | "hn";

export type InventoryStatus = "CÒN HÀNG" | "SẮP HẾT" | "HẾT HÀNG";

export interface InventoryActionButton {
  id: InventoryActionId;
  label: string;
  style: InventoryActionStyle;
}

export interface InventoryOverviewStats {
  totalInventoryValue: string;
  totalInventoryCurrency: string;
  monthlyGrowthPercent: string;
  lowStockCount: number;
  lowStockLabel: string;
  lowStockCta: string;
  inboundToday: number;
  outboundToday: number;
  inboundProgressPercent: number;
}

export interface WarehouseFilterOption {
  value: WarehouseFilter;
  label: string;
}

export interface InventoryProductRow {
  sku: string;
  productName: string;
  categoryLabel: string;
  brandLabel: string;
  warehouseName: string;
  warehouseFilterValue: Exclude<WarehouseFilter, "all">;
  currentStock: number;
  status: InventoryStatus;
}
