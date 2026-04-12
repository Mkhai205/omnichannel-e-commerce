import type { CartItem } from "@repo/shared-types";
import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { PRODUCTS_IMAGE_FALLBACK_SRC } from "@/lib/home-today-suggestions";
import { Button } from "@/components/ui";

type CartItemsListProps = {
    items: CartItem[];
    isMutating: boolean;
    formatMoney: (value: string) => string;
    onDecreaseQuantity: (item: CartItem) => void;
    onIncreaseQuantity: (item: CartItem) => void;
    onRemoveItem: (item: CartItem) => void;
};

function resolveImageSource(imageUrl?: string | null): string {
    const normalizedImage = imageUrl?.trim();
    return normalizedImage ? normalizedImage : PRODUCTS_IMAGE_FALLBACK_SRC;
}

export function CartItemsList({
    items,
    isMutating,
    formatMoney,
    onDecreaseQuantity,
    onIncreaseQuantity,
    onRemoveItem,
}: CartItemsListProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <article
                    key={item.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={`/product/${item.productId}`}
                            className="relative h-24 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24"
                        >
                            <Image
                                src={resolveImageSource(item.imageUrl)}
                                alt={item.productName}
                                fill
                                sizes="(max-width: 640px) 100vw, 96px"
                                className="object-cover"
                            />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                            <div>
                                <Link
                                    href={`/product/${item.productId}`}
                                    className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-success"
                                >
                                    {item.productName}
                                </Link>
                                <p className="mt-1 text-xs text-gray-500">SKU: {item.variantSku}</p>
                                <p className="mt-2 text-sm font-semibold text-success">
                                    {formatMoney(item.unitPrice)}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        disabled={isMutating || item.quantity <= 1}
                                        onClick={() => onDecreaseQuantity(item)}
                                    >
                                        <MinusIcon className="size-3.5" />
                                    </Button>
                                    <span className="inline-flex min-w-10 justify-center rounded-md border border-gray-200 px-2 py-1 text-sm font-semibold text-gray-900">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        disabled={isMutating}
                                        onClick={() => onIncreaseQuantity(item)}
                                    >
                                        <PlusIcon className="size-3.5" />
                                    </Button>
                                </div>

                                <div className="inline-flex items-center gap-3">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatMoney(item.lineTotal)}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-gray-500 hover:text-destructive"
                                        disabled={isMutating}
                                        onClick={() => onRemoveItem(item)}
                                    >
                                        <Trash2Icon className="size-4" />
                                        <span className="ml-1">Xóa</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
