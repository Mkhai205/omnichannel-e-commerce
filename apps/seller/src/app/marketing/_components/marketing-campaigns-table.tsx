import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from "@repo/ui";
import { Ban, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import type {
  CampaignFilterOption,
  CampaignFilterValue,
  CampaignSortOption,
  CampaignSortValue,
  MarketingCampaignRow,
} from "../types";

type MarketingCampaignsTableProps = {
  rows: MarketingCampaignRow[];
  filterOptions: CampaignFilterOption[];
  sortOptions: CampaignSortOption[];
  selectedFilter: CampaignFilterValue;
  selectedSort: CampaignSortValue;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filteredRowCount: number;
  totalCampaignCount: number;
  onFilterChange: (value: CampaignFilterValue) => void;
  onSortChange: (value: CampaignSortValue) => void;
  onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

function formatMillionVnd(value: number) {
  return `₫${value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

function formatRoi(value: number) {
  return `${value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`;
}

function getTypeClassName(type: MarketingCampaignRow["type"]) {
  if (type === "VOUCHER") {
    return "border-blue-200 bg-blue-50 text-blue-600";
  }

  return "border-slate-300 bg-slate-100 text-slate-700";
}

function getStatusClassName(status: MarketingCampaignRow["status"]) {
  if (status === "HOẠT ĐỘNG") {
    return "bg-blue-50 text-blue-600";
  }

  return "bg-slate-100 text-slate-500";
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

export function MarketingCampaignsTable({
  rows,
  filterOptions,
  sortOptions,
  selectedFilter,
  selectedSort,
  currentPage,
  totalPages,
  pageSize,
  filteredRowCount,
  totalCampaignCount,
  onFilterChange,
  onSortChange,
  onPageChange,
}: MarketingCampaignsTableProps) {
  const start = filteredRowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = filteredRowCount === 0 ? 0 : Math.min(currentPage * pageSize, filteredRowCount);
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Danh sách chương trình đang chạy</h2>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {filterOptions.map((option) => {
              const isActive = option.value === selectedFilter;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterChange(option.value)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500",
                    isActive && "bg-white text-slate-700 shadow-sm",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {sortOptions.map((option) => {
              const isActive = option.value === selectedSort;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500",
                    isActive && "bg-white text-slate-700 shadow-sm",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50/80">
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Tên chiến dịch</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Loại</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Thời gian</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Ngân sách</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Doanh thu</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">ROI</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-slate-200">
              <TableCell className="px-6 py-4 align-top">
                <p className="text-sm font-semibold leading-tight text-slate-700">{row.campaignName}</p>
                <p className="mt-1 text-xs text-slate-400">{row.campaignCode}</p>
              </TableCell>

              <TableCell className="px-6 py-4 align-top">
                <span className={cn("inline-flex rounded border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", getTypeClassName(row.type))}>
                  {row.type === "FLASH_SALE" ? "FLASH SALE" : "VOUCHER"}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 align-top text-sm font-semibold text-slate-500">{row.dateRangeLabel}</TableCell>
              <TableCell className="px-6 py-4 align-top text-sm font-semibold text-slate-700">{formatMillionVnd(row.budgetMillions)}</TableCell>
              <TableCell className="px-6 py-4 align-top text-sm font-semibold text-slate-700">{formatMillionVnd(row.revenueMillions)}</TableCell>
              <TableCell className="px-6 py-4 align-top text-sm font-semibold text-blue-500">{formatRoi(row.roiMultiplier)}</TableCell>

              <TableCell className="px-6 py-4 align-top">
                <span className={cn("inline-flex rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide", getStatusClassName(row.status))}>
                  {row.status}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 align-top">
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Ban aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Pencil aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-xs text-slate-400">
        <p className="font-semibold">
          Hiển thị {start}-{end} trong số {totalCampaignCount.toLocaleString("en-US")} chiến dịch
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
                    ? "inline-flex h-7 min-w-7 items-center justify-center rounded bg-blue-500 px-2 text-xs font-semibold text-white"
                    : "px-1 text-xs font-semibold text-slate-500"
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
