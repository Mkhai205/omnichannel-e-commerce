export type ShippingActionId = "export-report" | "auto-create-order";

export type ShippingActionStyle = "outline" | "primary";

export type ShippingTabFilter = "all" | "in-transit" | "issue";

export type ShippingOrderStatus = "ĐANG VẬN CHUYỂN" | "CHỜ XỬ LÝ HOÀN" | "GIAO THÀNH CÔNG";

export type ShippingStatTone = "blue" | "sky" | "green" | "red";

export type ShippingStatIcon = "pickup" | "transit" | "success" | "return";

export interface ShippingActionButton {
  id: ShippingActionId;
  label: string;
  style: ShippingActionStyle;
}

export interface ShippingOverviewStat {
  id: string;
  label: string;
  value: number;
  badgeText: string;
  tone: ShippingStatTone;
  icon: ShippingStatIcon;
}

export interface ShippingStatusTab {
  value: ShippingTabFilter;
  label: string;
}

export interface ShippingRow {
  id: string;
  customerName: string;
  providerName: string;
  status: ShippingOrderStatus;
  updatedAt: string;
  locationNote: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}
