"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    SellerPaymentFilterStatus,
    SellerPaymentsOverviewResponse,
    SellerPaymentsTransactionsResponse,
    SellerWalletSummaryResponse,
} from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import {
    getSellerPaymentsOverview,
    getSellerPaymentsTransactions,
    getSellerWalletSummary,
} from "@/services/payments-service";
import { PaymentsBottomInsights } from "./_components/payments-bottom-insights";
import { PaymentsCashflowPanel } from "./_components/payments-cashflow-panel";
import { PaymentsHeader } from "./_components/payments-header";
import { PaymentsSummaryCard } from "./_components/payments-summary-card";
import { PaymentsTransactionTable } from "./_components/payments-transaction-table";
import { PaymentsWarningCard } from "./_components/payments-warning-card";
import type {
    CashflowLegendItem,
    PaymentDiscrepancyWarning,
    PaymentHeaderAction,
    PaymentMonthlyReport,
    PaymentSmartTip,
    PaymentStatusFilterOption,
    PaymentStatusFilterValue,
    PaymentSummaryMetric,
    PaymentTransactionRow,
} from "./types";

const paymentHeaderActions: PaymentHeaderAction[] = [
    {
        id: "export-pdf",
        label: "Xuất PDF",
        style: "outline",
    },
    {
        id: "export-excel",
        label: "Tải Excel (.xlsx)",
        style: "primary",
    },
];

const cashflowLegend: CashflowLegendItem[] = [
    {
        id: "revenue",
        label: "DOANH THU",
        dotClassName: "bg-blue-500",
    },
    {
        id: "platform-fee",
        label: "PHÍ SÀN",
        dotClassName: "bg-amber-400",
    },
    {
        id: "profit",
        label: "LỢI NHUẬN",
        dotClassName: "bg-emerald-500",
    },
];

const paymentStatusFilterOptions: PaymentStatusFilterOption[] = [
    { value: "all", label: "Tất cả" },
    { value: "settled", label: "Đã về ví" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "mismatch", label: "Có cảnh báo lệch" },
];

const paymentSmartTip: PaymentSmartTip = {
    title: "MẸO ĐỐI SOÁT THÔNG MINH",
    heading: "Sử dụng tính năng",
    highlightedText: '"Đối soát tự động"',
    description:
        "để Merchant Ledger tự động so sánh cân nặng kiện hàng tại kho với dữ liệu vận chuyển từ sàn.",
    linkLabel: "TÌM HIỂU THÊM",
};

const paymentMonthlyReport: PaymentMonthlyReport = {
    heading: "Báo cáo doanh thu tháng",
    description: "Phân tích sâu lợi nhuận ròng sau khi trừ chi phí vận hành và quảng cáo.",
    ctaLabel: "SẮP CÓ",
};

const defaultOverview: SellerPaymentsOverviewResponse = {
    totalRevenue: "0.00",
    trendPercent: 0,
    trendLabel: "so với kỳ trước",
    discrepancyAmount: "0.00",
    discrepancyCount: 0,
    cashflow: [],
};

function mapStatusToApiFilter(value: PaymentStatusFilterValue): SellerPaymentFilterStatus {
    return value;
}

function toNumber(value: string | null | undefined): number {
    if (!value) {
        return 0;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return 0;
    }

    return amount;
}

function formatDateLabel(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
    }).format(date);
}

function formatTimeLabel(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        timeStyle: "medium",
    }).format(date);
}

export default function PaymentsPage() {
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatusFilterValue>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsResponse, setTransactionsResponse] =
        useState<SellerPaymentsTransactionsResponse | null>(null);
    const [overview, setOverview] = useState<SellerPaymentsOverviewResponse>(defaultOverview);
    const [wallet, setWallet] = useState<SellerWalletSummaryResponse | null>(null);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const pageSize = 3;

    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            setIsLoadingTransactions(true);

            try {
                const response = await getSellerPaymentsTransactions({
                    page: currentPage,
                    limit: pageSize,
                    status: mapStatusToApiFilter(selectedStatus),
                });

                if (!isMounted) {
                    return;
                }

                setTransactionsResponse(response);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải giao dịch đối soát. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingTransactions(false);
                }
            }
        };

        void fetchTransactions();

        return () => {
            isMounted = false;
        };
    }, [currentPage, selectedStatus]);

    useEffect(() => {
        let isMounted = true;

        const fetchOverview = async () => {
            setIsLoadingOverview(true);

            try {
                const [overviewResponse, walletResponse] = await Promise.all([
                    getSellerPaymentsOverview(),
                    getSellerWalletSummary(),
                ]);

                if (!isMounted) {
                    return;
                }

                setOverview(overviewResponse);
                setWallet(walletResponse);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải tổng quan tài chính. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingOverview(false);
                }
            }
        };

        void fetchOverview();

        return () => {
            isMounted = false;
        };
    }, []);

    const transactionRows = useMemo<PaymentTransactionRow[]>(() => {
        return (transactionsResponse?.data ?? []).map((item) => {
            const status = item.status === "SETTLED" ? "Đã về ví" : "Chờ xử lý";
            const warningLabel = item.warningLabel ?? "—";

            return {
                id: item.id,
                orderCode: item.orderNumber,
                channelCode: "OM",
                channelName: "Omnichannel",
                channelTag: "OMNICHANNEL",
                dateLabel: formatDateLabel(item.occurredAt),
                timeLabel: formatTimeLabel(item.occurredAt),
                transactionType: item.transactionType,
                amountVnd: Math.round(toNumber(item.amount)),
                platformFeeVnd: item.platformFee
                    ? Math.round(-Math.abs(toNumber(item.platformFee)))
                    : undefined,
                status,
                warningLabel,
                actionLabel: warningLabel === "—" ? "CHI TIẾT" : "ĐỐI SOÁT",
                actionTone: warningLabel === "—" ? "info" : "primary",
            };
        });
    }, [transactionsResponse?.data]);

    const paymentSummaryMetric = useMemo<PaymentSummaryMetric>(() => {
        const walletRevenue = toNumber(wallet?.totalCredited);
        const overviewRevenue = toNumber(overview.totalRevenue);
        const resolvedRevenue = overviewRevenue > 0 ? overviewRevenue : walletRevenue;

        return {
            title: "TỔNG DOANH THU",
            totalRevenueBillions: resolvedRevenue / 1_000_000_000,
            trendPercent: overview.trendPercent,
            trendLabel: overview.trendLabel,
        };
    }, [overview.totalRevenue, overview.trendLabel, overview.trendPercent, wallet?.totalCredited]);

    const paymentDiscrepancyWarning = useMemo<PaymentDiscrepancyWarning>(() => {
        const discrepancyAmount = Math.round(toNumber(overview.discrepancyAmount));

        return {
            title: "CẢNH BÁO CHÊNH LỆCH",
            amountVnd: discrepancyAmount,
            description:
                overview.discrepancyCount > 0
                    ? `Phát hiện ${overview.discrepancyCount} giao dịch có dấu hiệu chênh lệch cần đối soát.`
                    : "Hiện chưa phát hiện giao dịch chênh lệch. Hệ thống sẽ tiếp tục theo dõi tự động.",
            ctaLabel: "SẮP CÓ",
        };
    }, [overview.discrepancyAmount, overview.discrepancyCount]);

    const cashflowPoints = useMemo(() => {
        return overview.cashflow.length > 0
            ? overview.cashflow
            : [
                  { label: "N-4", revenue: 0, platformFee: 0, profit: 0 },
                  { label: "N-3", revenue: 0, platformFee: 0, profit: 0 },
                  { label: "N-2", revenue: 0, platformFee: 0, profit: 0 },
                  { label: "N-1", revenue: 0, platformFee: 0, profit: 0 },
                  { label: "HÔM NAY", revenue: 0, platformFee: 0, profit: 0, emphasize: true },
              ];
    }, [overview.cashflow]);

    const totalPages = Math.max(1, transactionsResponse?.meta.totalPages ?? 1);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    const handleNoopAction = () => undefined;

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-5 pb-14">
            <PaymentsHeader actions={paymentHeaderActions} onActionClick={handleNoopAction} />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
                <PaymentsCashflowPanel legend={cashflowLegend} points={cashflowPoints} />

                <div className="grid gap-5">
                    <PaymentsSummaryCard metric={paymentSummaryMetric} />
                    <PaymentsWarningCard warning={paymentDiscrepancyWarning} />
                </div>
            </section>

            <PaymentsTransactionTable
                rows={transactionRows}
                statusOptions={paymentStatusFilterOptions}
                selectedStatus={selectedStatus}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={transactionsResponse?.meta.totalItems ?? 0}
                filteredRecords={transactionsResponse?.meta.totalItems ?? 0}
                isLoading={isLoadingTransactions || isLoadingOverview}
                onStatusChange={(value) => {
                    setSelectedStatus(value);
                    setCurrentPage(1);
                }}
                onFilterClick={handleNoopAction}
                onPageChange={setCurrentPage}
            />

            <PaymentsBottomInsights
                smartTip={paymentSmartTip}
                monthlyReport={paymentMonthlyReport}
                onReportClick={handleNoopAction}
                onFloatingActionClick={handleNoopAction}
            />
        </section>
    );
}
