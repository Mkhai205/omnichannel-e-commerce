"use client";

import {
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import type { OrderStatusFilterValue } from "../types";

type OrdersFiltersProps = {
    keyword: string;
    placedFrom: string;
    placedTo: string;
    status: OrderStatusFilterValue;
    isDisabled?: boolean;
    onKeywordChange: (value: string) => void;
    onPlacedFromChange: (value: string) => void;
    onPlacedToChange: (value: string) => void;
    onStatusChange: (value: OrderStatusFilterValue) => void;
};

export function OrdersFilters({
    keyword,
    placedFrom,
    placedTo,
    status,
    isDisabled = false,
    onKeywordChange,
    onPlacedFromChange,
    onPlacedToChange,
    onStatusChange,
}: OrdersFiltersProps) {
    return (
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_170px_170px] md:items-center">
            <Input
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="Tìm mã đơn hoặc khách hàng..."
                className="h-10"
                disabled={isDisabled}
            />

            <Select
                value={status}
                onValueChange={(value) => onStatusChange(value as OrderStatusFilterValue)}
                disabled={isDisabled}
            >
                <SelectTrigger className="h-10">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PENDING_PAYMENT">Chờ thanh toán</SelectItem>
                    <SelectItem value="PAID">Đã thanh toán</SelectItem>
                    <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                    <SelectItem value="SHIPPED">Đang giao</SelectItem>
                    <SelectItem value="DELIVERED">Hoàn tất</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="date"
                value={placedFrom}
                onChange={(event) => onPlacedFromChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Từ ngày"
            />

            <Input
                type="date"
                value={placedTo}
                onChange={(event) => onPlacedToChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Đến ngày"
            />
        </section>
    );
}
