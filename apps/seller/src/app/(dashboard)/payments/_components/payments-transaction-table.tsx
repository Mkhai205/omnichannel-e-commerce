"use client";

import { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Filter } from "lucide-react";
import { cn } from "@repo/ui";
import type {
    PaymentStatusFilterOption,
    PaymentStatusFilterValue,
    PaymentTransactionRow,
} from "../types";

type PaginationItem = number | "ellipsis";

type PaymentsTransactionTableProps = {
    rows: PaymentTransactionRow[];
    statusOptions: PaymentStatusFilterOption[];
    selectedStatus: PaymentStatusFilterValue;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
    filteredRecords: number;
    isLoading?: boolean;
    onStatusChange: (value: PaymentStatusFilterValue) => void;
    onFilterClick: () => void;
    onPageChange: (page: number) => void;
};

function formatCurrency(value: number) {
    const amount = Math.abs(value).toLocaleString("vi-VN");
    return `${value < 0 ? "- " : ""}${amount} đ`;
}

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
    if (totalPages <= 5) {
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

function getStatusClassName(status: PaymentTransactionRow["status"]) {
    if (status === "Đã về ví") {
        return "bg-blue-100 text-blue-600";
    }

    return "bg-amber-100 text-amber-600";
}

function getActionButtonClassName(tone: PaymentTransactionRow["actionTone"]) {
    if (tone === "primary") {
        return "border-blue-500 bg-blue-500 text-white hover:bg-blue-500/90";
    }

    return "border-transparent bg-transparent text-blue-500 hover:bg-blue-50";
}

function getWarningClassName(warningLabel: string) {
    if (warningLabel === "—") {
        return "text-slate-400";
    }

    return "text-red-500";
}

export function PaymentsTransactionTable({
    rows,
    statusOptions,
    selectedStatus,
    currentPage,
    totalPages,
    pageSize,
    totalRecords,
    filteredRecords,
    isLoading = false,
    onStatusChange,
    onFilterClick,
    onPageChange,
}: PaymentsTransactionTableProps) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const paginationItems = buildPaginationItems(currentPage, totalPages);
    const start = filteredRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = filteredRecords === 0 ? 0 : start + rows.length - 1;
    const selectedStatusLabel =
        statusOptions.find((option) => option.value === selectedStatus)?.label ?? "Tất cả";

    return (
        <section className="relative rounded-2xl border border-slate-200 bg-white shadow-none">
            {isStatusOpen ? (
                <button
                    type="button"
                    aria-label="Đóng danh sách trạng thái"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsStatusOpen(false)}
                />
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 lg:px-6 lg:py-5">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                        Lịch sử giao dịch &amp; Đối soát
                    </h2>
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-500">
                        <span className="size-2 rounded-full bg-blue-500" /> LIVE
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Trạng thái:
                    </p>

                    <div className="relative z-50 w-44">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex h-9 w-full items-center justify-between rounded-lg border-slate-200 bg-white px-3 text-left text-xs font-semibold text-slate-700"
                            aria-haspopup="listbox"
                            aria-expanded={isStatusOpen}
                            onClick={() => setIsStatusOpen((prev) => !prev)}
                        >
                            <span className="truncate">{selectedStatusLabel}</span>
                            <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                    "size-4 text-slate-500 transition-transform",
                                    isStatusOpen && "rotate-180",
                                )}
                            />
                        </Button>

                        {isStatusOpen ? (
                            <div className="absolute left-0 top-[calc(100%+0.4rem)] z-50 w-full rounded-lg border border-slate-200 bg-white shadow-sm">
                                <ul role="listbox" className="py-1">
                                    {statusOptions.map((option) => {
                                        const isSelected = option.value === selectedStatus;

                                        return (
                                            <li key={option.value}>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className={cn(
                                                        "flex h-auto w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50",
                                                        isSelected && "text-slate-900",
                                                    )}
                                                    onClick={() => {
                                                        onStatusChange(option.value);
                                                        setIsStatusOpen(false);
                                                    }}
                                                >
                                                    <span className="truncate">{option.label}</span>
                                                    {isSelected ? (
                                                        <Check
                                                            aria-hidden="true"
                                                            className="size-4 text-blue-600"
                                                        />
                                                    ) : null}
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : null}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-500"
                        onClick={() => {
                            setIsStatusOpen(false);
                            onFilterClick();
                        }}
                    >
                        <Filter aria-hidden="true" data-icon="inline-start" />
                        LỌC
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/70">
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            NGÀY/GIỜ
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            KÊNH &amp; MÃ ĐƠN
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            LOẠI GIAO DỊCH
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            SỐ TIỀN
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            TRẠNG THÁI
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            CẢNH BÁO
                        </TableHead>
                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                            THAO TÁC
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={7}
                                className="px-4 py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải giao dịch...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && rows.length === 0 ? (
                        <TableRow className="border-slate-200">
                            <TableCell
                                colSpan={7}
                                className="px-4 py-10 text-center text-sm text-slate-500"
                            >
                                Không có giao dịch phù hợp.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? rows.map((row) => (
                              <TableRow key={row.id} className="border-slate-200">
                                  <TableCell className="px-4 py-4 align-top">
                                      <p className="text-base font-semibold leading-tight text-slate-700">
                                          {row.dateLabel}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-400">{row.timeLabel}</p>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <div className="flex items-start gap-2.5">
                                          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                                              {row.channelCode}
                                          </span>
                                          <div>
                                              <p className="text-base font-semibold leading-tight text-slate-700">
                                                  {row.orderCode}
                                              </p>
                                              <p className="mt-1.5 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                  {row.channelTag}
                                              </p>
                                          </div>
                                      </div>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top text-sm font-semibold leading-snug text-slate-700">
                                      {row.transactionType}
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <p
                                          className={cn(
                                              "text-lg font-semibold leading-tight",
                                              row.amountVnd < 0 ? "text-red-500" : "text-slate-800",
                                          )}
                                      >
                                          {formatCurrency(row.amountVnd)}
                                      </p>
                                      {typeof row.platformFeeVnd === "number" ? (
                                          <p className="mt-1.5 text-xs font-semibold text-slate-400">
                                              {formatCurrency(row.platformFeeVnd)} phí sàn
                                          </p>
                                      ) : null}
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <span
                                          className={cn(
                                              "inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-semibold",
                                              getStatusClassName(row.status),
                                          )}
                                      >
                                          <span className="size-2 rounded-full bg-current" />
                                          {row.status}
                                      </span>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <p
                                          className={cn(
                                              "inline-flex items-center gap-2 text-sm font-semibold leading-tight",
                                              getWarningClassName(row.warningLabel),
                                          )}
                                      >
                                          {row.warningLabel === "—" ? null : (
                                              <CircleAlert aria-hidden="true" className="size-4" />
                                          )}
                                          {row.warningLabel}
                                      </p>
                                  </TableCell>

                                  <TableCell className="px-4 py-4 align-top">
                                      <Button
                                          type="button"
                                          variant="outline"
                                          className={cn(
                                              "h-9 rounded-xl border px-3 text-xs font-semibold tracking-widest",
                                              getActionButtonClassName(row.actionTone),
                                          )}
                                      >
                                          {row.actionLabel}
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4 lg:px-6 lg:py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">
                    HIỂN THỊ {start}-{end} TRONG {totalRecords.toLocaleString("en-US")} GIAO DỊCH
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Trang trước"
                        disabled={currentPage === 1 || isLoading}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <ChevronLeft aria-hidden="true" className="size-4" />
                    </Button>

                    {paginationItems.map((item, index) => {
                        if (item === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-1 text-sm font-semibold text-slate-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === currentPage;

                        return (
                            <Button
                                key={item}
                                type="button"
                                variant="ghost"
                                className={cn(
                                    "h-9 min-w-9 rounded-lg px-2 text-sm font-semibold",
                                    isActive
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-100",
                                )}
                                onClick={() => onPageChange(item)}
                                disabled={isLoading}
                            >
                                {item}
                            </Button>
                        );
                    })}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Trang sau"
                        disabled={currentPage === totalPages || isLoading}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <ChevronRight aria-hidden="true" className="size-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
