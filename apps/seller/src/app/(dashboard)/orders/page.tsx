"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, SellerOrderItem, SellerOrdersFilterRequest } from "@repo/shared-types";
import { Button } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getSellerOrders } from "@/services/orders-service";
import { OrdersFilters } from "./_components/orders-filters";
import { OrdersTable } from "./_components/orders-table";

const DEFAULT_PAGE_SIZE = 10;

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
    }, [currentPage, keyword, pageSize, placedFrom, placedTo, statusFilter]);

    useEffect(() => {
        void fetchOrders();
    }, [fetchOrders]);

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
