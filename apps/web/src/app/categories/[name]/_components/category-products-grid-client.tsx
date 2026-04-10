"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductItem } from "@repo/shared-types";
import Image from "next/image";
import { Loader2Icon, StarIcon } from "lucide-react";
import { Button, cn } from "@/components/ui";
import { mapProductToTodaySuggestionCardItem } from "@/lib/home-today-suggestions";
import { getCatalogProducts } from "@/services/catalog-service";

const AUTO_LOAD_LIMIT = 100;

type CategoryProductsGridClientProps = {
    initialItems: ProductItem[];
    totalItems: number;
    pageSize: number;
    categoryId: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: number;
};

function CategoryProductCard({ product }: { product: ProductItem }) {
    const cardItem = mapProductToTodaySuggestionCardItem(product);
    const roundedStars = Math.round(cardItem.ratingAverage);

    return (
        <article className="group rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-success/40 hover:shadow-md">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                <div className="relative aspect-square">
                    <Image
                        src={cardItem.imageSrc}
                        alt={cardItem.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">{cardItem.name}</p>

            <div className="mt-1.5 flex items-center gap-2">
                <div className="inline-flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                            key={`${cardItem.id}-star-${index}`}
                            className={cn(
                                "size-3.5",
                                index < roundedStars
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300",
                            )}
                        />
                    ))}
                </div>
                {cardItem.ratingCount > 0 ? (
                    <span className="text-xs font-medium text-gray-600">
                        {cardItem.ratingAverage.toFixed(1)} ({cardItem.ratingCount})
                    </span>
                ) : (
                    <span className="text-xs text-gray-500">Chưa có đánh giá</span>
                )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-base font-bold text-success">{cardItem.displayPrice}</span>
                <span
                    className={
                        cardItem.availabilityLabel === "Còn hàng"
                            ? "rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                            : "rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                    }
                >
                    {cardItem.availabilityLabel}
                </span>
            </div>
        </article>
    );
}

export function CategoryProductsGridClient({
    initialItems,
    totalItems,
    pageSize,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
}: CategoryProductsGridClientProps) {
    const [items, setItems] = useState(initialItems);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    const hasMore = items.length < totalItems;
    const shouldUseManualLoad = items.length > AUTO_LOAD_LIMIT;

    const handleLoadMore = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) {
            return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);
        setLoadMoreError(null);

        try {
            const nextPage = currentPage + 1;
            const response = await getCatalogProducts({
                page: nextPage,
                limit: pageSize,
                categoryId,
                minPrice,
                maxPrice,
                minRating,
            });
            const nextItems = response.data;

            setItems((previousItems) => {
                const existedIds = new Set(previousItems.map((item) => item.id));
                const mergedItems = [...previousItems];

                for (const item of nextItems) {
                    if (existedIds.has(item.id)) {
                        continue;
                    }

                    existedIds.add(item.id);
                    mergedItems.push(item);
                }

                return mergedItems;
            });
            setCurrentPage(nextPage);
        } catch {
            setLoadMoreError("Không thể tải thêm sản phẩm. Vui lòng thử lại.");
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, [categoryId, currentPage, hasMore, maxPrice, minPrice, minRating, pageSize]);

    useEffect(() => {
        if (shouldUseManualLoad || !hasMore) {
            return;
        }

        const triggerNode = loadMoreTriggerRef.current;

        if (!triggerNode) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const shouldLoad = entries.some((entry) => entry.isIntersecting);

                if (shouldLoad) {
                    void handleLoadMore();
                }
            },
            {
                root: null,
                rootMargin: "220px 0px",
                threshold: 0.1,
            },
        );

        observer.observe(triggerNode);

        return () => {
            observer.disconnect();
        };
    }, [handleLoadMore, hasMore, shouldUseManualLoad]);

    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-5 text-sm text-gray-600">
                Đang hiển thị <strong>{items.length}</strong> trên <strong>{totalItems}</strong> sản
                phẩm
            </div>

            {hasMore ? (
                shouldUseManualLoad ? (
                    <div className="mt-6 flex items-center justify-center">
                        <Button
                            type="button"
                            size="lg"
                            onClick={() => {
                                void handleLoadMore();
                            }}
                            disabled={isLoading}
                            className="min-w-40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Đang tải thêm sản phẩm...
                                </>
                            ) : (
                                "Xem thêm sản phẩm"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div
                        ref={loadMoreTriggerRef}
                        className="mt-6 flex items-center justify-center py-3 text-sm text-gray-500"
                        aria-live="polite"
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span className="ml-2">Đang tải thêm sản phẩm...</span>
                            </>
                        ) : (
                            <span>Cuộn xuống để tải thêm sản phẩm</span>
                        )}
                    </div>
                )
            ) : null}

            {loadMoreError ? (
                <p className="mt-3 text-center text-sm text-red-600">{loadMoreError}</p>
            ) : null}
        </>
    );
}
