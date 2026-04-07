"use client";

import { Button, Card, CardContent, cn } from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";
import { PackageCheck, Truck } from "lucide-react";
import { formatCurrency, getOrderStatusLabel } from "../utils/order-detail-format";

type SellerActionsCardProps = {
    detail: SellerOrderDetailResponse;
    isMutating: boolean;
    onMoveToProcessing: () => void;
    onMoveToShipped: () => void;
    className?: string;
};

export function SellerActionsCard({
    detail,
    isMutating,
    onMoveToProcessing,
    onMoveToShipped,
    className,
}: SellerActionsCardProps) {
    const canMoveToProcessing = detail.status === "PAID";
    const canMoveToShipped = detail.status === "PROCESSING";

    return (
        <Card className={cn("border-slate-200", className)}>
            <CardContent className="flex h-full flex-col justify-between gap-4 px-6 py-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                        Tổng thanh toán
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {formatCurrency(detail.totalAmount)}
                    </p>
                </div>

                <div className="grid gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Thao tác người bán
                    </p>
                    <p className="text-xs text-slate-500">
                        Trạng thái hiện tại: {getOrderStatusLabel(detail.status)}. Chỉ cho phép thao
                        tác chuyển sang Đang chuẩn bị và Đã giao cho shipper.
                    </p>

                    <Button
                        type="button"
                        className="justify-start bg-blue-600 text-white hover:bg-blue-600/90"
                        onClick={onMoveToProcessing}
                        disabled={!canMoveToProcessing || isMutating}
                    >
                        <PackageCheck className="size-4" aria-hidden="true" />
                        Chuyển sang Đang chuẩn bị
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-start border-slate-300"
                        onClick={onMoveToShipped}
                        disabled={!canMoveToShipped || isMutating}
                    >
                        <Truck className="size-4" aria-hidden="true" />
                        Đã giao cho shipper
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
