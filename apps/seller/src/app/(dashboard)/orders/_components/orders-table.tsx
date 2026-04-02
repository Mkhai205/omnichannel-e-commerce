import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OrderStatus, SellerOrderItem, SettlementStatus } from "@repo/shared-types";

type OrdersTableProps = {
    rows: SellerOrderItem[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalOrdersCount: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

function getStatusClassName(status: OrderStatus) {
    if (status === "PENDING_PAYMENT" || status === "PAID") {
        return "bg-blue-100 text-blue-600";
    }

    if (status === "PROCESSING" || status === "SHIPPED") {
        return "bg-amber-100 text-amber-700";
    }

    if (status === "DELIVERED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-rose-100 text-rose-700";
}

function getStatusLabel(status: OrderStatus) {
    if (status === "PENDING_PAYMENT") {
        return "Chờ thanh toán";
    }

    if (status === "PAID") {
        return "Đã thanh toán";
    }

    if (status === "PROCESSING") {
        return "Đang xử lý";
    }

    if (status === "SHIPPED") {
        return "Đang giao";
    }

    if (status === "DELIVERED") {
        return "Hoàn tất";
    }

    return "Đã hủy";
}

function getSettlementLabel(status: SettlementStatus) {
    if (status === "SETTLED") {
        return "Đã đối soát";
    }

    return "Chờ đối soát";
}

function getSettlementClassName(status: SettlementStatus) {
    if (status === "SETTLED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
}

function formatCurrency(value: string) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0đ";
    }

    return `${amount.toLocaleString("vi-VN")}đ`;
}

function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
    if (totalPages <= 6) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function OrdersTable({
    rows,
    currentPage,
    totalPages,
    pageSize,
    totalOrdersCount,
    isLoading = false,
    onPageChange,
}: OrdersTableProps) {
    const resolvedTotalPages = Math.max(1, totalPages);
    const start = totalOrdersCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = totalOrdersCount === 0 ? 0 : start + rows.length - 1;
    const paginationItems = buildPaginationItems(currentPage, resolvedTotalPages);

    return (
        <section className="relative rounded-lg border border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/70">
                        <TableHead className="w-64 px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Mã đơn hàng
                        </TableHead>
                        <TableHead className="w-56 px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Ngày đặt
                        </TableHead>
                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Tổng tiền
                        </TableHead>
                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Trạng thái
                        </TableHead>
                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Đối soát
                        </TableHead>
                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Thao tác
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={6}
                                className="px-4 py-12 text-center text-sm text-slate-500"
                            >
                                Đang tải đơn hàng...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && rows.length === 0 ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={6}
                                className="px-4 py-12 text-center text-sm text-slate-500"
                            >
                                Không tìm thấy đơn hàng phù hợp.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? rows.map((row) => (
                              <TableRow key={row.id} className="border-slate-200">
                                  <TableCell className="px-4 py-4 align-top">
                                      <p className="text-sm font-semibold text-blue-600">
                                          {row.orderNumber}
                                      </p>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top text-sm text-slate-700">
                                      {formatDateTime(row.createdAt)}
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top text-lg font-semibold text-slate-700">
                                      {formatCurrency(row.totalAmount)}
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <span
                                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClassName(row.status)}`}
                                      >
                                          {getStatusLabel(row.status)}
                                      </span>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <span
                                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getSettlementClassName(row.settlementStatus)}`}
                                      >
                                          {getSettlementLabel(row.settlementStatus)}
                                      </span>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <Button
                                          asChild
                                          variant="outline"
                                          size="sm"
                                          className="border-slate-300 text-xs font-semibold text-slate-600"
                                      >
                                          <Link href={`/orders/${row.id}`}>Chi tiết</Link>
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 text-xs text-slate-400">
                <p className="font-semibold uppercase tracking-wide">
                    Hiển thị {start}-{end} trên tổng số {totalOrdersCount.toLocaleString("en-US")}{" "}
                    đơn hàng
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Previous page"
                        disabled={currentPage === 1 || isLoading}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>

                    {paginationItems.map((item, index) => {
                        if (item === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-1 text-xs font-semibold text-slate-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === currentPage;
                        return (
                            <button
                                key={item}
                                type="button"
                                className={
                                    isActive
                                        ? "inline-flex h-7 min-w-7 items-center justify-center rounded bg-blue-500 px-2 text-xs font-semibold text-white"
                                        : "px-1 text-xs font-semibold text-slate-500"
                                }
                                onClick={() => onPageChange(item)}
                                disabled={isLoading}
                            >
                                {item}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Next page"
                        disabled={currentPage >= resolvedTotalPages || isLoading}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </section>
    );
}
