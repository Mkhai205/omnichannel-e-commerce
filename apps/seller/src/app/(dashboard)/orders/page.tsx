"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
    OrderStatus,
    SalesChannelType,
    SellerChannelConnectionItem,
    SellerOrderItem,
    SellerOrdersFilterRequest,
} from "@repo/shared-types";
import { Button } from "@/components/ui";
import { getSellerChannels } from "@/services/channel-sync-service";
import { isApiRequestError } from "@/services/http-client";
import { getSellerOrders } from "@/services/orders-service";
import { OrdersFilters } from "./_components/orders-filters";
import { OrdersTable } from "./_components/orders-table";

const DEFAULT_PAGE_SIZE = 10;
const CHANNEL_ORDER: SalesChannelType[] = ["WEB", "TIKTOK_MOCK", "SHOPEE_MOCK"];

const CHANNEL_LABELS: Record<SalesChannelType, string> = {
    WEB: "Website nội bộ",
    TIKTOK_MOCK: "TikTok",
    SHOPEE_MOCK: "Shopee",
};

function parseMoney(value: string): number {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return 0;
    }

    return amount;
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<SellerOrderItem[]>([]);
    const [channelConnections, setChannelConnections] = useState<SellerChannelConnectionItem[]>([]);
    const [activeChannelType, setActiveChannelType] = useState<SalesChannelType>("WEB");
    const [keyword, setKeyword] = useState("");
    const [placedFrom, setPlacedFrom] = useState("");
    const [placedTo, setPlacedTo] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const updatePageSize = () => {
            if (window.innerHeight < 700) {
                setPageSize(4);
                return;
            }

            if (window.innerHeight < 900) {
                setPageSize(7);
                return;
            }

            setPageSize(DEFAULT_PAGE_SIZE);
        };

        updatePageSize();
        window.addEventListener("resize", updatePageSize);

        return () => {
            window.removeEventListener("resize", updatePageSize);
        };
    }, []);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);

        try {
            const filters: SellerOrdersFilterRequest = {
                page: currentPage,
                limit: pageSize,
                search: keyword.trim() || undefined,
                placedFrom: placedFrom || undefined,
                placedTo: placedTo || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
                channelType: activeChannelType,
            };

            const response = await getSellerOrders(filters);
            setOrders(response.data);
            setTotalItems(response.meta.totalItems);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeChannelType, currentPage, keyword, pageSize, placedFrom, placedTo, statusFilter]);

    const fetchChannels = useCallback(async () => {
        try {
            const loadedConnections = await getSellerChannels();
            setChannelConnections(loadedConnections);
        } catch {
            setChannelConnections([]);
        }
    }, []);

    useEffect(() => {
        void fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        void fetchChannels();
    }, [fetchChannels]);

    useEffect(() => {
        if (activeChannelType === "WEB") {
            return;
        }

        const activeConnection = channelConnections.find(
            (connection) => connection.channelType === activeChannelType,
        );

        if (!activeConnection || activeConnection.status !== "CONNECTED") {
            setActiveChannelType("WEB");
            setCurrentPage(1);
        }
    }, [activeChannelType, channelConnections]);

    useEffect(() => {
        setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
    }, [totalPages]);

    const pendingSettlementCount = useMemo(
        () => orders.filter((order) => order.settlementStatus === "PENDING").length,
        [orders],
    );

    const currentPageTotalAmount = useMemo(
        () => orders.reduce((sum, order) => sum + parseMoney(order.totalAmount), 0),
        [orders],
    );

    const openDetailPage = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    const getChannelConnection = (channelType: SalesChannelType) => {
        return (
            channelConnections.find((connection) => connection.channelType === channelType) ?? null
        );
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <section className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tổng đơn hàng
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalItems}</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tổng tiền trang hiện tại
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {currentPageTotalAmount.toLocaleString("vi-VN")}đ
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Chờ đối soát trang hiện tại
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {pendingSettlementCount}
                    </p>
                </div>
            </section>

            <section className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-3">
                {CHANNEL_ORDER.map((channelType) => {
                    const isWeb = channelType === "WEB";
                    const connection = getChannelConnection(channelType);
                    const isDisabled = !isWeb && connection?.status !== "CONNECTED";
                    const isActive = activeChannelType === channelType;

                    return (
                        <button
                            key={channelType}
                            type="button"
                            disabled={isDisabled || isLoading}
                            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                                isActive
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : isDisabled
                                      ? "border-slate-200 bg-slate-100 text-slate-400"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                            onClick={() => {
                                setActiveChannelType(channelType);
                                setCurrentPage(1);
                            }}
                        >
                            <span className="block font-semibold">
                                {CHANNEL_LABELS[channelType]}
                            </span>
                            {!isWeb ? (
                                <span className="text-xs opacity-80">
                                    {connection?.status === "CONNECTED"
                                        ? "Đã kết nối"
                                        : "Chưa kết nối"}
                                </span>
                            ) : (
                                <span className="text-xs opacity-80">Nguồn nội bộ</span>
                            )}
                        </button>
                    );
                })}
            </section>

            <OrdersFilters
                keyword={keyword}
                placedFrom={placedFrom}
                placedTo={placedTo}
                status={statusFilter}
                isDisabled={isLoading}
                onKeywordChange={(value) => {
                    setKeyword(value);
                    setCurrentPage(1);
                }}
                onPlacedFromChange={(value) => {
                    setPlacedFrom(value);
                    setCurrentPage(1);
                }}
                onPlacedToChange={(value) => {
                    setPlacedTo(value);
                    setCurrentPage(1);
                }}
                onStatusChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}
            />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <OrdersTable rows={orders} isLoading={isLoading} onRowClick={openDetailPage} />

            <section className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                >
                    Trước
                </Button>
                <span className="text-sm text-slate-600">
                    Trang {currentPage}/{totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage >= totalPages || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                >
                    Sau
                </Button>
            </section>
        </section>
    );
}
