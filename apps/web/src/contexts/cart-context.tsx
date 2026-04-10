"use client";

import type { AddToCartRequest, CartSummary } from "@repo/shared-types";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import {
    addToCart,
    clearCart,
    getMyCart,
    removeCartItem,
    updateCartItem,
} from "@/services/cart-service";
import { isApiRequestError } from "@/services/http-client";

type CartContextValue = {
    cart: CartSummary | null;
    totalItems: number;
    isInitializing: boolean;
    isMutating: boolean;
    refreshCart: () => Promise<CartSummary | null>;
    addItem: (payload: AddToCartRequest) => Promise<CartSummary>;
    updateItemQuantity: (itemId: string, quantity: number) => Promise<CartSummary>;
    removeItem: (itemId: string) => Promise<CartSummary>;
    clearAll: () => Promise<CartSummary | null>;
};

type CartProviderProps = {
    children: ReactNode;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

async function resolveMyCart(): Promise<CartSummary | null> {
    try {
        return await getMyCart();
    } catch (error) {
        if (isApiRequestError(error) && (error.statusCode === 401 || error.statusCode === 403)) {
            return null;
        }

        throw error;
    }
}

export function CartProvider({ children }: CartProviderProps) {
    const { isAuthenticated, isInitializing: isAuthInitializing } = useAuth();
    const [cart, setCart] = useState<CartSummary | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isMutating, setIsMutating] = useState(false);

    useEffect(() => {
        let isActive = true;

        const initializeCartState = async () => {
            if (isAuthInitializing) {
                return;
            }

            if (!isAuthenticated) {
                if (isActive) {
                    setCart(null);
                    setIsInitializing(false);
                }

                return;
            }

            setIsInitializing(true);

            try {
                const currentCart = await resolveMyCart();

                if (isActive) {
                    setCart(currentCart);
                }
            } catch {
                if (isActive) {
                    setCart(null);
                }
            } finally {
                if (isActive) {
                    setIsInitializing(false);
                }
            }
        };

        void initializeCartState();

        return () => {
            isActive = false;
        };
    }, [isAuthenticated, isAuthInitializing]);

    const withMutation = useCallback(async <T,>(callback: () => Promise<T>): Promise<T> => {
        setIsMutating(true);

        try {
            return await callback();
        } finally {
            setIsMutating(false);
        }
    }, []);

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
            return null;
        }

        const currentCart = await resolveMyCart();
        setCart(currentCart);
        return currentCart;
    }, [isAuthenticated]);

    const addItem = useCallback(
        async (payload: AddToCartRequest) =>
            withMutation(async () => {
                const updatedCart = await addToCart(payload);
                setCart(updatedCart);
                return updatedCart;
            }),
        [withMutation],
    );

    const updateItemQuantity = useCallback(
        async (itemId: string, quantity: number) =>
            withMutation(async () => {
                const updatedCart = await updateCartItem(itemId, { quantity });
                setCart(updatedCart);
                return updatedCart;
            }),
        [withMutation],
    );

    const removeItem = useCallback(
        async (itemId: string) =>
            withMutation(async () => {
                const updatedCart = await removeCartItem(itemId);
                setCart(updatedCart);
                return updatedCart;
            }),
        [withMutation],
    );

    const clearAll = useCallback(
        async () =>
            withMutation(async () => {
                await clearCart();
                const refreshedCart = await refreshCart();
                return refreshedCart;
            }),
        [refreshCart, withMutation],
    );

    const value = useMemo<CartContextValue>(
        () => ({
            cart,
            totalItems: cart?.totalItems ?? 0,
            isInitializing,
            isMutating,
            refreshCart,
            addItem,
            updateItemQuantity,
            removeItem,
            clearAll,
        }),
        [
            addItem,
            cart,
            clearAll,
            isInitializing,
            isMutating,
            refreshCart,
            removeItem,
            updateItemQuantity,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}
