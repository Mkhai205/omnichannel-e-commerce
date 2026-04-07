"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import {
    getSellerOrderDetail,
    markSellerOrderAsProcessing,
    markSellerOrderAsShipped,
} from "@/services/orders-service";
import { CustomerInfoCard } from "./_components/customer-info-card";
import { OrderDetailHeader } from "./_components/order-detail-header";
import { OrderFeedbackAlert } from "./_components/order-feedback-alert";
import { OrderInfoCard } from "./_components/order-info-card";
import { OrderItemsTable } from "./_components/order-items-table";
import { SellerActionsCard } from "./_components/seller-actions-card";

export default function SellerOrderDetailPage() {
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

    const [detail, setDetail] = useState<SellerOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async () => {
        if (orderId.length === 0) {
            setErrorMessage("Mã đơn hàng không hợp lệ.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await getSellerOrderDetail(orderId);
            setDetail(response);
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải chi tiết đơn hàng.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        void fetchOrderDetail();
    }, [fetchOrderDetail]);

    const handleMoveToProcessing = async () => {
        if (!detail || isMutating) {
            return;
        }

        setIsMutating(true);

        try {
            await markSellerOrderAsProcessing(detail.id);
            await fetchOrderDetail();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể cập nhật trạng thái đơn hàng.");
            }
        } finally {
            setIsMutating(false);
        }
    };

    const handleMoveToShipped = async () => {
        if (!detail || isMutating) {
            return;
        }

        setIsMutating(true);

        try {
            await markSellerOrderAsShipped(detail.id);
            await fetchOrderDetail();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể cập nhật trạng thái đơn hàng.");
            }
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <OrderDetailHeader
                onBack={() => {
                    router.push("/orders");
                }}
            />

            {errorMessage ? <OrderFeedbackAlert message={errorMessage} /> : null}

            {isLoading ? (
                <Card className="border-slate-200">
                    <CardContent className="px-6 py-10 text-center text-sm text-slate-500">
                        Đang tải chi tiết đơn hàng...
                    </CardContent>
                </Card>
            ) : null}

            {!isLoading && detail ? (
                <>
                    <section className="grid gap-4 xl:grid-cols-[1fr_1.35fr] xl:items-stretch">
                        <OrderInfoCard detail={detail} className="h-full rounded-2xl" />

                        <section className="grid gap-4 xl:grid-rows-2">
                            <CustomerInfoCard
                                customer={detail.customer}
                                address={detail.shippingAddress}
                                className="h-full rounded-2xl"
                            />
                            <SellerActionsCard
                                detail={detail}
                                isMutating={isMutating}
                                onMoveToProcessing={handleMoveToProcessing}
                                onMoveToShipped={handleMoveToShipped}
                                className="h-full rounded-2xl"
                            />
                        </section>
                    </section>

                    <OrderItemsTable items={detail.items} />
                </>
            ) : null}
        </section>
    );
}
