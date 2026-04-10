"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeftIcon, CreditCardIcon } from "lucide-react";
import { toast } from "sonner";
import {
    CheckoutShippingForm,
    type CheckoutSubmitPayload,
} from "@/app/checkout/_components/checkout-shipping-form";
import { CheckoutOrderSummary } from "@/app/checkout/_components/checkout-order-summary";
import { CheckoutStepper } from "@/app/checkout/_components/checkout-stepper";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { saveCheckoutSession } from "@/lib/checkout-session";
import { checkoutOrders } from "@/services/order-service";
import { createMyAddress } from "@/services/users-service";
import { isApiRequestError } from "@/services/http-client";

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, isInitializing, isMutating, refreshCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cartItems = useMemo(() => cart?.items ?? [], [cart]);

    const handleSubmit = async (payload: CheckoutSubmitPayload) => {
        if (!cart || cartItems.length === 0) {
            toast.error("Giỏ hàng trống, không thể tạo đơn.");
            return;
        }

        setIsSubmitting(true);

        try {
            const createdAddress = await createMyAddress(payload.address);
            const checkoutResponse = await checkoutOrders({
                shippingAddressId: createdAddress.id,
                cartItemIds: cartItems.map((item) => item.id),
                note: payload.note,
            });

            const paymentInfo = checkoutResponse.payment;

            saveCheckoutSession({
                paymentId: paymentInfo.paymentId,
                txnRef: paymentInfo.txnRef,
                orderIds: paymentInfo.orderIds,
                totalAmount: paymentInfo.totalAmount,
                createdAt: new Date().toISOString(),
            });

            void refreshCart();

            if (!paymentInfo.paymentUrl) {
                toast.error("Không nhận được đường dẫn thanh toán VNPAY.");
                return;
            }

            window.location.assign(paymentInfo.paymentUrl);
        } catch (error) {
            toast.error(resolveApiErrorMessage(error, "Không thể tạo đơn hàng. Vui lòng thử lại."));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInitializing) {
        return (
            <main className="bg-gray-50 py-10 sm:py-14">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <div className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                </div>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="bg-gray-50 py-10 sm:py-14">
                <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Giỏ hàng hiện đang trống
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Hãy thêm sản phẩm trước khi tiến hành thanh toán.
                        </p>
                        <Button asChild className="mt-5">
                            <Link href="/cart">Quay lại giỏ hàng</Link>
                        </Button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-50 py-8 sm:py-10">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 md:px-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                    <ChevronLeftIcon className="size-4" />
                    Quay lại Giỏ hàng
                </button>

                <CheckoutStepper currentStep={1} />

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
                    <div className="space-y-4">
                        <CheckoutShippingForm
                            initialFullName={user?.fullName}
                            initialPhone={user?.phone}
                            initialEmail={user?.email}
                            isSubmitting={isSubmitting || isMutating}
                            onSubmit={handleSubmit}
                        />

                        <div className="inline-flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success-dark">
                            <CreditCardIcon className="size-4" />
                            Chỉ hỗ trợ thanh toán qua VNPAY trong giai đoạn này.
                        </div>
                    </div>

                    <CheckoutOrderSummary
                        items={cartItems}
                        subtotal={cart?.subtotal ?? "0"}
                        isSubmitting={isSubmitting || isMutating}
                    />
                </section>
            </div>
        </main>
    );
}
