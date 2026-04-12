"use client";

import type { CartItem } from "@repo/shared-types";
import { useCallback } from "react";
import { toast } from "sonner";
import { CartEmptyState } from "@/app/cart/_components/cart-empty-state";
import { CartItemsList } from "@/app/cart/_components/cart-items-list";
import { CartLoadingState } from "@/app/cart/_components/cart-loading-state";
import { CartServiceBenefits } from "@/app/cart/_components/cart-service-benefits";
import { CartSummaryCard } from "@/app/cart/_components/cart-summary-card";
import { useCart } from "@/contexts/cart-context";
import { isApiRequestError } from "@/services/http-client";

function toCurrencyAmount(value: string): number {
    const parsedValue = Number.parseFloat(value);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return 0;
    }

    return parsedValue;
}

function formatMoney(value: string): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(toCurrencyAmount(value));
}

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

export default function CartPage() {
    const { cart, isInitializing, isMutating, updateItemQuantity, removeItem, clearAll } =
        useCart();

    const handleDecreaseQuantity = useCallback(
        async (item: CartItem) => {
            if (item.quantity <= 1) {
                return;
            }

            try {
                await updateItemQuantity(item.id, item.quantity - 1);
            } catch (error) {
                toast.error(resolveApiErrorMessage(error, "Không thể cập nhật số lượng."));
            }
        },
        [updateItemQuantity],
    );

    const handleIncreaseQuantity = useCallback(
        async (item: CartItem) => {
            try {
                await updateItemQuantity(item.id, item.quantity + 1);
            } catch (error) {
                toast.error(resolveApiErrorMessage(error, "Không thể cập nhật số lượng."));
            }
        },
        [updateItemQuantity],
    );

    const handleRemoveItem = useCallback(
        async (item: CartItem) => {
            try {
                await removeItem(item.id);
                toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
            } catch (error) {
                toast.error(resolveApiErrorMessage(error, "Không thể xóa sản phẩm."));
            }
        },
        [removeItem],
    );

    const handleClearAll = useCallback(async () => {
        try {
            await clearAll();
            toast.success("Đã xóa toàn bộ giỏ hàng.");
        } catch (error) {
            toast.error(resolveApiErrorMessage(error, "Không thể xóa toàn bộ giỏ hàng."));
        }
    }, [clearAll]);

    if (isInitializing) {
        return (
            <main className="bg-gray-50 py-10 sm:py-14">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <CartLoadingState />
                </div>
            </main>
        );
    }

    const cartData = cart;
    const cartItems = cartData?.items ?? [];

    return (
        <main className="bg-gray-50 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <header className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Giỏ hàng</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {cartItems.length > 0
                                ? `Bạn đang có ${cartItems.length} sản phẩm trong giỏ hàng.`
                                : "Sẵn sàng mua sắm những món đồ yêu thích của bạn."}
                        </p>
                    </div>
                </header>

                {cartItems.length === 0 ? (
                    <CartEmptyState />
                ) : (
                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:items-start">
                        <div>
                            <CartItemsList
                                items={cartItems}
                                isMutating={isMutating}
                                formatMoney={formatMoney}
                                onDecreaseQuantity={handleDecreaseQuantity}
                                onIncreaseQuantity={handleIncreaseQuantity}
                                onRemoveItem={handleRemoveItem}
                            />
                            <CartServiceBenefits />
                        </div>

                        <CartSummaryCard
                            totalItems={cartData?.totalItems ?? 0}
                            subtotal={cartData?.subtotal ?? "0"}
                            isMutating={isMutating}
                            formatMoney={formatMoney}
                            onClearAll={handleClearAll}
                        />
                    </section>
                )}
            </div>
        </main>
    );
}
