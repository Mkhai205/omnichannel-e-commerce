"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui";
import { ArrowLeft, PackageCheck, Truck } from "lucide-react";
import type { OrderStatus, SellerOrderDetailResponse, SettlementStatus } from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import {
    getSellerOrderDetail,
    markSellerOrderAsDelivered,
    markSellerOrderAsProcessing,
    markSellerOrderAsShipped,
} from "@/services/orders-service";

function formatCurrency(value: string): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0đ";
    }

    return `${amount.toLocaleString("vi-VN")}đ`;
}

function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getStatusLabel(status: OrderStatus): string {
    if (status === "PENDING_PAYMENT") {
        return "Chờ thanh toán";
    }

    if (status === "PAID") {
        return "Đã thanh toán";
    }

    if (status === "PROCESSING") {
        return "Đang xử lý";
    }

    if (status === "SHIPPED") {
        return "Đang giao";
    }

    if (status === "DELIVERED") {
        return "Hoàn tất";
    }

    return "Đã hủy";
}

function getStatusClassName(status: OrderStatus): string {
    if (status === "PENDING_PAYMENT" || status === "PAID") {
        return "bg-blue-100 text-blue-700";
    }

    if (status === "PROCESSING" || status === "SHIPPED") {
        return "bg-amber-100 text-amber-700";
    }

    if (status === "DELIVERED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-rose-100 text-rose-700";
}

function getSettlementLabel(status: SettlementStatus): string {
    if (status === "SETTLED") {
        return "Đã đối soát";
    }

    return "Chờ đối soát";
}

function getSettlementClassName(status: SettlementStatus): string {
    if (status === "SETTLED") {
        return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
}

export default function SellerOrderDetailPage() {
    const params = useParams();
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

    const canMoveToProcessing = detail?.status === "PAID";
    const canMoveToShipped = detail?.status === "PROCESSING";
    const canMoveToDelivered = detail?.status === "SHIPPED";

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
                setErrorMessage("Không thể chuyển trạng thái đơn hàng.");
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
                setErrorMessage("Không thể cập nhật trạng thái giao hàng.");
            }
        } finally {
            setIsMutating(false);
        }
    };

    const handleMoveToDelivered = async () => {
        if (!detail || isMutating) {
            return;
        }

        setIsMutating(true);

        try {
            await markSellerOrderAsDelivered(detail.id);
            await fetchOrderDetail();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể cập nhật trạng thái hoàn tất đơn hàng.");
            }
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Button asChild variant="ghost" size="sm" className="w-fit text-slate-600">
                        <Link href="/orders">
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Quay lại danh sách
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-semibold text-slate-900">Chi tiết đơn hàng</h1>
                </div>
            </div>

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
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
                    <Card className="border-slate-200">
                        <CardContent className="grid gap-5 px-6 py-6 lg:grid-cols-[1.5fr_1fr]">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                        Mã đơn hàng
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900">
                                        {detail.orderNumber}
                                    </p>
                                    <p className="text-xs text-slate-400">{detail.id}</p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Ngày tạo
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">
                                            {formatDateTime(detail.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Ngày bàn giao vận chuyển
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">
                                            {formatDateTime(detail.shippedAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Ngày giao thành công
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">
                                            {formatDateTime(detail.deliveredAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Trạng thái đơn
                                        </p>
                                        <span
                                            className={`mt-1 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClassName(detail.status)}`}
                                        >
                                            {getStatusLabel(detail.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Đối soát
                                        </p>
                                        <span
                                            className={`mt-1 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getSettlementClassName(detail.settlementStatus)}`}
                                        >
                                            {getSettlementLabel(detail.settlementStatus)}
                                        </span>
                                    </div>
                                </div>

                                {detail.note ? (
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                            Ghi chú khách hàng
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700">{detail.note}</p>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.13em] text-slate-400">
                                        Tổng thanh toán
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                                        {formatCurrency(detail.totalAmount)}
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Button
                                        type="button"
                                        className="justify-start bg-blue-600 text-white hover:bg-blue-600/90"
                                        onClick={handleMoveToProcessing}
                                        disabled={!canMoveToProcessing || isMutating}
                                    >
                                        <PackageCheck className="size-4" aria-hidden="true" />
                                        Chuyển sang xử lý
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-start border-slate-300"
                                        onClick={handleMoveToShipped}
                                        disabled={!canMoveToShipped || isMutating}
                                    >
                                        <Truck className="size-4" aria-hidden="true" />
                                        Đánh dấu đã bàn giao vận chuyển
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-start border-slate-300"
                                        onClick={handleMoveToDelivered}
                                        disabled={!canMoveToDelivered || isMutating}
                                    >
                                        <PackageCheck className="size-4" aria-hidden="true" />
                                        Xác nhận giao thành công
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardContent className="px-0 py-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-200 bg-slate-50/70">
                                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                                            Sản phẩm
                                        </TableHead>
                                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                                            SKU
                                        </TableHead>
                                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                                            Số lượng
                                        </TableHead>
                                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                                            Đơn giá
                                        </TableHead>
                                        <TableHead className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                                            Thành tiền
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detail.items.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-sm text-slate-500"
                                            >
                                                Đơn hàng chưa có sản phẩm.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        detail.items.map((item) => (
                                            <TableRow key={item.id} className="border-slate-200">
                                                <TableCell className="px-4 py-4 text-sm font-medium text-slate-800">
                                                    {item.productName}
                                                </TableCell>
                                                <TableCell className="px-4 py-4 text-sm text-slate-600">
                                                    {item.variantSku}
                                                </TableCell>
                                                <TableCell className="px-4 py-4 text-sm text-slate-600">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="px-4 py-4 text-sm text-slate-600">
                                                    {formatCurrency(item.unitPrice)}
                                                </TableCell>
                                                <TableCell className="px-4 py-4 text-sm font-semibold text-slate-800">
                                                    {formatCurrency(item.lineTotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            ) : null}
        </section>
    );
}
