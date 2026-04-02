import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    cn,
} from "@repo/ui";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import type { ProductRow, ProductStatus } from "../types";

type ProductsTableProps = {
    rows: ProductRow[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalProductsCount: number;
    filteredRowCount: number;
    isLoading: boolean;
    isMutating: boolean;
    onPageChange: (value: number) => void;
    onHideProduct: (productId: string) => void;
};

type PaginationItem = number | "ellipsis";

function getStatusClassName(status: ProductStatus) {
    if (status === "ĐANG BÁN") {
        return "border-emerald-200 bg-emerald-100 text-emerald-700";
    }

    if (status === "BẢN NHÁP") {
        return "border-amber-200 bg-amber-100 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
}

function getSyncStatusClassName(syncStatus: ProductRow["syncStatus"]) {
    if (syncStatus === "ĐÃ ĐỒNG BỘ") {
        return "border-blue-200 bg-blue-100 text-blue-700";
    }

    return "border-red-200 bg-red-100 text-red-700";
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

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")}đ`;
}

function getInitials(name: string) {
    const words = name.split(" ");
    const first = words[0]?.[0] ?? "";
    const second = words[1]?.[0] ?? "";
    return `${first}${second}`.toUpperCase();
}

export function ProductsTable({
    rows,
    currentPage,
    totalPages,
    pageSize,
    totalProductsCount,
    filteredRowCount,
    isLoading,
    isMutating,
    onPageChange,
    onHideProduct,
}: ProductsTableProps) {
    const start = filteredRowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = filteredRowCount === 0 ? 0 : Math.min(currentPage * pageSize, filteredRowCount);
    const paginationItems = buildPaginationItems(currentPage, totalPages);

    return (
        <section className="rounded-b-lg border-x border-b border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/80">
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Chi tiết sản phẩm
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Giá niêm yết
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Giá khuyến mãi
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Trạng thái
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Trạng thái đồng bộ
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Thao tác
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={6}
                                className="px-5 py-10 text-center text-sm font-medium text-slate-500"
                            >
                                Đang tải danh sách sản phẩm...
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={6}
                                className="px-5 py-10 text-center text-sm font-medium text-slate-500"
                            >
                                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => (
                            <TableRow key={row.id} className="border-slate-200">
                                <TableCell className="px-5 py-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex size-10 items-center justify-center rounded-md bg-slate-900 text-[10px] font-semibold text-white">
                                            {getInitials(row.productName)}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {row.productName}
                                            </p>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                {row.id} • {row.sku} • {row.categoryLabel}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-4 align-middle text-sm font-semibold text-slate-700">
                                    {formatCurrency(row.listedPrice)}
                                </TableCell>

                                <TableCell className="px-5 py-4 align-middle text-sm font-semibold text-red-600">
                                    {formatCurrency(row.promotionalPrice)}
                                </TableCell>

                                <TableCell className="px-5 py-4 align-middle">
                                    <span
                                        className={cn(
                                            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                                            getStatusClassName(row.status),
                                        )}
                                    >
                                        {row.status}
                                    </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 align-middle">
                                    <span
                                        className={cn(
                                            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                                            getSyncStatusClassName(row.syncStatus),
                                        )}
                                    >
                                        {row.syncStatus}
                                    </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 align-middle">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                                aria-label="Tác vụ sản phẩm"
                                            >
                                                <MoreVertical
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="min-w-44">
                                            <DropdownMenuItem
                                                className="cursor-pointer text-rose-600 focus:text-rose-600"
                                                disabled={isMutating}
                                                onClick={() => onHideProduct(row.productId)}
                                            >
                                                Ẩn sản phẩm
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-400">
                <p className="font-semibold uppercase tracking-wide">
                    Hiển thị {start}-{end} trên tổng số {totalProductsCount.toLocaleString("en-US")}{" "}
                    sản phẩm
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        aria-label="Trang trước"
                    >
                        <ChevronLeft aria-hidden="true" className="size-4" />
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
                                onClick={() => onPageChange(item)}
                                className={
                                    isActive
                                        ? "inline-flex h-8 min-w-8 items-center justify-center rounded bg-blue-500 px-2 text-sm font-semibold text-white"
                                        : "px-1 text-sm font-semibold text-slate-500"
                                }
                            >
                                {item}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        aria-label="Trang sau"
                    >
                        <ChevronRight aria-hidden="true" className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
