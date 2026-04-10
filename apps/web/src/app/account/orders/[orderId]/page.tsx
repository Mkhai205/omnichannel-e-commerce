"use client";

import type { CustomerOrderDetailResponse } from "@repo/shared-types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getCustomerOrderDetail } from "@/services/order-service";
import { AccountPageHeader } from "../../_components/account-page-header";
import { getOrderStatusBadgeClass, getOrderStatusLabel } from "../_lib/order-presentation";
import { OrderSummaryPanel } from "./_components/order-summary-panel";
import { OrderTrackingTimeline } from "./_components/order-tracking-timeline";

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

export default function CustomerOrderDetailPage() {
    const params = useParams<{ orderId: string }>();
    const orderId = typeof params.orderId === "string" ? params.orderId : "";

    const [order, setOrder] = useState<CustomerOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setErrorMessage("Mã đơn hàng không hợp lệ.");
            setIsLoading(false);
            return;
        }

        let isActive = true;

        const loadOrder = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const detail = await getCustomerOrderDetail(orderId);
                if (isActive) {
                    setOrder(detail);
                }
            } catch (error) {
                if (isActive) {
                    setErrorMessage(
                        resolveApiErrorMessage(error, "Không thể tải chi tiết đơn hàng."),
                    );
                    setOrder(null);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void loadOrder();

        return () => {
            isActive = false;
        };
    }, [orderId]);

    return (
        <>
            <AccountPageHeader
                title="Order Tracking"
                description="Theo dõi tiến trình xử lý, giao hàng và thông tin thanh toán của đơn."
                action={
                    order ? (
                        <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}
                        >
                            {getOrderStatusLabel(order.status)}
                        </span>
                    ) : undefined
                }
            />

            <Button asChild variant="outline" className="w-fit">
                <Link href="/account/orders" className="inline-flex items-center gap-2">
                    <ArrowLeftIcon className="size-4" />
                    Quay lại lịch sử đơn
                </Link>
            </Button>

            {isLoading ? (
                <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
                    <div className="h-105 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                    <div className="h-105 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                </section>
            ) : null}

            {!isLoading && errorMessage ? (
                <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
                    <p>{errorMessage}</p>
                    <Button asChild className="mt-3">
                        <Link href="/account/orders">Quay lại lịch sử đơn hàng</Link>
                    </Button>
                </section>
            ) : null}

            {!isLoading && order ? (
                <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:items-start">
                    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-1.5 text-sm text-success-dark">
                            <TruckIcon className="size-4" />
                            Hành trình đơn hàng
                        </div>
                        <OrderTrackingTimeline events={order.trackingTimeline} />
                    </article>

                    <OrderSummaryPanel order={order} />
                </section>
            ) : null}
        </>
    );
}
