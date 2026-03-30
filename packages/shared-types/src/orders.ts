import type { PaginatedResponse, UUID } from "./common.js";
import type { CreateVnpayPaymentUrlResponse } from "./payments.js";

export type OrderStatus =
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export type SettlementStatus = "PENDING" | "SETTLED";

export interface CheckoutOrdersRequest {
    shippingAddressId: UUID;
    cartItemIds: UUID[];
    note?: string;
}

export interface CheckoutOrderItem {
    id: UUID;
    orderId: UUID;
    variantId: UUID;
    productId: UUID;
    productName: string;
    variantSku: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    createdAt: string;
    updatedAt: string;
}

export interface CheckoutOrder {
    id: UUID;
    orderNumber: string;
    userId: UUID;
    shopId: UUID;
    shippingAddressId: UUID;
    status: OrderStatus;
    subtotal: string;
    totalAmount: string;
    note?: string | null;
    items: CheckoutOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CheckoutOrdersResponse {
    orders: CheckoutOrder[];
    totalCheckoutAmount: string;
    payment: CreateVnpayPaymentUrlResponse;
}

export interface SellerOrdersFilterRequest {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

export interface SellerOrderItem {
    id: UUID;
    orderNumber: string;
    userId: UUID;
    shopId: UUID;
    shippingAddressId: UUID;
    status: OrderStatus;
    subtotal: string;
    totalAmount: string;
    note?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    settlementStatus: SettlementStatus;
    settledAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type SellerOrdersListResponse = PaginatedResponse<SellerOrderItem>;
