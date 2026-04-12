const CHECKOUT_SESSION_STORAGE_KEY = "web.checkout.vnpay.session";

export type CheckoutSessionSnapshot = {
    paymentId: string;
    txnRef: string;
    orderIds: string[];
    totalAmount: string;
    createdAt: string;
};

function canUseSessionStorage(): boolean {
    return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

export function saveCheckoutSession(session: CheckoutSessionSnapshot): void {
    if (!canUseSessionStorage()) {
        return;
    }

    window.sessionStorage.setItem(CHECKOUT_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function readCheckoutSession(): CheckoutSessionSnapshot | null {
    if (!canUseSessionStorage()) {
        return null;
    }

    const rawSession = window.sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        const parsedSession = JSON.parse(rawSession) as Partial<CheckoutSessionSnapshot>;

        if (
            typeof parsedSession.paymentId !== "string" ||
            typeof parsedSession.txnRef !== "string" ||
            !Array.isArray(parsedSession.orderIds) ||
            typeof parsedSession.totalAmount !== "string" ||
            typeof parsedSession.createdAt !== "string"
        ) {
            return null;
        }

        return {
            paymentId: parsedSession.paymentId,
            txnRef: parsedSession.txnRef,
            orderIds: parsedSession.orderIds,
            totalAmount: parsedSession.totalAmount,
            createdAt: parsedSession.createdAt,
        };
    } catch {
        return null;
    }
}

export function clearCheckoutSession(): void {
    if (!canUseSessionStorage()) {
        return;
    }

    window.sessionStorage.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
}
