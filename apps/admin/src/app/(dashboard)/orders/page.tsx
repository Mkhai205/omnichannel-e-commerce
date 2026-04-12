"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
    AdminOrderListItem,
    AdminOrdersFilterRequest,
    OrderStatus,
    SettlementStatus,
} from "@repo/shared-types";
import { Button } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getAdminOrders } from "@/services/orders-service";
import { OrdersErrorCard } from "./_components/orders-error-card";
import { OrdersFilters } from "./_components/orders-filters";
import { OrdersSummary } from "./_components/orders-summary";
import { OrdersTable } from "./_components/orders-table";
import type { OrderStatusFilterValue, SettlementStatusFilterValue } from "./types";

const DEFAULT_PAGE_SIZE = 20;

function parseMoney(value: string): number {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return 0;
    }

    return amount;
}

export default function OrdersPage() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [placedFrom, setPlacedFrom] = useState("");
    const [placedTo, setPlacedTo] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatusFilterValue>("ALL");
    const [settlementStatusFilter, setSettlementStatusFilter] =
        useState<SettlementStatusFilterValue>("ALL");
    const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);

        try {
            const filters: AdminOrdersFilterRequest = {
                page: currentPage,
                limit: DEFAULT_PAGE_SIZE,
                search: keyword.trim() || undefined,
                placedFrom: placedFrom || undefined,
                placedTo: placedTo || undefined,
                status: statusFilter === "ALL" ? undefined : (statusFilter as OrderStatus),
                settlementStatus:
                    settlementStatusFilter === "ALL"
                        ? undefined
                        : (settlementStatusFilter as SettlementStatus),
            };

            const response = await getAdminOrders(filters);

            setOrders(response.data);
            setTotalItems(response.meta.totalItems);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to load orders. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, keyword, placedFrom, placedTo, settlementStatusFilter, statusFilter]);

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
            <OrdersSummary
                totalItems={totalItems}
                currentPageTotalAmount={currentPageTotalAmount}
                pendingSettlementCount={pendingSettlementCount}
            />

            <OrdersFilters
                keyword={keyword}
                placedFrom={placedFrom}
                placedTo={placedTo}
                status={statusFilter}
                settlementStatus={settlementStatusFilter}
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
                onSettlementStatusChange={(value) => {
                    setSettlementStatusFilter(value);
                    setCurrentPage(1);
                }}
            />

            {errorMessage ? (
                <OrdersErrorCard
                    message={errorMessage}
                    onRetry={() => {
                        void fetchOrders();
                    }}
                />
            ) : null}

            <OrdersTable rows={orders} isLoading={isLoading} onRowClick={openDetailPage} />

            <section className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                >
                    Previous
                </Button>
                <span className="text-sm text-slate-600">
                    Page {currentPage}/{totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage >= totalPages || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                >
                    Next
                </Button>
            </section>
        </section>
    );
}
