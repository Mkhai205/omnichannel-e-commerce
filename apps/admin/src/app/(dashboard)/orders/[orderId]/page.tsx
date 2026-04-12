"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AdminOrderDetailResponse } from "@repo/shared-types";
import { Card, CardContent } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getAdminOrderDetail } from "@/services/orders-service";
import { CustomerInfoCard } from "./_components/customer-info-card";
import { OrderDetailHeader } from "./_components/order-detail-header";
import { OrderInfoCard } from "./_components/order-info-card";
import { OrderItemsTable } from "./_components/order-items-table";

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = useMemo(() => {
        const value = params.orderId;

        if (typeof value === "string") {
            return value;
        }

        if (Array.isArray(value)) {
            return value[0] ?? "";
        }

        return "";
    }, [params.orderId]);

    const [detail, setDetail] = useState<AdminOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async () => {
        if (orderId.length === 0) {
            setErrorMessage("Mã đơn hàng không hợp lệ");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await getAdminOrderDetail(orderId);
            setDetail(response);
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải chi tiết đơn hàng");
            }
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        void fetchOrderDetail();
    }, [fetchOrderDetail]);

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            {detail ? (
                <OrderDetailHeader
                    detail={detail}
                    onBack={() => {
                        router.push("/orders");
                    }}
                />
            ) : (
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Chi tiết đơn hàng quản trị
                        </p>
                        <h1 className="text-2xl font-semibold text-slate-900">Chi tiết đơn hàng</h1>
                    </div>
                </header>
            )}

            {errorMessage ? (
                <Card className="border-rose-200 bg-rose-50">
                    <CardContent className="px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </CardContent>
                </Card>
            ) : null}

            {isLoading ? (
                <Card className="border-slate-200">
                    <CardContent className="px-6 py-10 text-center text-sm text-slate-500">
                        Đang tải chi tiết đơn hàng...
                    </CardContent>
                </Card>
            ) : null}

            {!isLoading && detail ? (
                <>
                    <section className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
                        <OrderInfoCard detail={detail} className="h-full" />
                        <CustomerInfoCard
                            customer={detail.customer}
                            address={detail.shippingAddress}
                            className="h-full"
                        />
                    </section>

                    <OrderItemsTable items={detail.items} />
                </>
            ) : null}
        </section>
    );
}
