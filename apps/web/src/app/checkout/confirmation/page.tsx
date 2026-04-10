"use client";

import type { PaymentStatusByOrderResponse } from "@repo/shared-types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangleIcon,
    CheckCircle2Icon,
    Clock3Icon,
    ShieldCheckIcon,
    XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
    clearCheckoutSession,
    readCheckoutSession,
    type CheckoutSessionSnapshot,
} from "@/lib/checkout-session";
import { formatVnd } from "@/lib/currency";
import { isApiRequestError } from "@/services/http-client";
import { getPaymentStatusByOrder, verifyVnpayReturn } from "@/services/payment-service";

type VerificationState = "loading" | "success" | "failed" | "pending" | "invalid";

type VerificationModel = {
    state: VerificationState;
    message: string;
    details?: string;
    statuses: PaymentStatusByOrderResponse[];
    session: CheckoutSessionSnapshot | null;
    txnRef?: string;
    responseCode?: string;
};

const PAID_ORDER_STATUSES = new Set(["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]);

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

function resolvePresentation(state: VerificationState): {
    title: string;
    icon: React.ReactNode;
    iconClassName: string;
} {
    if (state === "success") {
        return {
            title: "Thanh toán thành công",
            icon: <CheckCircle2Icon className="size-6" />,
            iconClassName: "bg-success/10 text-success",
        };
    }

    if (state === "failed") {
        return {
            title: "Thanh toán thất bại",
            icon: <XCircleIcon className="size-6" />,
            iconClassName: "bg-destructive/10 text-destructive",
        };
    }

    if (state === "pending") {
        return {
            title: "Đang chờ xác nhận giao dịch",
            icon: <Clock3Icon className="size-6" />,
            iconClassName: "bg-amber-100 text-amber-700",
        };
    }

    if (state === "invalid") {
        return {
            title: "Không thể xác minh giao dịch",
            icon: <AlertTriangleIcon className="size-6" />,
            iconClassName: "bg-gray-100 text-gray-700",
        };
    }

    return {
        title: "Đang xác minh thanh toán",
        icon: <ShieldCheckIcon className="size-6" />,
        iconClassName: "bg-primary/10 text-primary",
    };
}

export default function CheckoutConfirmationPage() {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();

    const [model, setModel] = useState<VerificationModel>({
        state: "loading",
        message: "Đang xác minh dữ liệu trả về từ VNPAY...",
        statuses: [],
        session: null,
    });

    useEffect(() => {
        let isActive = true;

        const verifyCheckout = async () => {
            if (!queryString) {
                if (isActive) {
                    setModel({
                        state: "invalid",
                        message: "Thiếu thông tin trả về từ VNPAY.",
                        details: "Vui lòng thử lại từ trang checkout.",
                        statuses: [],
                        session: null,
                    });
                }
                return;
            }

            try {
                const verifyResponse = await verifyVnpayReturn(searchParams);
                const session = readCheckoutSession();
                const orderIds = session?.orderIds ?? [];
                const statuses =
                    orderIds.length > 0
                        ? await Promise.all(
                              orderIds.map((orderId) => getPaymentStatusByOrder(orderId)),
                          )
                        : [];

                const hasFailedOrder = statuses.some(
                    (status) =>
                        status.orderStatus === "CANCELLED" ||
                        status.paymentStatus === "FAILED" ||
                        status.paymentStatus === "CANCELLED",
                );
                const hasPaidAllOrders =
                    statuses.length > 0 &&
                    statuses.every((status) => PAID_ORDER_STATUSES.has(status.orderStatus));

                let state: VerificationState = "pending";
                let message =
                    "Giao dịch đang được xử lý. Trạng thái sẽ tự cập nhật sau khi IPN hoàn tất.";

                if (!verifyResponse.isVerified) {
                    state = "invalid";
                    message = verifyResponse.message || "Dữ liệu trả về không hợp lệ.";
                } else if (hasPaidAllOrders) {
                    state = "success";
                    message = "Đơn hàng đã được thanh toán thành công.";
                } else if (!verifyResponse.isSuccess || hasFailedOrder) {
                    state = "failed";
                    message = verifyResponse.message || "Thanh toán không thành công.";
                }

                if (state === "success" || state === "failed") {
                    clearCheckoutSession();
                }

                if (isActive) {
                    setModel({
                        state,
                        message,
                        details: verifyResponse.message,
                        statuses,
                        session,
                        txnRef: verifyResponse.txnRef,
                        responseCode: verifyResponse.responseCode,
                    });
                }
            } catch (error) {
                if (isActive) {
                    setModel({
                        state: "invalid",
                        message: "Không thể xác minh trạng thái thanh toán.",
                        details: resolveApiErrorMessage(
                            error,
                            "Hệ thống đang bận, vui lòng kiểm tra lại trong ít phút.",
                        ),
                        statuses: [],
                        session: readCheckoutSession(),
                    });
                }
            }
        };

        void verifyCheckout();

        return () => {
            isActive = false;
        };
    }, [queryString, searchParams]);

    const presentation = useMemo(() => resolvePresentation(model.state), [model.state]);

    return (
        <main className="bg-gray-50 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-3">
                            <span
                                className={`inline-flex size-12 items-center justify-center rounded-full ${presentation.iconClassName}`}
                            >
                                {presentation.icon}
                            </span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {presentation.title}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">{model.message}</p>
                                {model.details ? (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Chi tiết: {model.details}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
                            <p className="font-semibold text-gray-800">Thông tin giao dịch</p>
                            <p className="text-gray-600">
                                Mã tham chiếu:{" "}
                                <span className="font-medium text-gray-900">
                                    {model.txnRef ?? "-"}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Mã phản hồi:{" "}
                                <span className="font-medium text-gray-900">
                                    {model.responseCode ?? "-"}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Payment ID:{" "}
                                <span className="font-medium text-gray-900">
                                    {model.session?.paymentId ?? "-"}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Tổng thanh toán:{" "}
                                <span className="font-medium text-gray-900">
                                    {model.session ? formatVnd(model.session.totalAmount) : "-"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <h2 className="text-sm font-semibold text-gray-800">
                            Trạng thái theo đơn hàng
                        </h2>
                        {model.statuses.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                Chưa có dữ liệu đơn hàng chi tiết. Bạn vẫn có thể kiểm tra lại trong
                                giỏ hàng.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm text-gray-700">
                                {model.statuses.map((status) => (
                                    <li
                                        key={status.orderId}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                                    >
                                        <span className="font-medium text-gray-900">
                                            Đơn: {status.orderId}
                                        </span>
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                            {status.orderStatus}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {model.state === "success" ? (
                            <>
                                <Button
                                    asChild
                                    className="bg-success text-success-foreground hover:bg-success-dark"
                                >
                                    <Link href="/">Tiếp tục mua sắm</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/cart">Về giỏ hàng</Link>
                                </Button>
                            </>
                        ) : null}

                        {model.state === "failed" ? (
                            <>
                                <Button
                                    asChild
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/checkout">Thử thanh toán lại</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/cart">Về giỏ hàng</Link>
                                </Button>
                            </>
                        ) : null}

                        {model.state === "pending" ? (
                            <>
                                <Button
                                    asChild
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/cart">Kiểm tra giỏ hàng</Link>
                                </Button>
                                <Button variant="outline" onClick={() => window.location.reload()}>
                                    Tải lại trạng thái
                                </Button>
                            </>
                        ) : null}

                        {model.state === "invalid" ? (
                            <>
                                <Button
                                    asChild
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/checkout">Quay lại checkout</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/cart">Về giỏ hàng</Link>
                                </Button>
                            </>
                        ) : null}
                    </div>
                </section>
            </div>
        </main>
    );
}
