"use client";

import type { OrderStatus } from "@repo/shared-types";
import { SearchIcon } from "lucide-react";
import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { ORDER_STATUS_FILTER_OPTIONS } from "../_lib/order-presentation";

type OrderHistoryFilterProps = {
    status: "ALL" | OrderStatus;
    search: string;
    isLoading: boolean;
    onStatusChange: (status: "ALL" | OrderStatus) => void;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
};

export function OrderHistoryFilter({
    status,
    search,
    isLoading,
    onStatusChange,
    onSearchChange,
    onSearchSubmit,
}: OrderHistoryFilterProps) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_120px] md:items-center">
                <Select
                    value={status}
                    onValueChange={(value) => onStatusChange(value as "ALL" | OrderStatus)}
                    disabled={isLoading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUS_FILTER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                onSearchSubmit();
                            }
                        }}
                        className="pl-9"
                        placeholder="Tìm theo mã đơn (VD: ORD-2026...)"
                        disabled={isLoading}
                    />
                </div>

                <Button onClick={onSearchSubmit} disabled={isLoading}>
                    Tìm kiếm
                </Button>
            </div>
        </section>
    );
}
