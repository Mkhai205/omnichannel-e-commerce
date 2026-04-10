import type { ProductItem, ProductVariantItem } from "@repo/shared-types";
import { MinusIcon, PlusIcon, ShieldCheckIcon, StarIcon, TruckIcon, CheckIcon } from "lucide-react";
import { Button, cn } from "@/components/ui";

type VariantOption = {
    name: string;
    values: string[];
};

type ProductPurchasePanelProps = {
    product: ProductItem;
    variantOptions: VariantOption[];
    selectedAttributes: Record<string, string>;
    onSelectAttributeValue: (attributeName: string, value: string) => void;
    selectedVariant?: ProductVariantItem;
    quantity: number;
    maxQuantity: number;
    onQuantityChange: (nextValue: number) => void;
    selectedVariantPrice: string;
    totalStock: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    actionNotice: string | null;
};

export function ProductPurchasePanel({
    product,
    variantOptions,
    selectedAttributes,
    onSelectAttributeValue,
    selectedVariant,
    quantity,
    maxQuantity,
    onQuantityChange,
    selectedVariantPrice,
    totalStock,
    onAddToCart,
    onBuyNow,
    actionNotice,
}: ProductPurchasePanelProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                Sản phẩm chính hãng
            </div>

            <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                    <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                    {product.ratingAverage.toFixed(1)} ({product.ratingCount} đánh giá)
                </span>
                <span className="text-gray-300">|</span>
                <span>{totalStock > 0 ? "Còn hàng" : "Hết hàng"}</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-sky-600">{selectedVariantPrice}</p>

            {product.description ? (
                <p className="mt-4 text-sm leading-6 text-gray-600">{product.description}</p>
            ) : null}

            {variantOptions.length > 0 ? (
                <div className="mt-6 space-y-4">
                    {variantOptions.map((option) => (
                        <div key={option.name}>
                            <p className="text-sm font-semibold text-gray-800">{option.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {option.values.map((value) => {
                                    const isSelected = selectedAttributes[option.name] === value;

                                    return (
                                        <button
                                            key={`${option.name}-${value}`}
                                            type="button"
                                            onClick={() =>
                                                onSelectAttributeValue(option.name, value)
                                            }
                                            className={cn(
                                                "rounded-lg border px-3 py-1.5 text-sm transition",
                                                isSelected
                                                    ? "border-success bg-success/10 font-semibold text-success"
                                                    : "border-gray-200 text-gray-700 hover:border-success/40",
                                            )}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="mt-6">
                <p className="text-sm font-semibold text-gray-800">Số lượng</p>
                <div className="mt-2 flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onQuantityChange(quantity - 1)}
                    >
                        <MinusIcon className="size-3.5" />
                    </Button>
                    <span className="inline-flex min-w-12 justify-center rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold">
                        {quantity}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onQuantityChange(quantity + 1)}
                    >
                        <PlusIcon className="size-3.5" />
                    </Button>
                    <span className="ml-2 text-xs text-gray-500">
                        {selectedVariant
                            ? `${Math.max(selectedVariant.stockQuantity, 0)} sản phẩm có sẵn`
                            : "Chưa có biến thể khả dụng"}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                    type="button"
                    size="lg"
                    onClick={onAddToCart}
                    disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                >
                    Thêm vào giỏ
                </Button>
                <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={onBuyNow}
                    disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                >
                    Mua ngay
                </Button>
            </div>

            {actionNotice ? (
                <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    {actionNotice}
                </p>
            ) : null}

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center text-xs text-gray-600">
                <div className="inline-flex flex-col items-center gap-1">
                    <ShieldCheckIcon className="size-4 text-sky-600" />
                    Bảo hành 12 tháng
                </div>
                <div className="inline-flex flex-col items-center gap-1">
                    <TruckIcon className="size-4 text-sky-600" />
                    Giao nhanh 2h
                </div>
                <div className="inline-flex flex-col items-center gap-1">
                    <CheckIcon className="size-4 text-sky-600" />
                    Đổi trả 7 ngày
                </div>
            </div>
        </div>
    );
}
