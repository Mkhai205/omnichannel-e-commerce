"use client";

import {
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import type { OrderStatusFilterValue, SettlementStatusFilterValue } from "../types";

type OrdersFiltersProps = {
    keyword: string;
    placedFrom: string;
    placedTo: string;
    status: OrderStatusFilterValue;
    settlementStatus: SettlementStatusFilterValue;
    isDisabled?: boolean;
    onKeywordChange: (value: string) => void;
    onPlacedFromChange: (value: string) => void;
    onPlacedToChange: (value: string) => void;
    onStatusChange: (value: OrderStatusFilterValue) => void;
    onSettlementStatusChange: (value: SettlementStatusFilterValue) => void;
};

export function OrdersFilters({
    keyword,
    placedFrom,
    placedTo,
    status,
    settlementStatus,
    isDisabled = false,
    onKeywordChange,
    onPlacedFromChange,
    onPlacedToChange,
    onStatusChange,
    onSettlementStatusChange,
}: OrdersFiltersProps) {
    return (
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_170px_170px_170px_170px] md:items-center">
            <Input
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="Search order/customer/shop..."
                className="h-10"
                disabled={isDisabled}
            />

            <Select
                value={status}
                onValueChange={(value) => onStatusChange(value as OrderStatusFilterValue)}
                disabled={isDisabled}
            >
                <SelectTrigger className="h-10">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All status</SelectItem>
                    <SelectItem value="PENDING_PAYMENT">PENDING_PAYMENT</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                    <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                    <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={settlementStatus}
                onValueChange={(value) =>
                    onSettlementStatusChange(value as SettlementStatusFilterValue)
                }
                disabled={isDisabled}
            >
                <SelectTrigger className="h-10">
                    <SelectValue placeholder="Settlement" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All settlement</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="SETTLED">SETTLED</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="date"
                value={placedFrom}
                onChange={(event) => onPlacedFromChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Placed from"
            />

            <Input
                type="date"
                value={placedTo}
                onChange={(event) => onPlacedToChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Placed to"
            />
        </section>
    );
}
