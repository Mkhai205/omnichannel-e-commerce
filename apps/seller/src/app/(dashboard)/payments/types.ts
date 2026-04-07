export type PaymentHeaderActionId = "export-pdf" | "export-excel";

export type PaymentStatusFilterValue = "all" | "settled" | "pending" | "mismatch";

export type PaymentTransactionStatus = "Đã về ví" | "Chờ xử lý";

export type PaymentActionTone = "primary" | "info";

export interface PaymentHeaderAction {
  id: PaymentHeaderActionId;
  label: string;
  style: "primary" | "outline";
}

export interface CashflowLegendItem {
  id: string;
  label: string;
  dotClassName: string;
}

export interface CashflowPoint {
  label: string;
  revenue: number;
  platformFee: number;
  profit: number;
  emphasize?: boolean;
}

export interface PaymentSummaryMetric {
  title: string;
  totalRevenueBillions: number;
  trendPercent: number;
  trendLabel: string;
}

export interface PaymentDiscrepancyWarning {
  title: string;
  amountVnd: number;
  description: string;
  ctaLabel: string;
}

export interface PaymentTransactionRow {
  id: string;
  orderCode: string;
  channelCode: string;
  channelName: string;
  channelTag: string;
  dateLabel: string;
  timeLabel: string;
  transactionType: string;
  amountVnd: number;
  platformFeeVnd?: number;
  status: PaymentTransactionStatus;
  warningLabel: string;
  actionLabel: string;
  actionTone: PaymentActionTone;
}

export interface PaymentStatusFilterOption {
  value: PaymentStatusFilterValue;
  label: string;
}

export interface PaymentSmartTip {
  title: string;
  heading: string;
  highlightedText: string;
  description: string;
  linkLabel: string;
}

export interface PaymentMonthlyReport {
  heading: string;
  description: string;
  ctaLabel: string;
}
