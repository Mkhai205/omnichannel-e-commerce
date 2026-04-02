import type { OrderRow, Stats } from "../types";

export const totalOrdersCount = 1248;

export const orderStats: Stats = {
  pendingConfirmation: 24,
  shipping: 142,
};

export const channelOptions = [
  { value: "all", label: "Tất cả các kênh" },
  { value: "shopee", label: "Shopee" },
  { value: "tiktok", label: "TikTok" },
  { value: "lazada", label: "Lazada" },
];

export const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "success", label: "Thành công" },
];

const baseOrderRows: [OrderRow, ...OrderRow[]] = [
  {
    id: "#ORD-94821",
    orderedAt: "20 May, 2024 - 14:32",
    orderDateValue: "05/20/2024",
    channel: "Shopee",
    customerName: "Nguyễn Hoàng",
    customerLocation: "TP.Hồ Chí Minh",
    productPreviewLabels: ["Sneaker đỏ", "+1"],
    totalAmount: 1250000,
    status: "CHỜ XÁC NHẬN",
    actionLabel: "Chi tiết",
  },
  {
    id: "#ORD-94755",
    orderedAt: "20 May, 2024 - 11:15",
    orderDateValue: "05/20/2024",
    channel: "TikTok",
    customerName: "Minh Tú",
    customerLocation: "Hà Nội",
    productPreviewLabels: ["Tai nghe", ""],
    totalAmount: 890000,
    status: "ĐANG GIAO",
    actionLabel: "Chi tiết",
  },
  {
    id: "#ORD-94301",
    orderedAt: "19 May, 2024 - 09:20",
    orderDateValue: "05/19/2024",
    channel: "Lazada",
    customerName: "Khánh An",
    customerLocation: "Đà Nẵng",
    productPreviewLabels: ["Kính mát", ""],
    totalAmount: 3120000,
    status: "THÀNH CÔNG",
    actionLabel: "Chi tiết",
  },
];

export const orderRows: OrderRow[] = Array.from({ length: 24 }, (_, index) => {
  const seed = baseOrderRows[index % baseOrderRows.length]!;
  const orderNumber = 94821 - index * 13;

  return {
    ...seed,
    id: `#ORD-${orderNumber}`,
  };
});
