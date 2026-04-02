import type { PaginatedResponse, UUID } from "./common.js";
import type { OrderStatus, SettlementStatus } from "./orders.js";

export type PaymentProvider = "VNPAY";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface CreateVnpayPaymentUrlRequest {
    orderIds: UUID[];
    bankCode?: string;
    locale?: "vn" | "en";
}

export interface CreateVnpayPaymentUrlResponse {
    paymentId: UUID;
    txnRef: string;
    orderIds: UUID[];
    totalAmount: string;
    paymentUrl: string;
    status: PaymentStatus;
    expiresAt?: string | null;
    createdAt: string;
}

export interface PaymentStatusByOrderResponse {
    orderId: UUID;
    orderStatus: OrderStatus;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    settlementStatus?: SettlementStatus;
    settledAt?: string | null;
    paymentId?: UUID;
    paymentStatus?: PaymentStatus;
    paymentProvider?: PaymentProvider;
    txnRef?: string;
    totalAmount?: string;
    paidAt?: string | null;
    updatedAt: string;
}

export interface VnpayReturnQuery {
    vnp_TxnRef?: string;
    vnp_Amount?: string;
    vnp_ResponseCode?: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
    vnp_PayDate?: string;
    vnp_OrderInfo?: string;
    vnp_SecureHash?: string;
    vnp_SecureHashType?: string;
}

export interface VnpayReturnResponse {
    txnRef?: string;
    isVerified: boolean;
    isSuccess: boolean;
    responseCode?: string;
    message: string;
}

export interface VnpayIpnResponse {
    RspCode: string;
    Message: string;
}

export type SellerPaymentTransactionStatus = "PENDING" | "SETTLED";

export type SellerPaymentFilterStatus = "all" | "settled" | "pending" | "mismatch";

export interface SellerPaymentsFilterRequest {
    page?: number;
    limit?: number;
    status?: SellerPaymentFilterStatus;
}

export interface SellerWalletSummaryResponse {
    id: UUID;
    shopId: UUID;
    availableBalance: string;
    pendingBalance: string;
    totalCredited: string;
    createdAt: string;
    updatedAt: string;
}

export interface SellerPaymentTransactionItem {
    id: UUID;
    orderId: UUID;
    orderNumber: string;
    transactionType: string;
    amount: string;
    platformFee?: string | null;
    status: SellerPaymentTransactionStatus;
    warningLabel?: string | null;
    occurredAt: string;
}

export type SellerPaymentsTransactionsResponse = PaginatedResponse<SellerPaymentTransactionItem>;

export interface SellerPaymentCashflowPoint {
    label: string;
    revenue: number;
    platformFee: number;
    profit: number;
    emphasize?: boolean;
}

export interface SellerPaymentsOverviewResponse {
    totalRevenue: string;
    trendPercent: number;
    trendLabel: string;
    discrepancyAmount: string;
    discrepancyCount: number;
    cashflow: SellerPaymentCashflowPoint[];
}
