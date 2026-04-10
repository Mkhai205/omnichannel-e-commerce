import type { OrderStatus } from "@repo/shared-types";

export const ORDER_STATUS_FILTER_OPTIONS: Array<{ value: "ALL" | OrderStatus; label: string }> = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
};

const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-800 border-amber-200",
    PAID: "bg-primary/10 text-primary border-primary/20",
    PROCESSING: "bg-sky-100 text-sky-700 border-sky-200",
    SHIPPED: "bg-success/15 text-success-dark border-success/20",
    DELIVERED: "bg-success/20 text-success-dark border-success/30",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function getOrderStatusLabel(status: OrderStatus): string {
    return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusBadgeClass(status: OrderStatus): string {
    return ORDER_STATUS_BADGE_CLASSES[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function formatOrderDate(value: string): string {
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}
