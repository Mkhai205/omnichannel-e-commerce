import type { CustomerOrderListItem } from "@repo/shared-types";
import Link from "next/link";
import { ArrowRightIcon, PackageIcon } from "lucide-react";
import { formatVnd } from "@/lib/currency";
import {
    formatOrderDate,
    getOrderStatusBadgeClass,
    getOrderStatusLabel,
} from "../_lib/order-presentation";

type OrderCardProps = {
    order: CustomerOrderListItem;
};

export function OrderCard({ order }: OrderCardProps) {
    return (
        <Link
            href={`/account/orders/${order.id}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Mã đơn hàng
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                        {order.orderNumber}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Đặt lúc: {formatOrderDate(order.createdAt)}
                    </p>
                </div>

                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}
                >
                    {getOrderStatusLabel(order.status)}
                </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-500">Sản phẩm</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        {order.itemCount} món
                    </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-500">Tạm tính</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        {formatVnd(order.subtotal)}
                    </p>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/10 px-3 py-2">
                    <p className="text-xs text-success-dark">Tổng cộng</p>
                    <p className="mt-0.5 text-sm font-semibold text-success-dark">
                        {formatVnd(order.totalAmount)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <div className="inline-flex items-center gap-2 text-gray-600">
                    <PackageIcon className="size-4" />
                    Theo dõi chi tiết đơn hàng
                </div>
                <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    Xem chi tiết
                    <ArrowRightIcon className="size-4" />
                </span>
            </div>
        </Link>
    );
}
