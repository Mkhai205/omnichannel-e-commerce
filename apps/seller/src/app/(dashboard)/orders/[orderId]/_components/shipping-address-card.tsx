import { Card, CardContent } from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";

type ShippingAddressCardProps = {
    address: SellerOrderDetailResponse["shippingAddress"];
};

function toAddressLines(address: SellerOrderDetailResponse["shippingAddress"]): string[] {
    return [
        address.streetAddress,
        address.wardDistrict || "",
        `${address.city}, ${address.state}`,
        `${address.postalCode}, ${address.country}`,
    ].filter((line) => line.trim().length > 0);
}

export function ShippingAddressCard({ address }: ShippingAddressCardProps) {
    const lines = toAddressLines(address);

    return (
        <Card className="border-slate-200">
            <CardContent className="space-y-3 px-6 py-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Địa chỉ giao hàng
                </h2>

                <div>
                    <p className="text-xs uppercase tracking-[0.13em] text-slate-400">Người nhận</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                        {address.recipientName}
                    </p>
                    <p className="text-sm text-slate-700">{address.recipientPhone}</p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.13em] text-slate-400">Địa chỉ</p>
                    <div className="mt-1 space-y-1 text-sm text-slate-700">
                        {lines.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
