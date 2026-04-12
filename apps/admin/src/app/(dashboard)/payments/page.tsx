"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
    AdminPaymentListItem,
    AdminSettlementListItem,
    PaymentStatus,
    SellerSettlementStatus,
} from "@repo/shared-types";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getAdminPayments, getAdminSettlements } from "@/services/finance-service";

const PAGE_SIZE = 20;

type ActiveTab = "PAYMENTS" | "SETTLEMENTS";
type PaymentStatusFilter = "ALL" | PaymentStatus;
type SettlementStatusFilter = "ALL" | SellerSettlementStatus;

function getPaymentStatusLabel(status: PaymentStatus): string {
    if (status === "PENDING") return "Chờ xử lý";
    if (status === "SUCCESS") return "Thành công";
    if (status === "FAILED") return "Thất bại";
    return "Đã hủy";
}

function getSettlementStatusLabel(status: SellerSettlementStatus): string {
    if (status === "COMPLETED") return "Hoàn tất";
    return "Hoàn tác";
}

function formatCurrency(value: string): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0đ";
    }

    return `${amount.toLocaleString("vi-VN")}đ`;
}

function formatDate(value: string | null | undefined): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(
        date,
    );
}

export default function PaymentsPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("PAYMENTS");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [paymentRows, setPaymentRows] = useState<AdminPaymentListItem[]>([]);
    const [paymentKeyword, setPaymentKeyword] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatusFilter>("ALL");
    const [paymentFrom, setPaymentFrom] = useState("");
    const [paymentTo, setPaymentTo] = useState("");
    const [paymentPage, setPaymentPage] = useState(1);
    const [paymentTotalPages, setPaymentTotalPages] = useState(1);
    const [paymentTotalItems, setPaymentTotalItems] = useState(0);
    const [isLoadingPayments, setIsLoadingPayments] = useState(true);

    const [settlementRows, setSettlementRows] = useState<AdminSettlementListItem[]>([]);
    const [settlementKeyword, setSettlementKeyword] = useState("");
    const [settlementStatus, setSettlementStatus] = useState<SettlementStatusFilter>("ALL");
    const [settlementFrom, setSettlementFrom] = useState("");
    const [settlementTo, setSettlementTo] = useState("");
    const [settlementPage, setSettlementPage] = useState(1);
    const [settlementTotalPages, setSettlementTotalPages] = useState(1);
    const [settlementTotalItems, setSettlementTotalItems] = useState(0);
    const [isLoadingSettlements, setIsLoadingSettlements] = useState(true);

    const loadPayments = useCallback(async () => {
        setIsLoadingPayments(true);

        try {
            const response = await getAdminPayments({
                page: paymentPage,
                limit: PAGE_SIZE,
                search: paymentKeyword.trim() || undefined,
                status: paymentStatus === "ALL" ? undefined : paymentStatus,
                provider: "VNPAY",
                createdFrom: paymentFrom || undefined,
                createdTo: paymentTo || undefined,
            });

            setPaymentRows(response.data);
            setPaymentTotalItems(response.meta.totalItems);
            setPaymentTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách thanh toán");
            }
        } finally {
            setIsLoadingPayments(false);
        }
    }, [paymentFrom, paymentKeyword, paymentPage, paymentStatus, paymentTo]);

    const loadSettlements = useCallback(async () => {
        setIsLoadingSettlements(true);

        try {
            const response = await getAdminSettlements({
                page: settlementPage,
                limit: PAGE_SIZE,
                search: settlementKeyword.trim() || undefined,
                status: settlementStatus === "ALL" ? undefined : settlementStatus,
                settledFrom: settlementFrom || undefined,
                settledTo: settlementTo || undefined,
            });

            setSettlementRows(response.data);
            setSettlementTotalItems(response.meta.totalItems);
            setSettlementTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách đối soát");
            }
        } finally {
            setIsLoadingSettlements(false);
        }
    }, [settlementFrom, settlementKeyword, settlementPage, settlementStatus, settlementTo]);

    useEffect(() => {
        void loadPayments();
    }, [loadPayments]);

    useEffect(() => {
        void loadSettlements();
    }, [loadSettlements]);

    const paymentPageAmount = useMemo(
        () => paymentRows.reduce((sum, payment) => sum + Number(payment.amount), 0),
        [paymentRows],
    );

    const settlementPageAmount = useMemo(
        () => settlementRows.reduce((sum, settlement) => sum + Number(settlement.netAmount), 0),
        [settlementRows],
    );

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <header className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Tổng thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{paymentTotalItems}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Giá trị thanh toán (trang)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">
                            {paymentPageAmount.toLocaleString("vi-VN")}đ
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Tổng đối soát
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">
                            {settlementTotalItems}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Giá trị đối soát ròng (trang)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">
                            {settlementPageAmount.toLocaleString("vi-VN")}đ
                        </p>
                    </CardContent>
                </Card>
            </header>

            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle>Thanh toán và đối soát</CardTitle>
                        <div className="inline-flex rounded-md border border-slate-300 p-1">
                            <button
                                type="button"
                                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                                    activeTab === "PAYMENTS"
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                                onClick={() => setActiveTab("PAYMENTS")}
                            >
                                Thanh toán
                            </button>
                            <button
                                type="button"
                                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                                    activeTab === "SETTLEMENTS"
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                                onClick={() => setActiveTab("SETTLEMENTS")}
                            >
                                Đối soát
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {errorMessage ? (
                        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    {activeTab === "PAYMENTS" ? (
                        <>
                            <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_160px_auto]">
                                <Input
                                    placeholder="Tìm mã giao dịch, khách hàng, đơn hàng..."
                                    value={paymentKeyword}
                                    onChange={(event) => {
                                        setPaymentKeyword(event.target.value);
                                        setPaymentPage(1);
                                    }}
                                />
                                <select
                                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                                    value={paymentStatus}
                                    onChange={(event) => {
                                        setPaymentStatus(event.target.value as PaymentStatusFilter);
                                        setPaymentPage(1);
                                    }}
                                >
                                    <option value="ALL">Trạng thái: Tất cả</option>
                                    <option value="PENDING">Trạng thái: Chờ xử lý</option>
                                    <option value="SUCCESS">Trạng thái: Thành công</option>
                                    <option value="FAILED">Trạng thái: Thất bại</option>
                                    <option value="CANCELLED">Trạng thái: Đã hủy</option>
                                </select>
                                <Input
                                    type="date"
                                    value={paymentFrom}
                                    onChange={(event) => {
                                        setPaymentFrom(event.target.value);
                                        setPaymentPage(1);
                                    }}
                                />
                                <Input
                                    type="date"
                                    value={paymentTo}
                                    onChange={(event) => {
                                        setPaymentTo(event.target.value);
                                        setPaymentPage(1);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void loadPayments()}
                                >
                                    Tải lại
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã giao dịch</TableHead>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Số tiền</TableHead>
                                        <TableHead>Thời điểm thanh toán</TableHead>
                                        <TableHead>Số đơn</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingPayments ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                Đang tải thanh toán...
                                            </TableCell>
                                        </TableRow>
                                    ) : paymentRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                Không có thanh toán phù hợp
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paymentRows.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    <div className="grid gap-0.5">
                                                        <span className="font-medium text-slate-900">
                                                            {payment.txnRef}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {payment.gatewayTransactionNo ?? "-"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-sm text-slate-900">
                                                            {payment.customerName}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {payment.customerEmail}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getPaymentStatusLabel(payment.status)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </TableCell>
                                                <TableCell>{formatDate(payment.paidAt)}</TableCell>
                                                <TableCell>{payment.orderCount}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={paymentPage <= 1 || isLoadingPayments}
                                    onClick={() => setPaymentPage((prev) => Math.max(1, prev - 1))}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-slate-600">
                                    Trang {paymentPage}/{paymentTotalPages}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={paymentPage >= paymentTotalPages || isLoadingPayments}
                                    onClick={() =>
                                        setPaymentPage((prev) =>
                                            Math.min(paymentTotalPages, prev + 1),
                                        )
                                    }
                                >
                                    Sau
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_160px_auto]">
                                <Input
                                    placeholder="Tìm đơn hàng, cửa hàng, người bán..."
                                    value={settlementKeyword}
                                    onChange={(event) => {
                                        setSettlementKeyword(event.target.value);
                                        setSettlementPage(1);
                                    }}
                                />
                                <select
                                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                                    value={settlementStatus}
                                    onChange={(event) => {
                                        setSettlementStatus(
                                            event.target.value as SettlementStatusFilter,
                                        );
                                        setSettlementPage(1);
                                    }}
                                >
                                    <option value="ALL">Trạng thái: Tất cả</option>
                                    <option value="COMPLETED">Trạng thái: Hoàn tất</option>
                                    <option value="REVERSED">Trạng thái: Hoàn tác</option>
                                </select>
                                <Input
                                    type="date"
                                    value={settlementFrom}
                                    onChange={(event) => {
                                        setSettlementFrom(event.target.value);
                                        setSettlementPage(1);
                                    }}
                                />
                                <Input
                                    type="date"
                                    value={settlementTo}
                                    onChange={(event) => {
                                        setSettlementTo(event.target.value);
                                        setSettlementPage(1);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void loadSettlements()}
                                >
                                    Tải lại
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Đơn hàng</TableHead>
                                        <TableHead>Cửa hàng</TableHead>
                                        <TableHead>Người bán</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Ròng</TableHead>
                                        <TableHead>Thời điểm đối soát</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingSettlements ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>Đang tải đối soát...</TableCell>
                                        </TableRow>
                                    ) : settlementRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                Không có bản ghi đối soát
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        settlementRows.map((settlement) => (
                                            <TableRow key={settlement.id}>
                                                <TableCell>{settlement.orderNumber}</TableCell>
                                                <TableCell>{settlement.shopName}</TableCell>
                                                <TableCell>{settlement.sellerName}</TableCell>
                                                <TableCell>
                                                    {getSettlementStatusLabel(settlement.status)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(settlement.netAmount)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(settlement.settledAt)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={settlementPage <= 1 || isLoadingSettlements}
                                    onClick={() =>
                                        setSettlementPage((prev) => Math.max(1, prev - 1))
                                    }
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-slate-600">
                                    Trang {settlementPage}/{settlementTotalPages}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        settlementPage >= settlementTotalPages ||
                                        isLoadingSettlements
                                    }
                                    onClick={() =>
                                        setSettlementPage((prev) =>
                                            Math.min(settlementTotalPages, prev + 1),
                                        )
                                    }
                                >
                                    Sau
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
