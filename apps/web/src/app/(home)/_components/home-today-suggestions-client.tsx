"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    mapProductToTodaySuggestionCardItem,
    type TodaySuggestionCardItem,
} from "@/lib/home-today-suggestions";
import { getTodaySuggestionProductsChunk } from "@/services/catalog-service";

const AUTO_LOAD_LIMIT = 100;

type HomeTodaySuggestionsClientProps = {
    initialItems: TodaySuggestionCardItem[];
    initialNextCursor: string | null;
    initialHasMore: boolean;
    sessionKey: string;
    pageSize: number;
};

function HomeTodaySuggestionProductCard({ item }: { item: TodaySuggestionCardItem }) {
    return (
        <article className="group rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-success/40 hover:shadow-md">
            <Link href={item.href} className="block">
                <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                    <div className="relative aspect-square">
                        <Image
                            src={item.imageSrc}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 18vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                    </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>

                <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-base font-bold text-success">{item.displayPrice}</span>
                    <span
                        className={
                            item.availabilityLabel === "Còn hàng"
                                ? "rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                                : "rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                        }
                    >
                        {item.availabilityLabel}
                    </span>
                </div>
            </Link>
        </article>
    );
}

export function HomeTodaySuggestionsClient({
    initialItems,
    initialNextCursor,
    initialHasMore,
    sessionKey,
    pageSize,
}: HomeTodaySuggestionsClientProps) {
    const [items, setItems] = useState(initialItems);
    const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);
    const shouldUseManualLoad = items.length > AUTO_LOAD_LIMIT;

    const handleLoadMore = useCallback(async () => {
        if (isFetchingRef.current || !hasMore || !nextCursor) {
            return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);
        setLoadMoreError(null);

        try {
            const chunk = await getTodaySuggestionProductsChunk({
                sessionKey,
                cursor: nextCursor,
                limit: pageSize,
            });
            const nextItems = chunk.items.map(mapProductToTodaySuggestionCardItem);

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
            setHasMore(chunk.hasMore);
            setNextCursor(chunk.nextCursor);
        } catch {
            setLoadMoreError("Không thể tải thêm sản phẩm. Vui lòng thử lại.");
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, [hasMore, nextCursor, pageSize, sessionKey]);

    useEffect(() => {
        if (shouldUseManualLoad || !hasMore || !nextCursor) {
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
    }, [handleLoadMore, hasMore, nextCursor, shouldUseManualLoad]);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-orange-600">
                        GỢI Ý HÔM NAY
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                        Sản phẩm dành cho bạn hôm nay
                    </h2>
                </div>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:text-success-dark"
                >
                    Xem tất cả
                    <ArrowRightIcon className="size-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {items.map((item) => (
                    <HomeTodaySuggestionProductCard key={item.id} item={item} />
                ))}
            </div>

            {hasMore && nextCursor ? (
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
        </section>
    );
}
