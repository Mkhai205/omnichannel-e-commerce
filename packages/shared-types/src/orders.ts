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
    imageKey?: string | null;
    imageUrl?: string | null;
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
    search?: string;
    placedFrom?: string;
    placedTo?: string;
    status?: OrderStatus;
}

export interface CustomerOrdersFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
}

export interface AdminOrdersFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    placedFrom?: string;
    placedTo?: string;
    status?: OrderStatus;
    settlementStatus?: SettlementStatus;
}

export interface CustomerOrderListItem {
    id: UUID;
    orderNumber: string;
    userId: UUID;
    shopId: UUID;
    shippingAddressId: UUID;
    status: OrderStatus;
    subtotal: string;
    totalAmount: string;
    note?: string | null;
    itemCount: number;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type CustomerOrderListResponse = PaginatedResponse<CustomerOrderListItem>;

export type OrderTrackingEventType =
    | "ORDER_CREATED"
    | "PAYMENT_CONFIRMED"
    | "ORDER_PROCESSING"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "ORDER_CANCELLED";

export interface OrderTrackingEvent {
    eventType: OrderTrackingEventType;
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
}

export interface CustomerOrderPaymentInfo {
    paymentId?: UUID;
    paymentProvider?: string;
    paymentStatus?: string;
    txnRef?: string;
    paidAt?: string | null;
    updatedAt?: string;
}

export interface CustomerOrderShippingAddressInfo {
    id: UUID;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    wardDistrict?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface CustomerOrderDetailResponse extends CustomerOrderListItem {
    shopName: string;
    shippingAddress: CustomerOrderShippingAddressInfo;
    items: SellerOrderDetailItem[];
    payment: CustomerOrderPaymentInfo;
    trackingTimeline: OrderTrackingEvent[];
}

export interface SellerOrderItem {
    id: UUID;
    orderNumber: string;
    customerName: string;
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

export interface SellerOrderDetailItem {
    id: UUID;
    orderId: UUID;
    variantId: UUID;
    productId: UUID;
    productName: string;
    variantSku: string;
    imageKey?: string | null;
    imageUrl?: string | null;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    createdAt: string;
    updatedAt: string;
}

export interface SellerOrderCustomerInfo {
    name: string;
    phone: string | null;
    email: string;
}

export interface SellerOrderShippingAddressInfo {
    id: UUID;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    wardDistrict?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface SellerOrderDetailResponse extends SellerOrderItem {
    customer: SellerOrderCustomerInfo;
    shippingAddress: SellerOrderShippingAddressInfo;
    items: SellerOrderDetailItem[];
}

export interface AdminOrderListItem {
    id: UUID;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shopName: string;
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

export type AdminOrderDetailResponse = SellerOrderDetailResponse;

export type AdminOrdersListResponse = PaginatedResponse<AdminOrderListItem>;

export type SellerOrdersListResponse = PaginatedResponse<SellerOrderItem>;
