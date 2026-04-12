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

export interface AdminPaymentsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: PaymentStatus;
    provider?: PaymentProvider;
    createdFrom?: string;
    createdTo?: string;
}

export interface AdminPaymentListItem {
    id: UUID;
    userId: UUID;
    customerName: string;
    customerEmail: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    txnRef: string;
    gatewayTransactionNo?: string | null;
    amount: string;
    currency: string;
    bankCode?: string | null;
    orderCount: number;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type AdminPaymentsListResponse = PaginatedResponse<AdminPaymentListItem>;

export type SellerSettlementStatus = "COMPLETED" | "REVERSED";

export interface AdminSettlementsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: SellerSettlementStatus;
    settledFrom?: string;
    settledTo?: string;
}

export interface AdminSettlementListItem {
    id: UUID;
    orderId: UUID;
    orderNumber: string;
    shopId: UUID;
    shopName: string;
    sellerName: string;
    sellerWalletId: UUID;
    status: SellerSettlementStatus;
    grossAmount: string;
    commissionAmount: string;
    netAmount: string;
    settledAt: string;
    createdAt: string;
    updatedAt: string;
}

export type AdminSettlementsListResponse = PaginatedResponse<AdminSettlementListItem>;

export interface AdminDashboardTrendPoint {
    label: string;
    orderCount: number;
    gmv: number;
}

export interface AdminDashboardKpiResponse {
    totalUsers: number;
    totalShops: number;
    pendingShops: number;
    totalOrders: number;
    todayOrders: number;
    totalGmv: string;
    paymentSuccessRate: number;
    successfulPayments: number;
    totalPayments: number;
    pendingPayments: number;
    pendingSettlements: number;
    trend: AdminDashboardTrendPoint[];
    generatedAt: string;
}
