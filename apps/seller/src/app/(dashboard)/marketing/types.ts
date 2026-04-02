export type MarketingActionId = "setup-flash-sale" | "create-voucher";

export type MarketingActionStyle = "outline" | "primary";

export type MarketingStatId = "campaign-revenue" | "avg-roi" | "voucher-usage" | "running-campaigns";

export type MarketingStatTone = "neutral" | "blue";

export type MarketingCampaignType = "VOUCHER" | "FLASH_SALE";

export type MarketingCampaignStatus = "HOẠT ĐỘNG" | "KẾT THÚC";

export type CampaignFilterValue = "all" | "voucher" | "flash-sale";

export type CampaignSortValue = "revenue-desc" | "roi-desc" | "newest";

export interface MarketingActionButton {
  id: MarketingActionId;
  label: string;
  style: MarketingActionStyle;
}

export interface MarketingOverviewStat {
  id: MarketingStatId;
  title: string;
  mainValue: number;
  unit: "VND_M" | "X" | "PERCENT" | "COUNT";
  trendPercent?: number;
  trendLabel?: string;
  healthLabel?: string;
  tone: MarketingStatTone;
  channelBadges?: string[];
}

export interface CampaignFilterOption {
  value: CampaignFilterValue;
  label: string;
}

export interface CampaignSortOption {
  value: CampaignSortValue;
  label: string;
}

export interface MarketingCampaignRow {
  id: string;
  campaignName: string;
  campaignCode: string;
  type: MarketingCampaignType;
  dateRangeLabel: string;
  sortDateValue: string;
  budgetMillions: number;
  revenueMillions: number;
  roiMultiplier: number;
  status: MarketingCampaignStatus;
}
