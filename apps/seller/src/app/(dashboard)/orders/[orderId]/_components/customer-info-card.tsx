import type { ReactNode } from "react";
import { Card, CardContent, cn } from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";

type CustomerInfoCardProps = {
    customer: SellerOrderDetailResponse["customer"];
    address: SellerOrderDetailResponse["shippingAddress"];
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
            className={`grid grid-cols-1 items-start gap-2 py-3 md:grid-cols-[170px_1fr] ${
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

function formatShippingAddress(address: SellerOrderDetailResponse["shippingAddress"]): string {
    const parts = [
        address.streetAddress,
        address.wardDistrict,
        address.city,
        address.state,
        address.country,
    ].filter((part) => typeof part === "string" && part.trim().length > 0);

    return parts.join(", ");
}

export function CustomerInfoCard({ customer, address, className }: CustomerInfoCardProps) {
    return (
        <Card className={cn("border-slate-200", className)}>
            <CardContent className="space-y-4 px-6 py-6">
                <h2 className="text-2xl font-semibold text-slate-900">Thông tin khách hàng</h2>

                <section>
                    <InfoRow label="Tên khách hàng" value={customer.name} />
                    <InfoRow label="Số điện thoại" value={customer.phone || "Chưa cập nhật"} />
                    <InfoRow label="Email" value={customer.email} />
                    <InfoRow
                        label="Địa chỉ giao hàng"
                        value={formatShippingAddress(address)}
                        isLast
                    />
                </section>
            </CardContent>
        </Card>
    );
}
