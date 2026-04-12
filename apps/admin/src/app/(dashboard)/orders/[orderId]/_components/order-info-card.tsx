import type { AdminOrderDetailResponse } from "@repo/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type OrderInfoCardProps = {
    detail: AdminOrderDetailResponse;
    className?: string;
};

function formatDate(value: string | null | undefined): string {
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

export function OrderInfoCard({ detail, className }: OrderInfoCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Order information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Order number</span>
                    <span className="font-medium">{detail.orderNumber}</span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Placed at</span>
                    <span className="font-medium">{formatDate(detail.createdAt)}</span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">
                        {Number(detail.subtotal).toLocaleString("vi-VN")}d
                    </span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Total amount</span>
                    <span className="font-semibold">
                        {Number(detail.totalAmount).toLocaleString("vi-VN")}d
                    </span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Shipped at</span>
                    <span>{formatDate(detail.shippedAt)}</span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Delivered at</span>
                    <span>{formatDate(detail.deliveredAt)}</span>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-2">
                    <span className="text-slate-500">Settled at</span>
                    <span>{formatDate(detail.settledAt)}</span>
                </div>
                {detail.note ? (
                    <div className="grid grid-cols-[160px_1fr] gap-2">
                        <span className="text-slate-500">Buyer note</span>
                        <span>{detail.note}</span>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
