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
                placeholder="Tìm đơn hàng/khách hàng/cửa hàng..."
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
                    <SelectItem value="DELIVERED">Đã giao</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
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
                    <SelectValue placeholder="Đối soát" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả đối soát</SelectItem>
                    <SelectItem value="PENDING">Chờ đối soát</SelectItem>
                    <SelectItem value="SETTLED">Đã đối soát</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="date"
                value={placedFrom}
                onChange={(event) => onPlacedFromChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Ngày đặt từ"
            />

            <Input
                type="date"
                value={placedTo}
                onChange={(event) => onPlacedToChange(event.target.value)}
                className="h-10"
                disabled={isDisabled}
                aria-label="Ngày đặt đến"
            />
        </section>
    );
}
