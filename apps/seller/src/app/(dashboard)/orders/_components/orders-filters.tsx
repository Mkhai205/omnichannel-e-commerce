"use client";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { RotateCcw } from "lucide-react";
import type { OrderStatusFilterValue, OrdersFilterValues, OrdersStatusOption } from "../types";

type OrdersFiltersProps = {
    values: OrdersFilterValues;
    statusOptions: OrdersStatusOption[];
    isDisabled?: boolean;
    onStatusChange: (value: OrderStatusFilterValue) => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
};

export function OrdersFilters({
    values,
    statusOptions,
    isDisabled = false,
    onStatusChange,
    onApplyFilters,
    onResetFilters,
}: OrdersFiltersProps) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
                <div className="grid gap-2">
                    <p className="text-xs font-semibold uppercase">Trạng thái</p>
                    <Select
                        value={values.status}
                        onValueChange={(value) => onStatusChange(value as OrderStatusFilterValue)}
                        disabled={isDisabled}
                    >
                        <SelectTrigger className="h-11 border-slate-300 text-base">
                            <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="button"
                    className="h-11 rounded-md bg-blue-500 px-6 text-base font-semibold uppercase tracking-[0.02em] text-white hover:bg-blue-500/90"
                    onClick={onApplyFilters}
                    disabled={isDisabled}
                >
                    Áp dụng bộ lọc
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-md border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                    onClick={() => {
                        onResetFilters();
                    }}
                    disabled={isDisabled}
                >
                    <RotateCcw aria-hidden="true" className="size-4" />
                </Button>
            </div>
        </section>
    );
}
