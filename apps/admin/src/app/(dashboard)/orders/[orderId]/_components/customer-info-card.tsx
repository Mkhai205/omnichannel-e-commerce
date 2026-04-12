import type { SellerOrderCustomerInfo, SellerOrderShippingAddressInfo } from "@repo/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type CustomerInfoCardProps = {
    customer: SellerOrderCustomerInfo;
    address: SellerOrderShippingAddressInfo;
    className?: string;
};

export function CustomerInfoCard({ customer, address, className }: CustomerInfoCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Customer and shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Customer name</span>
                    <span className="font-medium">{customer.name}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium">{customer.email}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Phone</span>
                    <span>{customer.phone || "-"}</span>
                </div>

                <div className="border-t border-slate-200 pt-3" />

                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Recipient</span>
                    <span>{address.recipientName}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Recipient phone</span>
                    <span>{address.recipientPhone}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Address</span>
                    <span>
                        {address.streetAddress}
                        {address.wardDistrict ? `, ${address.wardDistrict}` : ""}
                        {`, ${address.city}, ${address.state}, ${address.country}`}
                    </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-slate-500">Postal code</span>
                    <span>{address.postalCode}</span>
                </div>
            </CardContent>
        </Card>
    );
}
