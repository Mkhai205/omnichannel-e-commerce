import { AnalyticsHeader } from "./_components/analytics-header";
import { AnalyticsSummaryFooter } from "./_components/analytics-summary-footer";
import { ChannelRateCard } from "./_components/channel-rate-card";
import { RevenueCard } from "./_components/revenue-card";
import { TopCustomersCard } from "./_components/top-customers-card";
import { TopProductsCard } from "./_components/top-products-card";
import {
  analyticsHeader,
  channelGrowth,
  channelShares,
  footerMetrics,
  revenueData,
  revenueSummary,
  timeFilters,
  topCustomers,
  topProducts,
} from "./data/analytics-mock-data";

export default function AnalyticsPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-4">
      <AnalyticsHeader
        title={analyticsHeader.title}
        description={analyticsHeader.description}
        timeFilters={timeFilters}
      />

      <div className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
        <RevenueCard title={revenueSummary.title} total={revenueSummary.total} growth={revenueSummary.growth} points={revenueData} />
        <ChannelRateCard title={channelGrowth.title} percent={channelGrowth.percent} channels={channelShares} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <TopCustomersCard customers={topCustomers} />
        <TopProductsCard products={topProducts} />
      </div>

      <AnalyticsSummaryFooter metrics={footerMetrics} />
    </section>
  );
}
