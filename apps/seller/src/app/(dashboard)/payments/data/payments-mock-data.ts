import type {
  CashflowLegendItem,
  CashflowPoint,
  PaymentDiscrepancyWarning,
  PaymentHeaderAction,
  PaymentMonthlyReport,
  PaymentSmartTip,
  PaymentStatusFilterOption,
  PaymentSummaryMetric,
  PaymentTransactionRow,
} from "../types";

export const paymentHeaderActions: PaymentHeaderAction[] = [
  {
    id: "export-pdf",
    label: "Xuất PDF",
    style: "outline",
  },
  {
    id: "export-excel",
    label: "Tải Excel (.xlsx)",
    style: "primary",
  },
];

export const cashflowLegend: CashflowLegendItem[] = [
  {
    id: "revenue",
    label: "DOANH THU",
    dotClassName: "bg-blue-500",
  },
  {
    id: "platform-fee",
    label: "PHÍ SÀN",
    dotClassName: "bg-amber-400",
  },
  {
    id: "profit",
    label: "LỢI NHUẬN",
    dotClassName: "bg-emerald-500",
  },
];

export const cashflowPoints: CashflowPoint[] = [
  { label: "10/10", revenue: 640, platformFee: 96, profit: 544 },
  { label: "15/10", revenue: 700, platformFee: 101, profit: 599 },
  { label: "20/10", revenue: 750, platformFee: 108, profit: 642 },
  { label: "HÔM NAY", revenue: 820, platformFee: 117, profit: 703, emphasize: true },
  { label: "DỰ BÁO", revenue: 860, platformFee: 124, profit: 736 },
];

// Temporary mock metrics. Replace these variables with DB-backed values in the integration phase.
export const paymentTotalRevenueBillions = 1.24;
export const paymentRevenueTrendPercent = 12.5;
export const paymentDiscrepancyAmountVnd = -4_250_000;
export const paymentDiscrepancyOrderCount = 12;

export const paymentSummaryMetric: PaymentSummaryMetric = {
  title: "TỔNG DOANH THU",
  totalRevenueBillions: paymentTotalRevenueBillions,
  trendPercent: paymentRevenueTrendPercent,
  trendLabel: "so với tháng trước",
};

export const paymentDiscrepancyWarning: PaymentDiscrepancyWarning = {
  title: "CẢNH BÁO CHÊNH LỆCH",
  amountVnd: paymentDiscrepancyAmountVnd,
  description: `Phát hiện ${paymentDiscrepancyOrderCount} đơn hàng có phí vận chuyển thực tế cao hơn sàn báo cáo.`,
  ctaLabel: "KIỂM TRA NGAY",
};

const transactionSeedRows: [PaymentTransactionRow, ...PaymentTransactionRow[]] = [
  {
    id: "PAY-001",
    orderCode: "ORD-882199-X",
    channelCode: "SP",
    channelName: "Shopee Mall",
    channelTag: "SHOPEE MALL",
    dateLabel: "24/10/2023",
    timeLabel: "14:32:10",
    transactionType: "Thanh toán đơn hàng",
    amountVnd: 1_250_000,
    platformFeeVnd: -25_000,
    status: "Đã về ví",
    warningLabel: "—",
    actionLabel: "CHI TIẾT",
    actionTone: "info",
  },
  {
    id: "PAY-002",
    orderCode: "LAZ-009912-A",
    channelCode: "LA",
    channelName: "Lazada Local",
    channelTag: "LAZADA LOCAL",
    dateLabel: "24/10/2023",
    timeLabel: "12:15:05",
    transactionType: "Quyết toán vận chuyển",
    amountVnd: -42_000,
    status: "Chờ xử lý",
    warningLabel: "LỆCH +15K",
    actionLabel: "ĐỐI SOÁT",
    actionTone: "primary",
  },
  {
    id: "PAY-003",
    orderCode: "TK-8912-MM",
    channelCode: "TK",
    channelName: "TikTok Shop",
    channelTag: "TIKTOK SHOP",
    dateLabel: "23/10/2023",
    timeLabel: "22:00:00",
    transactionType: "Thanh toán đơn hàng",
    amountVnd: 3_490_000,
    platformFeeVnd: -104_700,
    status: "Đã về ví",
    warningLabel: "—",
    actionLabel: "CHI TIẾT",
    actionTone: "info",
  },
  {
    id: "PAY-004",
    orderCode: "ORD-780233-B",
    channelCode: "SP",
    channelName: "Shopee Mall",
    channelTag: "SHOPEE MALL",
    dateLabel: "23/10/2023",
    timeLabel: "17:18:44",
    transactionType: "Thanh toán đơn hàng",
    amountVnd: 1_890_000,
    platformFeeVnd: -37_800,
    status: "Đã về ví",
    warningLabel: "—",
    actionLabel: "CHI TIẾT",
    actionTone: "info",
  },
  {
    id: "PAY-005",
    orderCode: "LAZ-010121-X",
    channelCode: "LA",
    channelName: "Lazada Local",
    channelTag: "LAZADA LOCAL",
    dateLabel: "22/10/2023",
    timeLabel: "09:05:11",
    transactionType: "Quyết toán vận chuyển",
    amountVnd: -55_000,
    status: "Chờ xử lý",
    warningLabel: "LỆCH +8K",
    actionLabel: "ĐỐI SOÁT",
    actionTone: "primary",
  },
];

export const paymentTransactionRows: PaymentTransactionRow[] = Array.from({ length: 20 }, (_, index) => {
  const seed = transactionSeedRows[index % transactionSeedRows.length]!;
  const serial = String(index + 1).padStart(2, "0");

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
    orderCode: `${seed.orderCode}-${serial}`,
  };
});

export const paymentStatusFilterOptions: PaymentStatusFilterOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "settled", label: "Đã về ví" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "mismatch", label: "Có cảnh báo lệch" },
];

export const totalPaymentTransactions = 1_240;

export const paymentSmartTip: PaymentSmartTip = {
  title: "MẸO ĐỐI SOÁT THÔNG MINH",
  heading: "Sử dụng tính năng",
  highlightedText: '"Đối soát tự động"',
  description: "để Merchant Ledger tự động so sánh cân nặng kiện hàng tại kho với dữ liệu vận chuyển từ sàn.",
  linkLabel: "TÌM HIỂU THÊM",
};

export const paymentMonthlyReport: PaymentMonthlyReport = {
  heading: "Báo cáo doanh thu tháng",
  description: "Phân tích sâu lợi nhuận ròng sau khi trừ chi phí vận hành và quảng cáo.",
  ctaLabel: "XEM BÁO CÁO CHI TIẾT",
};
