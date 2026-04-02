"use client";

import { useEffect, useMemo, useState } from "react";
import { OrdersFilters } from "./_components/orders-filters";
import { OrdersTable } from "./_components/orders-table";
import type {
    OrderStatus,
    SellerOrdersFilterRequest,
    SellerOrdersListResponse,
} from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import { getSellerOrders } from "@/services/orders-service";
import type { OrdersFilterValues, OrdersStatusOption } from "./types";

const statusOptions: OrdersStatusOption[] = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Hoàn tất" },
    { value: "CANCELLED", label: "Đã hủy" },
];

const initialFilterValues: OrdersFilterValues = {
    status: "all",
};

export default function OrdersPage() {
    const [filterValues, setFilterValues] = useState<OrdersFilterValues>(initialFilterValues);
    const [appliedFilterValues, setAppliedFilterValues] =
        useState<OrdersFilterValues>(initialFilterValues);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [ordersResponse, setOrdersResponse] = useState<SellerOrdersListResponse | null>(null);
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

            setPageSize(10);
        };

        updatePageSize();
        window.addEventListener("resize", updatePageSize);

        return () => {
            window.removeEventListener("resize", updatePageSize);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchOrders = async () => {
            setIsLoading(true);

            try {
                const filters: SellerOrdersFilterRequest = {
                    page: currentPage,
                    limit: pageSize,
                };

                if (appliedFilterValues.status !== "all") {
                    filters.status = appliedFilterValues.status;
                }

                const response = await getSellerOrders(filters);

                if (!isMounted) {
                    return;
                }

                setOrdersResponse(response);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchOrders();

        return () => {
            isMounted = false;
        };
    }, [appliedFilterValues.status, currentPage, pageSize]);

    const totalPages = useMemo(() => {
        return Math.max(1, ordersResponse?.meta.totalPages ?? 1);
    }, [ordersResponse?.meta.totalPages]);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    const handleApplyFilters = () => {
        setAppliedFilterValues(filterValues);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilterValues(initialFilterValues);
        setAppliedFilterValues(initialFilterValues);
        setCurrentPage(1);
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <header>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                    Quản lý Đơn hàng
                </h1>
                <p className="mt-2 max-w-md text-lg text-slate-600">
                    Theo dõi và xử lý đơn hàng từ cửa hàng của bạn theo thời gian thực.
                </p>
            </header>

            <OrdersFilters
                values={filterValues}
                statusOptions={statusOptions}
                isDisabled={isLoading}
                onStatusChange={(value) =>
                    setFilterValues((prev) => ({ ...prev, status: value as OrderStatus | "all" }))
                }
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
            />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <OrdersTable
                rows={ordersResponse?.data ?? []}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalOrdersCount={ordersResponse?.meta.totalItems ?? 0}
                isLoading={isLoading}
                onPageChange={setCurrentPage}
            />
        </section>
    );
}
