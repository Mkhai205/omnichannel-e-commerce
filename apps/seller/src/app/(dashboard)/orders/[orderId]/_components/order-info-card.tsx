import type { ReactNode } from "react";
import { Card, CardContent, cn } from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";
import {
    formatCurrency,
    formatDateTime,
    getOrderStatusClassName,
    getOrderStatusLabel,
    getSettlementClassName,
    getSettlementLabel,
} from "../utils/order-detail-format";

type OrderInfoCardProps = {
    detail: SellerOrderDetailResponse;
    className?: string;
};

type InfoRowProps = {
    label: string;
    value: ReactNode;
    isLast?: boolean;
};

function InfoRow({ label, value, isLast = false }: InfoRowProps) {
    return (
        <div
            className={`grid grid-cols-1 items-center gap-2 py-3 md:grid-cols-[170px_1fr] ${
                isLast ? "" : "border-b border-slate-200"
            }`}
        >
            <p className="text-base text-slate-700">{label}:</p>
            <div className="text-left text-base font-semibold text-slate-900 md:text-right">
                {value}
            </div>
        </div>
    );
}

export function OrderInfoCard({ detail, className }: OrderInfoCardProps) {
    return (
        <Card className={cn("border-slate-200", className)}>
            <CardContent className="space-y-4 px-6 py-6">
                <h2 className="text-2xl font-semibold text-slate-900">Thông tin đơn hàng</h2>

                <section>
                    <InfoRow
                        label="Mã đơn"
                        value={<span className="text-blue-600">{detail.orderNumber}</span>}
                    />
                    <InfoRow label="Ngày đặt" value={formatDateTime(detail.createdAt)} />
                    <InfoRow label="Ngày giao shipper" value={formatDateTime(detail.shippedAt)} />
                    <InfoRow label="Ngày hoàn tất" value={formatDateTime(detail.deliveredAt)} />
                    <InfoRow
                        label="Trạng thái"
                        value={
                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderStatusClassName(detail.status)}`}
                            >
                                {getOrderStatusLabel(detail.status)}
                            </span>
                        }
                    />
                    <InfoRow
                        label="Đối soát"
                        value={
                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getSettlementClassName(detail.settlementStatus)}`}
                            >
                                {getSettlementLabel(detail.settlementStatus)}
                            </span>
                        }
                    />
                    <InfoRow label="Tạm tính" value={formatCurrency(detail.subtotal)} />
                    <InfoRow label="Tổng tiền" value={formatCurrency(detail.totalAmount)} isLast />
                </section>

                <section className="space-y-2">
                    <h3 className="text-2xl font-semibold text-slate-900">Ghi chú</h3>
                    <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700">
                        {detail.note || "Không có ghi chú"}
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}
