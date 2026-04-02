import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OrderRow, OrderStatus } from "../types";

type OrdersTableProps = {
  rows: OrderRow[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalOrdersCount: number;
  filteredRowCount: number;
  onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

function getStatusClassName(status: OrderStatus) {
  if (status === "CHỜ XÁC NHẬN") {
    return "bg-blue-100 text-blue-600";
  }

  if (status === "ĐANG GIAO") {
    return "bg-slate-200 text-slate-600";
  }

  return "bg-emerald-100 text-emerald-600";
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function getChannelDot(channel: string) {
  if (channel === "Shopee") {
    return "bg-orange-400";
  }

  if (channel === "TikTok") {
    return "bg-slate-900";
  }

  return "bg-blue-500";
}

function getInitials(name: string) {
  const parts = name.split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
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
  filteredRowCount,
  onPageChange,
}: OrdersTableProps) {
  const start = filteredRowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = filteredRowCount === 0 ? 0 : start + rows.length - 1;
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <section className="relative rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50/70">
            <TableHead className="w-44 px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">ID Đơn hàng</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Kênh</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Khách hàng</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Sản phẩm</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Tổng tiền</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Trạng thái</TableHead>
            <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-slate-200">
              <TableCell className="px-4 py-4 align-top">
                <p className="text-sm font-semibold text-blue-500">{row.id}</p>
                <p className="mt-1 text-xs text-slate-400">{row.orderedAt}</p>
              </TableCell>

              <TableCell className="px-4 py-4 align-top">
                <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className={`size-1.5 rounded-full ${getChannelDot(row.channel)}`} />
                  {row.channel}
                </span>
              </TableCell>

              <TableCell className="px-4 py-4 align-top">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    {getInitials(row.customerName)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{row.customerName}</p>
                    <p className="text-xs text-slate-400">{row.customerLocation}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-4 py-4 align-top">
                <div className="flex items-center gap-1">
                  <span className="inline-flex h-8 w-10 items-center justify-center rounded bg-slate-900 text-[10px] text-white">
                    SP
                  </span>
                  {row.productPreviewLabels[1] ? (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                      {row.productPreviewLabels[1]}
                    </span>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="px-4 py-4 align-top text-xl font-semibold text-slate-700">
                {formatCurrency(row.totalAmount)}
              </TableCell>

              <TableCell className="px-4 py-4 align-top">
                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClassName(row.status)}`}>
                  {row.status}
                </span>
              </TableCell>

              <TableCell className="px-4 py-4 align-top">
                <Button variant="outline" size="sm" className="border-slate-300 text-xs font-semibold text-slate-600">
                  {row.actionLabel}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 text-xs text-slate-400">
        <p className="font-semibold uppercase tracking-wide">
          Hiển thị {start}-{end} trên tổng số {totalOrdersCount.toLocaleString("en-US")} đơn hàng
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          {paginationItems.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-1 text-xs font-semibold text-slate-500">
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
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
