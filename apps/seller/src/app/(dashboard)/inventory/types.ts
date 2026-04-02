import type { InventoryStockStatus } from "@repo/shared-types";

export type InventoryActionId = "audit-report" | "stock-in" | "stock-out";

export type InventoryActionStyle = "outline" | "primary";

export type WarehouseFilter = "all" | string;

export type InventoryStatusFilter = "all" | InventoryStockStatus;

export type InventoryStatus = InventoryStockStatus;

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
    isDefault?: boolean;
}

export interface InventoryProductRow {
    variantId: string;
    sku: string;
    productName: string;
    categoryLabel: string;
    brandLabel: string;
    warehouseId: string;
    warehouseName: string;
    currentStock: number;
    status: InventoryStatus;
}
