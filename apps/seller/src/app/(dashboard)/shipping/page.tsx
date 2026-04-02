"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    OrderStatus,
    SellerOrdersListResponse,
    SellerShippingMetricsResponse,
} from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import { getSellerShippingMetrics, getSellerShippingOrders } from "@/services/shipping-service";
import { ShippingHeader } from "./_components/shipping-header";
import { ShippingOrdersTable } from "./_components/shipping-orders-table";
import { ShippingOverviewCards } from "./_components/shipping-overview-cards";
import type {
    ShippingActionButton,
    ShippingOverviewStat,
    ShippingRow,
    ShippingStatusTab,
    ShippingTabFilter,
} from "./types";

const shippingActionButtons: ShippingActionButton[] = [
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

const shippingStatusTabs: ShippingStatusTab[] = [
    { value: "all", label: "Tất cả" },
    { value: "in-transit", label: "Đang giao" },
    { value: "issue", label: "Sự cố" },
];

const defaultMetrics: SellerShippingMetricsResponse = {
    pickupCount: 0,
    inTransitCount: 0,
    deliveredCount: 0,
    returnPendingCount: 0,
    pickupGrowthPercent: 0,
    inTransitGrowthPercent: 0,
    deliveryRatePercent: 0,
};

function mapTabToOrderStatus(tab: ShippingTabFilter): OrderStatus | undefined {
    if (tab === "in-transit") {
        return "SHIPPED";
    }

    if (tab === "issue") {
        return "CANCELLED";
    }

    return undefined;
}

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
}

function toShippingStatus(status: OrderStatus): ShippingRow["status"] {
    if (status === "DELIVERED") {
        return "GIAO THÀNH CÔNG";
    }

    if (status === "CANCELLED") {
        return "CHỜ XỬ LÝ HOÀN";
    }

    return "ĐANG VẬN CHUYỂN";
}

function toLocationNote(status: ShippingRow["status"]): string {
    if (status === "GIAO THÀNH CÔNG") {
        return "Đã bàn giao cho khách";
    }

    if (status === "CHỜ XỬ LÝ HOÀN") {
        return "Đơn hàng bị hủy hoặc cần xử lý lại";
    }

    return "Đang vận chuyển đến khách hàng";
}

function toOverviewStats(metrics: SellerShippingMetricsResponse): ShippingOverviewStat[] {
    return [
        {
            id: "pickup",
            label: "ĐANG LẤY HÀNG",
            value: metrics.pickupCount,
            badgeText: `+${metrics.pickupGrowthPercent}%`,
            tone: "blue",
            icon: "pickup",
        },
        {
            id: "in-transit",
            label: "ĐANG VẬN CHUYỂN",
            value: metrics.inTransitCount,
            badgeText: `+${metrics.inTransitGrowthPercent}%`,
            tone: "sky",
            icon: "transit",
        },
        {
            id: "success",
            label: "GIAO THÀNH CÔNG",
            value: metrics.deliveredCount,
            badgeText: `${metrics.deliveryRatePercent}%`,
            tone: "green",
            icon: "success",
        },
        {
            id: "return-pending",
            label: "CHỜ XỬ LÝ HOÀN",
            value: metrics.returnPendingCount,
            badgeText: "LIVE",
            tone: "red",
            icon: "return",
        },
    ];
}

export default function ShippingPage() {
    const [activeTab, setActiveTab] = useState<ShippingTabFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersResponse, setOrdersResponse] = useState<SellerOrdersListResponse | null>(null);
    const [metrics, setMetrics] = useState<SellerShippingMetricsResponse>(defaultMetrics);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const pageSize = 10;

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [orders, metricsResponse] = await Promise.all([
                    getSellerShippingOrders({
                        page: currentPage,
                        limit: pageSize,
                        status: mapTabToOrderStatus(activeTab),
                    }),
                    getSellerShippingMetrics(),
                ]);

                if (!isMounted) {
                    return;
                }

                setOrdersResponse(orders);
                setMetrics(metricsResponse);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải dữ liệu vận đơn. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, [activeTab, currentPage]);

    const rows = useMemo<ShippingRow[]>(() => {
        return (ordersResponse?.data ?? []).map((order) => {
            const status = toShippingStatus(order.status);

            return {
                id: order.orderNumber,
                customerName: `Khách hàng #${order.userId.slice(0, 8)}`,
                providerName: "Nội bộ hệ thống",
                status,
                updatedAt: formatDateTime(order.updatedAt),
                locationNote: toLocationNote(status),
                primaryActionLabel: status === "CHỜ XỬ LÝ HOÀN" ? "XỬ LÝ" : "CHI TIẾT",
                secondaryActionLabel: status === "GIAO THÀNH CÔNG" ? "BIÊN BẢN" : "THEO DÕI",
            };
        });
    }, [ordersResponse?.data]);

    const overviewStats = useMemo(() => toOverviewStats(metrics), [metrics]);
    const totalPages = Math.max(1, ordersResponse?.meta.totalPages ?? 1);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <ShippingHeader actions={shippingActionButtons} />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <ShippingOverviewCards stats={overviewStats} />

            <ShippingOrdersTable
                rows={rows}
                tabs={shippingStatusTabs}
                activeTab={activeTab}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                filteredRowCount={ordersResponse?.meta.totalItems ?? 0}
                totalShippingOrders={ordersResponse?.meta.totalItems ?? 0}
                isLoading={isLoading}
                onTabChange={(value) => {
                    setActiveTab(value);
                    setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
            />
        </section>
    );
}
