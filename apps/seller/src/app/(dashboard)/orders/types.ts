export type OrderStatus = "CHỜ XÁC NHẬN" | "ĐANG GIAO" | "THÀNH CÔNG";

export interface Stats {
  pendingConfirmation: number;
  shipping: number;
}

export interface FilterValues {
  channel: string;
  status: string;
  orderDate: string;
}

export interface OrderRow {
  id: string;
  orderedAt: string;
  orderDateValue: string;
  channel: string;
  customerName: string;
  customerLocation: string;
  productPreviewLabels: string[];
  totalAmount: number;
  status: OrderStatus;
  actionLabel: string;
}
