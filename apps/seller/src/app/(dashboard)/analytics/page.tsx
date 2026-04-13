"use client";

import { useEffect, useMemo, useState } from "react";
import type { SellerAnalyticsResponse, SellerAnalyticsTimeRange } from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import { getSellerAnalytics } from "@/services/payments-service";
import { AnalyticsHeader } from "./_components/analytics-header";
import { AnalyticsSummaryFooter } from "./_components/analytics-summary-footer";
import { ChannelRateCard } from "./_components/channel-rate-card";
import { RevenueCard } from "./_components/revenue-card";
import { TopCustomersCard } from "./_components/top-customers-card";
import { TopProductsCard } from "./_components/top-products-card";

const TITLE = "Báo cáo Hoạt động";
const DESCRIPTION =
    "Phân tích chuyên sâu về hiệu suất kinh doanh đa kênh với độ chính xác tuyệt đối.";
const FALLBACK_CONVERSION_RATE = "4.82%";

const TIME_FILTERS: Array<{ id: SellerAnalyticsTimeRange; label: string }> = [
    { id: "today", label: "Hôm nay" },
    { id: "7days", label: "7 ngày" },
    { id: "30days", label: "30 ngày" },
];

const DEFAULT_ANALYTICS: SellerAnalyticsResponse = {
    timeRange: "30days",
    totalRevenue: "0.00",
    trendPercent: 0,
    trendLabel: "so với kỳ trước",
    revenueSeries: [],
    channelGrowthPercent: 0,
    channelShares: [],
    topCustomers: [],
    topProducts: [],
    summary: {
        averageOrderValue: "0.00",
        conversionRatePercent: null,
    },
    generatedAt: new Date(0).toISOString(),
};

function toFiniteNumber(value: string): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return parsed;
}

function formatMoney(value: string): string {
    const amount = Math.round(toFiniteNumber(value));
    return `${amount.toLocaleString("vi-VN")}đ`;
}

function formatCompactMoney(value: string): string {
    const amount = toFiniteNumber(value);

    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(2)}B`;
    }

    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1)}M`;
    }

    return formatMoney(value);
}

function formatGrowth(value: number): string {
    const normalized = Number(value.toFixed(1));
    return `${normalized >= 0 ? "+" : ""}${normalized}%`;
}

export default function AnalyticsPage() {
    const [selectedRange, setSelectedRange] = useState<SellerAnalyticsTimeRange>("30days");
    const [analytics, setAnalytics] = useState<SellerAnalyticsResponse>(DEFAULT_ANALYTICS);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAnalytics = async () => {
            setIsLoading(true);

            try {
                const response = await getSellerAnalytics({ timeRange: selectedRange });

                if (!isMounted) {
                    return;
                }

                setAnalytics(response);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải dữ liệu analytics. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchAnalytics();

        return () => {
            isMounted = false;
        };
    }, [selectedRange]);

    const revenueTotal = useMemo(
        () => formatCompactMoney(analytics.totalRevenue),
        [analytics.totalRevenue],
    );
    const topCustomers = useMemo(
        () =>
            analytics.topCustomers.map((customer) => ({
                ...customer,
                lifetimeValue: formatMoney(customer.lifetimeValue),
            })),
        [analytics.topCustomers],
    );
    const topProducts = useMemo(
        () =>
            analytics.topProducts.map((product) => ({
                ...product,
                revenue: formatMoney(product.revenue),
            })),
        [analytics.topProducts],
    );
    const footerMetrics = useMemo(
        () => [
            { id: "cv", label: "TỶ LỆ CHUYỂN ĐỔI", value: FALLBACK_CONVERSION_RATE },
            {
                id: "aov",
                label: "GIÁ TRỊ ĐƠN TRUNG BÌNH",
                value: formatMoney(analytics.summary.averageOrderValue),
            },
        ],
        [analytics.summary.averageOrderValue],
    );

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-4">
            <AnalyticsHeader
                title={TITLE}
                description={DESCRIPTION}
                selectedTimeRange={selectedRange}
                timeFilters={TIME_FILTERS}
                onTimeRangeChange={setSelectedRange}
            />

            {errorMessage ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </p>
            ) : null}
            {isLoading ? (
                <p className="text-sm text-slate-500">Đang tải dữ liệu analytics...</p>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
                <RevenueCard
                    title="DOANH THU THEO THỜI GIAN"
                    total={revenueTotal}
                    growth={formatGrowth(analytics.trendPercent)}
                    points={analytics.revenueSeries}
                />
                <ChannelRateCard
                    title="TỈ LỆ KÊNH BÁN HÀNG"
                    percent={analytics.channelGrowthPercent}
                    channels={analytics.channelShares}
                />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
                <TopCustomersCard customers={topCustomers} />
                <TopProductsCard products={topProducts} />
            </div>

            <AnalyticsSummaryFooter metrics={footerMetrics} />
        </section>
    );
}
