import type { OrderStatus, SettlementStatus } from "@repo/shared-types";

export function formatCurrency(value: string): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0đ";
    }

    return `${amount.toLocaleString("vi-VN")}đ`;
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function getOrderStatusLabel(status: OrderStatus): string {
    if (status === "PENDING_PAYMENT") {
        return "Chờ thanh toán";
    }

    if (status === "PAID") {
        return "Đã thanh toán";
    }

    if (status === "PROCESSING") {
        return "Đang chuẩn bị";
    }

    if (status === "SHIPPED") {
        return "Đã giao cho shipper";
    }

    if (status === "DELIVERED") {
        return "Hoàn tất";
    }

    return "Đã hủy";
}

export function getOrderStatusClassName(status: OrderStatus): string {
    if (status === "PENDING_PAYMENT" || status === "PAID") {
        return "bg-blue-100 text-blue-700";
    }

    if (status === "PROCESSING" || status === "SHIPPED") {
        return "bg-amber-100 text-amber-700";
    }

    if (status === "DELIVERED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-rose-100 text-rose-700";
}

export function getSettlementLabel(status: SettlementStatus): string {
    if (status === "SETTLED") {
        return "Đã đối soát";
    }

    return "Chờ đối soát";
}

export function getSettlementClassName(status: SettlementStatus): string {
    if (status === "SETTLED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
}
