import type {
  CampaignFilterOption,
  CampaignSortOption,
  MarketingActionButton,
  MarketingCampaignRow,
  MarketingOverviewStat,
} from "../types";

export const marketingActionButtons: MarketingActionButton[] = [
  {
    id: "setup-flash-sale",
    label: "Thiết lập Flash Sale",
    style: "outline",
  },
  {
    id: "create-voucher",
    label: "Tạo Voucher mới",
    style: "primary",
  },
];

// Temporary mock metrics. Replace with external DB values later.
export const campaignRevenue30DaysMillions = 420.5;
export const campaignRevenueMonthlyGrowthPercent = 12.4;
export const averageRoiMultiplier = 4.8;
export const voucherUsagePercent = 64.2;
export const voucherUsageWeeklyChangePercent = -2.1;
export const runningCampaignCount = 12;

export const marketingOverviewStats: MarketingOverviewStat[] = [
  {
    id: "campaign-revenue",
    title: "DOANH THU CAMPAIGN (30 NGÀY)",
    mainValue: campaignRevenue30DaysMillions,
    unit: "VND_M",
    trendPercent: campaignRevenueMonthlyGrowthPercent,
    trendLabel: "so với tháng trước",
    tone: "neutral",
  },
  {
    id: "avg-roi",
    title: "ROI TRUNG BÌNH",
    mainValue: averageRoiMultiplier,
    unit: "X",
    healthLabel: "Chỉ số sức khỏe: Tốt",
    tone: "neutral",
  },
  {
    id: "voucher-usage",
    title: "TỶ LỆ SỬ DỤNG VOUCHER",
    mainValue: voucherUsagePercent,
    unit: "PERCENT",
    trendPercent: voucherUsageWeeklyChangePercent,
    trendLabel: "tức tuần trước",
    tone: "neutral",
  },
  {
    id: "running-campaigns",
    title: "CHIẾN DỊCH ĐANG CHẠY",
    mainValue: runningCampaignCount,
    unit: "COUNT",
    tone: "blue",
    channelBadges: ["VC", "FS", "+3"],
  },
];

export const campaignFilterOptions: CampaignFilterOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "voucher", label: "Voucher" },
  { value: "flash-sale", label: "Flash Sale" },
];

export const campaignSortOptions: CampaignSortOption[] = [
  { value: "revenue-desc", label: "Doanh thu cao nhất" },
  { value: "roi-desc", label: "ROI cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

export const totalCampaignCount = 28;

const campaignSeeds: [MarketingCampaignRow, ...MarketingCampaignRow[]] = [
  {
    id: "CAM-92831",
    campaignName: "Chào hè rực rỡ 2024",
    campaignCode: "ID: CAM-92831",
    type: "VOUCHER",
    dateRangeLabel: "01/06 - 30/06",
    sortDateValue: "2024-06-30",
    budgetMillions: 50,
    revenueMillions: 245.8,
    roiMultiplier: 4.9,
    status: "HOẠT ĐỘNG",
  },
  {
    id: "CAM-92845",
    campaignName: "Midnight Flash Sale 6/6",
    campaignCode: "ID: CAM-92845",
    type: "FLASH_SALE",
    dateRangeLabel: "06/06 00:00 - 02:00",
    sortDateValue: "2024-06-06",
    budgetMillions: 15,
    revenueMillions: 82.4,
    roiMultiplier: 5.5,
    status: "HOẠT ĐỘNG",
  },
  {
    id: "CAM-91002",
    campaignName: "Khách hàng mới - Tháng 5",
    campaignCode: "ID: CAM-91002",
    type: "VOUCHER",
    dateRangeLabel: "01/05 - 31/05",
    sortDateValue: "2024-05-31",
    budgetMillions: 20,
    revenueMillions: 68.2,
    roiMultiplier: 3.4,
    status: "KẾT THÚC",
  },
  {
    id: "CAM-90563",
    campaignName: "Weekend Deals",
    campaignCode: "ID: CAM-90563",
    type: "FLASH_SALE",
    dateRangeLabel: "24/05 20:00 - 26/05 23:00",
    sortDateValue: "2024-05-26",
    budgetMillions: 18,
    revenueMillions: 74.3,
    roiMultiplier: 4.1,
    status: "HOẠT ĐỘNG",
  },
];

export const marketingCampaignRows: MarketingCampaignRow[] = Array.from({ length: 28 }, (_, index) => {
  const seed = campaignSeeds[index % campaignSeeds.length]!;
  const serial = (index + 1).toString().padStart(2, "0");

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
    campaignCode: `ID: ${seed.id}-${serial}`,
    revenueMillions: Number((seed.revenueMillions - (index % 5) * 1.7).toFixed(1)),
    budgetMillions: Number((seed.budgetMillions + (index % 3) * 2).toFixed(1)),
    roiMultiplier: Number((seed.roiMultiplier - (index % 4) * 0.2).toFixed(1)),
  };
});
