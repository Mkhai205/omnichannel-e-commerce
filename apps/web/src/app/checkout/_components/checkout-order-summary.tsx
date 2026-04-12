import type { CartItem } from "@repo/shared-types";
import Image from "next/image";
import { ShieldCheckIcon } from "lucide-react";
import { PRODUCTS_IMAGE_FALLBACK_SRC } from "@/lib/home-today-suggestions";
import { formatVnd, parseMoney } from "@/lib/currency";
import { Button } from "@/components/ui";

type CheckoutOrderSummaryProps = {
    items: CartItem[];
    subtotal: string;
    isSubmitting: boolean;
};

function resolveImageSource(imageUrl?: string | null): string {
    const normalizedImage = imageUrl?.trim();
    return normalizedImage ? normalizedImage : PRODUCTS_IMAGE_FALLBACK_SRC;
}

export function CheckoutOrderSummary({ items, subtotal, isSubmitting }: CheckoutOrderSummaryProps) {
    const subtotalAmount = parseMoney(subtotal);
    const vatAmount = subtotalAmount * 0.1;

    return (
        <aside className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                {items.map((item) => (
                    <article key={item.id} className="flex items-center gap-3">
                        <div className="relative size-14 overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <Image
                                src={resolveImageSource(item.imageUrl)}
                                alt={item.productName}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                                {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                            {formatVnd(item.lineTotal)}
                        </p>
                    </article>
                ))}
            </div>

            <div className="space-y-2 border-y border-gray-100 py-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-gray-900">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-gray-900">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                    <span>Thuế VAT (10%)</span>
                    <span className="font-semibold text-gray-900">
                        {formatVnd(String(vatAmount))}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVnd(subtotal)}</span>
            </div>

            <Button
                form="checkout-shipping-form"
                type="submit"
                size="lg"
                disabled={isSubmitting || items.length === 0}
                className="h-11 w-full bg-success text-success-foreground hover:bg-success-dark"
            >
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
            </Button>

            <div className="flex items-center justify-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs text-success-dark">
                <ShieldCheckIcon className="size-4" />
                <span>Thanh toán an toàn qua VNPAY</span>
            </div>
        </aside>
    );
}
