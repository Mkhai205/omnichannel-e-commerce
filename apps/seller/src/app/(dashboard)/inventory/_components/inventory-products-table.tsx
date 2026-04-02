import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { ChevronLeft, ChevronRight, Filter, MoreVertical } from "lucide-react";
import { cn } from "@repo/ui";
import type { InventoryProductRow, InventoryStatus, WarehouseFilter, WarehouseFilterOption } from "../types";

type InventoryProductsTableProps = {
  rows: InventoryProductRow[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalProducts: number;
  filteredRowCount: number;
  activeWarehouse: WarehouseFilter;
  warehouseOptions: WarehouseFilterOption[];
  onWarehouseChange: (value: WarehouseFilter) => void;
  onPageChange: (value: number) => void;
};

type PaginationItem = number | "ellipsis";

function getStatusClassName(status: InventoryStatus) {
  if (status === "CÒN HÀNG") {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }

  if (status === "SẮP HẾT") {
    return "border-amber-200 bg-amber-100 text-amber-700";
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

function getInitials(name: string) {
  const words = name.split(" ");
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? "";

  return `${first}${second}`.toUpperCase();
}

export function InventoryProductsTable({
  rows,
  currentPage,
  totalPages,
  pageSize,
  totalProducts,
  filteredRowCount,
  activeWarehouse,
  warehouseOptions,
  onWarehouseChange,
  onPageChange,
}: InventoryProductsTableProps) {
  const start = filteredRowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = filteredRowCount === 0 ? 0 : Math.min(currentPage * pageSize, filteredRowCount);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">Danh sách hàng hóa trong kho</h2>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {warehouseOptions.map((option) => {
              const isActive = option.value === activeWarehouse;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onWarehouseChange(option.value)}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-semibold text-slate-500",
                    isActive && "bg-white text-blue-500 shadow-sm",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <Button type="button" variant="outline" className="h-10 rounded-lg border-slate-300 px-4 text-sm font-semibold text-slate-600">
            <Filter aria-hidden="true" data-icon="inline-start" />
            Bộ lọc
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50/80">
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Mã SKU</TableHead>
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Sản phẩm</TableHead>
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Kho</TableHead>
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Tồn hiện tại</TableHead>
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Trạng thái</TableHead>
            <TableHead className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.sku} className="border-slate-200">
              <TableCell className="px-5 py-4 align-middle text-sm font-semibold text-blue-500">{row.sku}</TableCell>

              <TableCell className="px-5 py-4 align-middle">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-md bg-slate-900 text-[10px] font-semibold text-white">
                    {getInitials(row.productName)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{row.productName}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {row.categoryLabel} • {row.brandLabel}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-5 py-4 align-middle">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {row.warehouseName}
                </span>
              </TableCell>

              <TableCell className="px-5 py-4 align-middle text-xl font-semibold text-slate-800">{row.currentStock}</TableCell>

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
                <button type="button" className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                  <MoreVertical aria-hidden="true" className="size-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-400">
        <p className="font-semibold uppercase tracking-wide">
          Hiển thị {start}-{end} trên {totalProducts.toLocaleString("en-US")} mặt hàng
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
