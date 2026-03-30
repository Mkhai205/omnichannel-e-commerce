export type TimeFilterOption = {
  id: "today" | "7days" | "30days";
  label: string;
  isActive: boolean;
};

export type RevenuePoint = {
  month: string;
  value: number;
  barHeight: string;
  baselineHeight: string;
  isHighlighted?: boolean;
};

export type ChannelShare = {
  name: string;
  percent: number;
  colorClassName: string;
};

export type TopCustomer = {
  id: string;
  name: string;
  email: string;
  orders: string;
  ltv: string;
};

export type TopProduct = {
  id: string;
  name: string;
  subtitle: string;
  soldCount: string;
  revenue: string;
  growth: string;
};

export const analyticsHeader = {
  breadcrumb: ["TRANG CHỦ", "BÁO CÁO & PHÂN TÍCH"],
  title: "Báo cáo Hoạt động",
  description: "Phân tích chuyên sâu về hiệu suất kinh doanh đa kênh với độ chính xác tuyệt đối.",
};

export const timeFilters: TimeFilterOption[] = [
  { id: "today", label: "Hôm nay", isActive: false },
  { id: "7days", label: "7 ngày", isActive: false },
  { id: "30days", label: "30 ngày", isActive: true },
];

export const revenueSummary = {
  title: "DOANH THU THEO THỜI GIAN",
  total: "1,284.5M",
  growth: "+12.5%",
};

export const revenueData: RevenuePoint[] = [
  { month: "T01", value: 820, barHeight: "h-24", baselineHeight: "h-28" },
  { month: "T02", value: 930, barHeight: "h-32", baselineHeight: "h-36" },
  { month: "T03", value: 1284, barHeight: "h-44", baselineHeight: "h-52", isHighlighted: true },
  { month: "T04", value: 870, barHeight: "h-26", baselineHeight: "h-30" },
];

export const channelGrowth = {
  title: "TỈ LỆ KÊNH BÁN HÀNG",
  percent: 85,
};

export const channelShares: ChannelShare[] = [
  { name: "Shopify Store", percent: 65, colorClassName: "bg-blue-500" },
  { name: "Amazon Central", percent: 25, colorClassName: "bg-slate-500" },
  { name: "Lazada Mall", percent: 10, colorClassName: "bg-slate-300" },
];

export const topCustomers: TopCustomer[] = [
  {
    id: "cus-01",
    name: "Nguyễn Anh Tuấn",
    email: "tuan.nguyen@email.com",
    orders: "42 Đơn hàng",
    ltv: "245,800,000đ",
  },
  {
    id: "cus-02",
    name: "Lê Minh Thu",
    email: "thu.le@email.com",
    orders: "31 Đơn hàng",
    ltv: "182,500,000đ",
  },
];

export const topProducts: TopProduct[] = [
  {
    id: "prd-01",
    name: "Neo-Run 2024 Edition",
    subtitle: "842 sản phẩm đã bán",
    soldCount: "124.5M",
    revenue: "1.5M",
    growth: "+8%",
  },
  {
    id: "prd-02",
    name: "Smart Chrono Pro",
    subtitle: "615 sản phẩm đã bán",
    soldCount: "98.2M",
    revenue: "1.1M",
    growth: "+14%",
  },
];

export const footerMetrics = [
  { id: "cv", label: "TỶ LỆ CHUYỂN ĐỔI", value: "4.82%" },
  { id: "aov", label: "GIÁ TRỊ ĐƠN TRUNG BÌNH", value: "1.25M" },
];
