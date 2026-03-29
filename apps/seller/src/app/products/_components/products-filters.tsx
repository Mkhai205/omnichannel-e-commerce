"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input, cn } from "@repo/ui";
import type { ProductChannelFilter, ProductFilterOption, ProductFilterValues, ProductSyncFilter } from "../types";

type ProductsFiltersProps = {
  values: ProductFilterValues;
  statusOptions: ProductFilterOption<ProductSyncFilter>[];
  channelOptions: ProductFilterOption<ProductChannelFilter>[];
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: ProductSyncFilter) => void;
  onChannelChange: (value: ProductChannelFilter) => void;
};

export function ProductsFilters({
  values,
  statusOptions,
  channelOptions,
  onKeywordChange,
  onStatusChange,
  onChannelChange,
}: ProductsFiltersProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const selectedStatusLabel = statusOptions.find((option) => option.value === values.syncStatus)?.label ?? "Tất cả trạng thái";
  const selectedChannelLabel = channelOptions.find((option) => option.value === values.channel)?.label ?? "Tất cả các kênh";

  return (
    <section className="relative rounded-t-lg border border-slate-200 bg-slate-50/60 px-5 py-4">
      {(isStatusOpen || isChannelOpen) && (
        <button
          type="button"
          aria-label="Đóng danh sách lọc"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => {
            setIsStatusOpen(false);
            setIsChannelOpen(false);
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[auto_auto_1fr] lg:items-center">
        <div className="relative z-50 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Status:</p>

          <button
            type="button"
            className="inline-flex h-10 min-w-44 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
            aria-haspopup="listbox"
            aria-expanded={isStatusOpen}
            onClick={() => {
              setIsChannelOpen(false);
              setIsStatusOpen((previous) => !previous);
            }}
          >
            <span>{selectedStatusLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-4 text-slate-500 transition-transform", isStatusOpen && "rotate-180")}
            />
          </button>

          {isStatusOpen && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-md border border-slate-200 bg-white shadow-sm">
              <ul role="listbox" className="py-1">
                {statusOptions.map((option) => {
                  const isSelected = option.value === values.syncStatus;

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50",
                          isSelected && "text-slate-900",
                        )}
                        onClick={() => {
                          onStatusChange(option.value);
                          setIsStatusOpen(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check aria-hidden="true" className="size-4 text-blue-600" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="relative z-50 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Channel:</p>

          <button
            type="button"
            className="inline-flex h-10 min-w-44 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
            aria-haspopup="listbox"
            aria-expanded={isChannelOpen}
            onClick={() => {
              setIsStatusOpen(false);
              setIsChannelOpen((previous) => !previous);
            }}
          >
            <span>{selectedChannelLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-4 text-slate-500 transition-transform", isChannelOpen && "rotate-180")}
            />
          </button>

          {isChannelOpen && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-md border border-slate-200 bg-white shadow-sm">
              <ul role="listbox" className="py-1">
                {channelOptions.map((option) => {
                  const isSelected = option.value === values.channel;

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50",
                          isSelected && "text-slate-900",
                        )}
                        onClick={() => {
                          onChannelChange(option.value);
                          setIsChannelOpen(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check aria-hidden="true" className="size-4 text-blue-600" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:justify-end">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Search:</p>
          <div className="relative w-full max-w-sm">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={values.keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="Tìm theo tên hoặc SKU"
              className="h-10 border-slate-200 bg-white pl-9 text-sm font-medium text-slate-700"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
