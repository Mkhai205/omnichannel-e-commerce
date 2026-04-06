import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    cn,
} from "@/components/ui";
import { ChevronLeft, ChevronRight, Filter, ListFilter, MoreHorizontal, Truck } from "lucide-react";
import type { ShippingRow, ShippingStatusTab, ShippingTabFilter } from "../types";

type ShippingOrdersTableProps = {
    rows: ShippingRow[];
    tabs: ShippingStatusTab[];
    activeTab: ShippingTabFilter;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    filteredRowCount: number;
    totalShippingOrders: number;
    isLoading?: boolean;
    onTabChange: (value: ShippingTabFilter) => void;
    onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

function getStatusClassName(status: ShippingRow["status"]) {
    if (status === "ĐANG VẬN CHUYỂN") {
        return "bg-blue-100 text-blue-600";
    }

    if (status === "CHỜ XỬ LÝ HOÀN") {
        return "bg-red-100 text-red-600";
    }

    return "bg-emerald-100 text-emerald-600";
}

function getProviderInitials(name: string) {
    const words = name.split(" ");
    const first = words[0]?.[0] ?? "";
    const second = words[1]?.[0] ?? "";
    return `${first}${second}`.toUpperCase();
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

export function ShippingOrdersTable({
    rows,
    tabs,
    activeTab,
    currentPage,
    totalPages,
    pageSize,
    filteredRowCount,
    totalShippingOrders,
    isLoading = false,
    onTabChange,
    onPageChange,
}: ShippingOrdersTableProps) {
    const start = filteredRowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = filteredRowCount === 0 ? 0 : Math.min(currentPage * pageSize, filteredRowCount);
    const paginationItems = buildPaginationItems(currentPage, totalPages);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
                <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Danh sách vận đơn
                    </h2>
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                        {tabs.map((tab) => {
                            const isActive = tab.value === activeTab;

                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => onTabChange(tab.value)}
                                    className={cn(
                                        "rounded-md px-4 py-2 text-xs font-semibold text-slate-500",
                                        isActive && "bg-white text-blue-500 shadow-sm",
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-10 rounded-lg border-slate-200 bg-white text-slate-500"
                        onClick={() => {}}
                    >
                        <Filter aria-hidden="true" className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-10 rounded-lg border-slate-200 bg-white text-slate-500"
                        onClick={() => {}}
                    >
                        <ListFilter aria-hidden="true" className="size-4" />
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/80">
                        <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Mã vận đơn
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Đơn vị vận chuyển
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Trạng thái
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Cập nhật cuối
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            Thao tác
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={5}
                                className="px-6 py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải vận đơn...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && rows.length === 0 ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={5}
                                className="px-6 py-10 text-center text-sm text-slate-500"
                            >
                                Không có vận đơn phù hợp.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? rows.map((row) => (
                              <TableRow key={row.id} className="border-slate-200">
                                  <TableCell className="px-6 py-4 align-top">
                                      <p className="text-sm font-semibold text-blue-500">
                                          {row.id}
                                      </p>
                                      <p className="text-xs text-slate-500">{row.customerName}</p>
                                  </TableCell>

                                  <TableCell className="px-6 py-4 align-top">
                                      <div className="flex items-start gap-3">
                                          <span className="inline-flex size-9 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                                              {getProviderInitials(row.providerName)}
                                          </span>
                                          <div>
                                              <p className="text-sm font-semibold leading-tight text-slate-700">
                                                  {row.providerName}
                                              </p>
                                              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                                  <Truck aria-hidden="true" className="size-3.5" />
                                                  Đang xử lý tuyến giao
                                              </p>
                                          </div>
                                      </div>
                                  </TableCell>

                                  <TableCell className="px-6 py-4 align-top">
                                      <span
                                          className={cn(
                                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                                              getStatusClassName(row.status),
                                          )}
                                      >
                                          {row.status}
                                      </span>
                                  </TableCell>

                                  <TableCell className="px-6 py-4 align-top">
                                      <p className="text-sm font-semibold leading-tight text-slate-700">
                                          {row.updatedAt}
                                      </p>
                                      <p
                                          className={cn(
                                              "text-xs",
                                              row.status === "CHỜ XỬ LÝ HOÀN"
                                                  ? "text-red-500"
                                                  : "text-slate-400",
                                          )}
                                      >
                                          {row.locationNote}
                                      </p>
                                  </TableCell>

                                  <TableCell className="px-6 py-4 align-top">
                                      <div className="flex items-center gap-4">
                                          <button
                                              type="button"
                                              className={cn(
                                                  "text-xs font-semibold",
                                                  row.status === "CHỜ XỬ LÝ HOÀN"
                                                      ? "text-red-600"
                                                      : "text-blue-500",
                                              )}
                                          >
                                              {row.primaryActionLabel}
                                          </button>
                                          <button
                                              type="button"
                                              className={cn(
                                                  "text-xs font-semibold",
                                                  row.status === "CHỜ XỬ LÝ HOÀN"
                                                      ? "text-red-600"
                                                      : "text-slate-400",
                                              )}
                                          >
                                              {row.secondaryActionLabel}
                                          </button>
                                          <button
                                              type="button"
                                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                          >
                                              <MoreHorizontal
                                                  aria-hidden="true"
                                                  className="size-4"
                                              />
                                          </button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-xs text-slate-400">
                <p className="font-semibold uppercase tracking-[0.13em]">
                    Hiển thị {start}-{end} trong {totalShippingOrders.toLocaleString("en-US")}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded border border-slate-200 p-2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === 1 || isLoading}
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
                                disabled={isLoading}
                                className={
                                    isActive
                                        ? "inline-flex size-8 items-center justify-center rounded bg-blue-500 text-xs font-semibold text-white"
                                        : "inline-flex size-8 items-center justify-center rounded border border-slate-200 text-xs font-semibold text-slate-500"
                                }
                            >
                                {item}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="rounded border border-slate-200 p-2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === totalPages || isLoading}
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
