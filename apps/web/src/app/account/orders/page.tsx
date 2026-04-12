"use client";

import type { CustomerOrderListResponse, OrderStatus } from "@repo/shared-types";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2Icon, PackageSearchIcon } from "lucide-react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getCustomerOrders } from "@/services/order-service";
import { AccountPageHeader } from "../_components/account-page-header";
import { OrderCard } from "./_components/order-card";
import { OrderHistoryFilter } from "./_components/order-history-filter";
import {
    formatOrderDate,
    getOrderStatusBadgeClass,
    getOrderStatusLabel,
} from "./_lib/order-presentation";
import { formatVnd } from "@/lib/currency";

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

export default function CustomerOrdersPage() {
    const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<CustomerOrderListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const data = await getCustomerOrders({
                page,
                limit: 10,
                status: status === "ALL" ? undefined : status,
                search: appliedSearch || undefined,
            });

            setResponse(data);
        } catch (error) {
            setErrorMessage(resolveApiErrorMessage(error, "Không thể tải lịch sử đơn hàng."));
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }, [appliedSearch, page, status]);

    useEffect(() => {
        void fetchOrders();
    }, [fetchOrders]);

    const orders = response?.data ?? [];
    const meta = response?.meta;

    const startItem = useMemo(() => {
        if (!meta || meta.totalItems === 0) {
            return 0;
        }

        return (meta.page - 1) * meta.limit + 1;
    }, [meta]);

    const endItem = useMemo(() => {
        if (!meta || meta.totalItems === 0) {
            return 0;
        }

        return Math.min(meta.page * meta.limit, meta.totalItems);
    }, [meta]);

    return (
        <>
            <AccountPageHeader
                title="Order History"
                description="Theo dõi trạng thái đơn hàng và truy cập chi tiết giao hàng của bạn."
            />

            <OrderHistoryFilter
                status={status}
                search={searchInput}
                isLoading={isLoading}
                onStatusChange={(nextStatus) => {
                    setStatus(nextStatus);
                    setPage(1);
                }}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => {
                    setAppliedSearch(searchInput.trim());
                    setPage(1);
                }}
            />

            {isLoading ? (
                <section className="grid gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-white"
                        />
                    ))}
                </section>
            ) : null}

            {!isLoading && errorMessage ? (
                <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
                    <p>{errorMessage}</p>
                    <Button onClick={() => void fetchOrders()} className="mt-3">
                        Tải lại
                    </Button>
                </section>
            ) : null}

            {!isLoading && !errorMessage && orders.length === 0 ? (
                <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        <PackageSearchIcon className="size-6" />
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-gray-900">
                        Chưa có đơn hàng phù hợp
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Thử thay đổi bộ lọc hoặc tìm kiếm bằng mã đơn khác.
                    </p>
                </section>
            ) : null}

            {!isLoading && !errorMessage && orders.length > 0 ? (
                <>
                    <section className="hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium text-gray-900">
                                            {order.orderNumber}
                                        </TableCell>
                                        <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
                                        <TableCell>{formatVnd(order.totalAmount)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}
                                            >
                                                {getOrderStatusLabel(order.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="text-sm font-medium text-success-dark hover:text-success"
                                            >
                                                View Details
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>

                    <section className="space-y-3 md:hidden">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </section>
                </>
            ) : null}

            {!isLoading && !errorMessage && meta && meta.totalPages > 1 ? (
                <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
                    <p className="text-gray-600">
                        Hiển thị <span className="font-semibold text-gray-900">{startItem}</span> -{" "}
                        <span className="font-semibold text-gray-900">{endItem}</span> /{" "}
                        <span className="font-semibold text-gray-900">{meta.totalItems}</span> đơn
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={page <= 1 || isLoading}
                            onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                        >
                            Trước
                        </Button>
                        <span className="min-w-20 text-center text-gray-700">
                            Trang {meta.page}/{meta.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={page >= meta.totalPages || isLoading}
                            onClick={() =>
                                setPage((previous) => Math.min(previous + 1, meta.totalPages))
                            }
                        >
                            Sau
                        </Button>
                    </div>
                </footer>
            ) : null}

            {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2Icon className="size-4 animate-spin" />
                    Đang tải đơn hàng...
                </div>
            ) : null}
        </>
    );
}
