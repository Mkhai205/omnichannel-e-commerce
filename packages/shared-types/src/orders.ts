import type { UUID } from "./common.js";
import type { CreateVnpayPaymentUrlResponse } from "./payments.js";

export type OrderStatus =
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

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
