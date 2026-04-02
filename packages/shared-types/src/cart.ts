import type { UUID } from "./common.js";

export interface AddToCartRequest {
    variantId: UUID;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface CartItem {
    id: UUID;
    cartId: UUID;
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

export interface CartSummary {
    cartId: UUID;
    userId: UUID;
    totalItems: number;
    subtotal: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}
