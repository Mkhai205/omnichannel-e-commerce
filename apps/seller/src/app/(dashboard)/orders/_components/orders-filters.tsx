"use client";

import { useState } from "react";
import { Button, Input } from "@repo/ui";
import { cn } from "@repo/ui";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import type { FilterValues } from "../types";

type SelectOption = {
  value: string;
  label: string;
};

type OrdersFiltersProps = {
  values: FilterValues;
  channelOptions: SelectOption[];
  statusOptions: SelectOption[];
  onChannelChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
};

export function OrdersFilters({
  values,
  channelOptions,
  statusOptions,
  onChannelChange,
  onStatusChange,
  onDateChange,
  onApplyFilters,
  onResetFilters,
}: OrdersFiltersProps) {
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const selectedChannelLabel =
    channelOptions.find((option) => option.value === values.channel)?.label ?? "Tất cả các kênh";
  const selectedStatusLabel =
    statusOptions.find((option) => option.value === values.status)?.label ?? "Tất cả trạng thái";

  return (
    <section className="relative rounded-lg border border-slate-200 bg-white p-5">
      {(isChannelOpen || isStatusOpen) && (
        <button
          type="button"
          aria-label="Đóng danh sách lọc"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => {
            setIsChannelOpen(false);
            setIsStatusOpen(false);
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-end">
        <div className="relative z-50 grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Kênh bán hàng</p>
          <button
            type="button"
            className="flex h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-base font-medium text-slate-800"
            aria-haspopup="listbox"
            aria-expanded={isChannelOpen}
            onClick={() => {
              setIsStatusOpen(false);
              setIsChannelOpen((prev) => !prev);
            }}
          >
            <span className="truncate">{selectedChannelLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-5 text-slate-500 transition-transform", isChannelOpen && "rotate-180")}
            />
          </button>

          {isChannelOpen && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full rounded-md border border-slate-200 bg-white shadow-sm">
              <ul role="listbox" className="py-1">
                {channelOptions.map((option) => {
                  const isSelected = option.value === values.channel;

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-base font-medium text-slate-700 hover:bg-slate-50",
                          isSelected && "text-slate-900",
                        )}
                        onClick={() => {
                          onChannelChange(option.value);
                          setIsChannelOpen(false);
                        }}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && <Check aria-hidden="true" className="size-4 text-blue-600" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="relative z-50 grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Trạng thái</p>
          <button
            type="button"
            className="flex h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-base font-medium text-slate-800"
            aria-haspopup="listbox"
            aria-expanded={isStatusOpen}
            onClick={() => {
              setIsChannelOpen(false);
              setIsStatusOpen((prev) => !prev);
            }}
          >
            <span className="truncate">{selectedStatusLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-5 text-slate-500 transition-transform", isStatusOpen && "rotate-180")}
            />
          </button>

          {isStatusOpen && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full rounded-md border border-slate-200 bg-white shadow-sm">
              <ul role="listbox" className="py-1">
                {statusOptions.map((option) => {
                  const isSelected = option.value === values.status;

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-base font-medium text-slate-700 hover:bg-slate-50",
                          isSelected && "text-slate-900",
                        )}
                        onClick={() => {
                          onStatusChange(option.value);
                          setIsStatusOpen(false);
                        }}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && <Check aria-hidden="true" className="size-4 text-blue-600" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Ngày đặt hàng</p>
          <Input
            value={values.orderDate}
            onChange={(event) => onDateChange(event.target.value)}
            placeholder="mm/dd/yyyy"
            className="h-11 border-slate-300 text-base"
            inputMode="numeric"
          />
        </div>

        <Button
          type="button"
          className="h-11 rounded-md bg-blue-500 px-6 text-base font-semibold uppercase tracking-[0.02em] text-white hover:bg-blue-500/90"
          onClick={onApplyFilters}
        >
          Áp dụng bộ lọc
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-md border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
          onClick={() => {
            setIsChannelOpen(false);
            setIsStatusOpen(false);
            onResetFilters();
          }}
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
