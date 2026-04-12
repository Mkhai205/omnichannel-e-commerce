import type { CustomerOrderDetailResponse } from "@repo/shared-types";
import Image from "next/image";
import { CreditCardIcon, MapPinIcon, PackageIcon, PhoneIcon, UserIcon } from "lucide-react";
import { formatVnd } from "@/lib/currency";
import {
    formatOrderDate,
    getOrderStatusBadgeClass,
    getOrderStatusLabel,
} from "../../_lib/order-presentation";

type OrderSummaryPanelProps = {
    order: CustomerOrderDetailResponse;
};

export function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
    return (
        <section className="space-y-4">
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Đơn hàng
                        </p>
                        <h2 className="mt-1 text-base font-semibold text-gray-900">
                            {order.orderNumber}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Đặt lúc: {formatOrderDate(order.createdAt)}
                        </p>
                    </div>
                    <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}
                    >
                        {getOrderStatusLabel(order.status)}
                    </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Tạm tính</span>
                        <span className="font-medium text-gray-900">
                            {formatVnd(order.subtotal)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Phí vận chuyển</span>
                        <span className="font-medium text-gray-900">Miễn phí</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        <span className="font-semibold text-gray-900">Tổng cộng</span>
                        <span className="text-lg font-bold text-success-dark">
                            {formatVnd(order.totalAmount)}
                        </span>
                    </div>
                </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900">
                    Sản phẩm ({order.itemCount})
                </h3>
                <ul className="mt-3 space-y-3">
                    {order.items.map((item) => (
                        <li
                            key={item.id}
                            className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-xl border border-gray-100 bg-gray-50 p-2.5"
                        >
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-lg object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                                    <PackageIcon className="size-4" />
                                </div>
                            )}

                            <div className="space-y-0.5">
                                <p className="line-clamp-2 text-sm font-medium text-gray-900">
                                    {item.productName}
                                </p>
                                <p className="text-xs text-gray-500">SKU: {item.variantSku}</p>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Số lượng: {item.quantity}</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatVnd(item.lineTotal)}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900">Thông tin giao hàng</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p className="inline-flex items-center gap-2">
                        <UserIcon className="size-4 text-gray-500" />
                        {order.shippingAddress.recipientName}
                    </p>
                    <p className="inline-flex items-center gap-2">
                        <PhoneIcon className="size-4 text-gray-500" />
                        {order.shippingAddress.recipientPhone}
                    </p>
                    <p className="inline-flex items-start gap-2">
                        <MapPinIcon className="mt-0.5 size-4 text-gray-500" />
                        <span>
                            {order.shippingAddress.streetAddress}
                            {order.shippingAddress.wardDistrict
                                ? `, ${order.shippingAddress.wardDistrict}`
                                : ""}
                            , {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                    </p>
                </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900">Thanh toán</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p className="inline-flex items-center gap-2">
                        <CreditCardIcon className="size-4 text-gray-500" />
                        Cổng: {order.payment.paymentProvider ?? "-"}
                    </p>
                    <p>
                        Trạng thái thanh toán:{" "}
                        <span className="font-medium">{order.payment.paymentStatus ?? "-"}</span>
                    </p>
                    <p>Txn Ref: {order.payment.txnRef ?? "-"}</p>
                    <p>
                        Thanh toán lúc:{" "}
                        {order.payment.paidAt ? formatOrderDate(order.payment.paidAt) : "-"}
                    </p>
                </div>
            </article>
        </section>
    );
}
