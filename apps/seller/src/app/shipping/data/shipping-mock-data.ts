import type { ShippingActionButton, ShippingOverviewStat, ShippingRow, ShippingStatusTab } from "../types";

export const shippingActionButtons: ShippingActionButton[] = [
  {
    id: "export-report",
    label: "Xuất báo cáo",
    style: "outline",
  },
  {
    id: "auto-create-order",
    label: "Tạo đơn tự động",
    style: "primary",
  },
];

// Temporary mock aggregates for overview cards. Replace with DB values later.
export const pickupCount = 248;
export const inTransitCount = 1102;
export const deliveredCount = 8430;
export const returnPendingCount = 42;

// Temporary mock percent values for overview badges. Replace with DB values later.
export const pickupGrowthPercent = 12;
export const inTransitGrowthPercent = 5.2;
export const deliveryRatePercent = 98;

export const shippingOverviewStats: ShippingOverviewStat[] = [
  {
    id: "pickup",
    label: "ĐANG LẤY HÀNG",
    value: pickupCount,
    badgeText: `+${pickupGrowthPercent}%`,
    tone: "blue",
    icon: "pickup",
  },
  {
    id: "in-transit",
    label: "ĐANG VẬN CHUYỂN",
    value: inTransitCount,
    badgeText: `+${inTransitGrowthPercent}%`,
    tone: "sky",
    icon: "transit",
  },
  {
    id: "success",
    label: "GIAO THÀNH CÔNG",
    value: deliveredCount,
    badgeText: `${deliveryRatePercent}%`,
    tone: "green",
    icon: "success",
  },
  {
    id: "return-pending",
    label: "CHỜ XỬ LÝ HOÀN",
    value: returnPendingCount,
    badgeText: "Action",
    tone: "red",
    icon: "return",
  },
];

export const shippingStatusTabs: ShippingStatusTab[] = [
  { value: "all", label: "Tất cả" },
  { value: "in-transit", label: "Đang giao" },
  { value: "issue", label: "Sự cố" },
];

export const totalShippingOrdersCount = 10821;

const shippingRowSeeds: [ShippingRow, ...ShippingRow[]] = [
  {
    id: "ML-8821945",
    customerName: "Lê Văn Tùng",
    providerName: "Giao Hàng Tiết Kiệm",
    status: "ĐANG VẬN CHUYỂN",
    updatedAt: "14:20 - Hôm nay",
    locationNote: "Kho TP. Hồ Chí Minh",
    primaryActionLabel: "CHI TIẾT",
    secondaryActionLabel: "KHIẾU NẠI",
  },
  {
    id: "ML-8812002",
    customerName: "Nguyễn Minh Khang",
    providerName: "Giao Hàng Nhanh",
    status: "CHỜ XỬ LÝ HOÀN",
    updatedAt: "09:15 - Hôm nay",
    locationNote: "Lỗi địa chỉ nhận",
    primaryActionLabel: "XỬ LÝ HOÀN",
    secondaryActionLabel: "KHIẾU NẠI",
  },
  {
    id: "ML-8804781",
    customerName: "Trần Tuấn Anh",
    providerName: "Viettel Post",
    status: "GIAO THÀNH CÔNG",
    updatedAt: "17:50 - Hôm qua",
    locationNote: "Đã bàn giao cho khách",
    primaryActionLabel: "CHI TIẾT",
    secondaryActionLabel: "BIÊN BẢN",
  },
  {
    id: "ML-8791027",
    customerName: "Phạm Nhật Linh",
    providerName: "Shopee Express",
    status: "ĐANG VẬN CHUYỂN",
    updatedAt: "11:05 - Hôm qua",
    locationNote: "Trung chuyển Đà Nẵng",
    primaryActionLabel: "CHI TIẾT",
    secondaryActionLabel: "KHIẾU NẠI",
  },
  {
    id: "ML-8789013",
    customerName: "Hoàng Nam",
    providerName: "Ninja Van",
    status: "CHỜ XỬ LÝ HOÀN",
    updatedAt: "16:30 - 2 ngày trước",
    locationNote: "Khách từ chối nhận",
    primaryActionLabel: "XỬ LÝ HOÀN",
    secondaryActionLabel: "KHIẾU NẠI",
  },
];

export const shippingRows: ShippingRow[] = Array.from({ length: 32 }, (_, index) => {
  const seed = shippingRowSeeds[index % shippingRowSeeds.length]!;
  const serial = (index + 1).toString().padStart(2, "0");

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
  };
});
