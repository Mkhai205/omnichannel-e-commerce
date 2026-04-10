"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, TicketPercentIcon, TruckIcon } from "lucide-react";
import { Button, Input } from "@/components/ui";

type CartSummaryCardProps = {
    totalItems: number;
    subtotal: string;
    isMutating: boolean;
    formatMoney: (value: string) => string;
    onClearAll: () => void;
};

type ShippingMethod = "standard" | "express";

const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; fee: number }> = {
    standard: {
        label: "Giao tiêu chuẩn (2-4 ngày)",
        fee: 0,
    },
    express: {
        label: "Giao hỏa tốc (trong ngày)",
        fee: 30000,
    },
};

const SIMULATED_COUPONS: Record<
    string,
    { type: "fixed" | "percent"; value: number; max?: number }
> = {
    GIAM50K: {
        type: "fixed",
        value: 50000,
    },
    SALE10: {
        type: "percent",
        value: 10,
        max: 100000,
    },
};

function parseMoney(value: string): number {
    const parsed = Number.parseFloat(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return 0;
    }

    return parsed;
}

export function CartSummaryCard({
    totalItems,
    subtotal,
    isMutating,
    formatMoney,
    onClearAll,
}: CartSummaryCardProps) {
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
    const [couponInput, setCouponInput] = useState("");
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    const subtotalAmount = useMemo(() => parseMoney(subtotal), [subtotal]);
    const shippingFeeAmount = SHIPPING_OPTIONS[shippingMethod].fee;

    const discountAmount = useMemo(() => {
        if (!appliedCouponCode) {
            return 0;
        }

        const coupon = SIMULATED_COUPONS[appliedCouponCode];

        if (!coupon) {
            return 0;
        }

        if (coupon.type === "fixed") {
            return Math.min(coupon.value, subtotalAmount);
        }

        const percentDiscount = (subtotalAmount * coupon.value) / 100;

        if (typeof coupon.max === "number") {
            return Math.min(percentDiscount, coupon.max);
        }

        return percentDiscount;
    }, [appliedCouponCode, subtotalAmount]);

    const totalAmount = Math.max(0, subtotalAmount + shippingFeeAmount - discountAmount);

    const handleApplyCoupon = () => {
        const normalizedCode = couponInput.trim().toUpperCase();

        if (!normalizedCode) {
            setCouponError("Vui lòng nhập mã giảm giá.");
            return;
        }

        if (!SIMULATED_COUPONS[normalizedCode]) {
            setAppliedCouponCode(null);
            setCouponError("Mã không hợp lệ. Thử GIAM50K hoặc SALE10.");
            return;
        }

        setAppliedCouponCode(normalizedCode);
        setCouponError(null);
    };

    const handleRemoveCoupon = () => {
        setAppliedCouponCode(null);
        setCouponInput("");
        setCouponError(null);
    };

    return (
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>

            <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                    <span>Số lượng sản phẩm</span>
                    <span className="font-semibold text-gray-900">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center justify-between text-gray-700">
                        <span className="inline-flex items-center gap-2 font-medium">
                            <TruckIcon className="size-4 text-success" />
                            Vận chuyển
                        </span>
                        <span className="font-semibold text-gray-900">
                            {formatMoney(String(shippingFeeAmount))}
                        </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white px-2.5 py-2 text-gray-600">
                            <span>{SHIPPING_OPTIONS.standard.label}</span>
                            <input
                                type="radio"
                                name="shipping-method"
                                className="size-4"
                                checked={shippingMethod === "standard"}
                                onChange={() => setShippingMethod("standard")}
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white px-2.5 py-2 text-gray-600">
                            <span>{SHIPPING_OPTIONS.express.label}</span>
                            <input
                                type="radio"
                                name="shipping-method"
                                className="size-4"
                                checked={shippingMethod === "express"}
                                onChange={() => setShippingMethod("express")}
                            />
                        </label>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="inline-flex items-center gap-2 font-medium text-gray-700">
                        <TicketPercentIcon className="size-4 text-success" />
                        Mã giảm giá
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <Input
                            value={couponInput}
                            onChange={(event) => setCouponInput(event.target.value)}
                            placeholder="Nhập mã ưu đãi..."
                            className="h-9"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9"
                            onClick={handleApplyCoupon}
                        >
                            Áp dụng
                        </Button>
                    </div>

                    {couponError ? (
                        <p className="mt-2 text-xs text-destructive">{couponError}</p>
                    ) : null}

                    {appliedCouponCode ? (
                        <div className="mt-2 flex items-center justify-between rounded-md border border-success/30 bg-success/10 px-2.5 py-2 text-xs text-success-dark">
                            <span>Đã áp dụng mã {appliedCouponCode}</span>
                            <button
                                type="button"
                                className="font-semibold underline"
                                onClick={handleRemoveCoupon}
                            >
                                Gỡ
                            </button>
                        </div>
                    ) : (
                        <p className="mt-2 text-xs text-gray-500">Thử mã: GIAM50K hoặc SALE10</p>
                    )}
                </div>

                <div className="flex items-center justify-between text-gray-600">
                    <span>Giảm giá</span>
                    <span className="font-semibold text-success">
                        -{formatMoney(String(discountAmount))}
                    </span>
                </div>

                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                    <span>Tổng cộng</span>
                    <span>{formatMoney(String(totalAmount))}</span>
                </div>
            </div>

            <Button disabled className="mt-5 w-full bg-success cursor-pointer" size="lg">
                Thanh toán (sắp ra mắt)
            </Button>

            <Button
                type="button"
                variant="outline"
                className="mt-3 w-full cursor-pointer"
                disabled={isMutating || totalItems === 0}
                onClick={onClearAll}
            >
                Xóa toàn bộ giỏ hàng
            </Button>

            <Button asChild variant="ghost" className="mt-2 w-full text-success hover:text-success">
                <Link href="/">
                    Tiếp tục mua sắm
                    <ArrowRightIcon className="size-4" />
                </Link>
            </Button>
        </aside>
    );
}
