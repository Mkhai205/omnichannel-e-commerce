"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductItem, ProductReviewListItem } from "@repo/shared-types";
import Image from "next/image";
import {
    CheckIcon,
    Loader2Icon,
    MinusIcon,
    PlusIcon,
    ShieldCheckIcon,
    StarIcon,
    TruckIcon,
} from "lucide-react";
import { Button, cn } from "@/components/ui";
import {
    buildVariantAttributeOptions,
    findMatchingVariant,
    formatVndPrice,
    resolveLowestVariantPrice,
    resolveProductGalleryImages,
    resolveTotalStock,
} from "@/lib/product-detail";
import { PRODUCTS_IMAGE_FALLBACK_SRC } from "@/lib/home-today-suggestions";
import { getCatalogProductReviews } from "@/services/catalog-service";

type ProductDetailClientProps = {
    product: ProductItem;
    initialReviews: ProductReviewListItem[];
    initialReviewMeta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
};

function formatReviewDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Vừa xong";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function ReviewStars({ rating }: { rating: number }) {
    return (
        <div className="inline-flex items-center gap-0.5 text-amber-400" aria-hidden>
            {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                    key={`review-star-${index}`}
                    className={cn("size-3.5", index < rating ? "fill-current" : "text-gray-300")}
                />
            ))}
        </div>
    );
}

export function ProductDetailClient({
    product,
    initialReviews,
    initialReviewMeta,
}: ProductDetailClientProps) {
    const galleryImages = useMemo(() => resolveProductGalleryImages(product), [product]);
    const variantOptions = useMemo(
        () => buildVariantAttributeOptions(product.variants),
        [product.variants],
    );

    const [selectedImage, setSelectedImage] = useState<string>(
        galleryImages[0] ?? PRODUCTS_IMAGE_FALLBACK_SRC,
    );
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
        const fallbackVariant = product.variants[0];

        return Object.fromEntries(
            variantOptions.map((option) => {
                const preferredValue = fallbackVariant?.attributes[option.name] ?? option.values[0];
                const normalizedValue = preferredValue ?? "";

                return [option.name, normalizedValue];
            }),
        );
    });

    const selectedVariant = useMemo(
        () => findMatchingVariant(product.variants, selectedAttributes),
        [product.variants, selectedAttributes],
    );

    const [quantity, setQuantity] = useState(1);
    const [actionNotice, setActionNotice] = useState<string | null>(null);
    const [reviews, setReviews] = useState(initialReviews);
    const [reviewPage, setReviewPage] = useState(initialReviewMeta.page);
    const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useState(false);
    const [reviewsLoadError, setReviewsLoadError] = useState<string | null>(null);

    const maxQuantity = Math.max(selectedVariant?.stockQuantity ?? 0, 1);
    const canLoadMoreReviews =
        reviews.length < initialReviewMeta.totalItems &&
        reviewPage < Math.max(initialReviewMeta.totalPages, 1);

    useEffect(() => {
        if (!selectedVariant?.imageUrl) {
            return;
        }

        setSelectedImage(selectedVariant.imageUrl);
    }, [selectedVariant?.imageUrl]);

    useEffect(() => {
        if (quantity <= maxQuantity) {
            return;
        }

        setQuantity(maxQuantity);
    }, [maxQuantity, quantity]);

    const handleSelectAttributeValue = useCallback((attributeName: string, value: string) => {
        setSelectedAttributes((previous) => ({
            ...previous,
            [attributeName]: value,
        }));
    }, []);

    const handleQuantityChange = useCallback(
        (nextValue: number) => {
            const normalizedValue = Math.max(1, Math.min(nextValue, maxQuantity));
            setQuantity(normalizedValue);
        },
        [maxQuantity],
    );

    const handleAddToCart = useCallback(() => {
        if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
            setActionNotice("Biến thể đã hết hàng. Vui lòng chọn biến thể khác.");
            return;
        }

        setActionNotice(`Đã thêm ${quantity} sản phẩm vào giỏ (UI demo).`);
    }, [quantity, selectedVariant]);

    const handleBuyNow = useCallback(() => {
        if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
            setActionNotice("Biến thể đã hết hàng. Vui lòng chọn biến thể khác.");
            return;
        }

        setActionNotice("Đang chuyển sang bước thanh toán (UI demo).");
    }, [selectedVariant]);

    const handleLoadMoreReviews = useCallback(async () => {
        if (isLoadingMoreReviews || !canLoadMoreReviews) {
            return;
        }

        setIsLoadingMoreReviews(true);
        setReviewsLoadError(null);

        try {
            const nextPage = reviewPage + 1;
            const response = await getCatalogProductReviews(product.id, {
                page: nextPage,
                limit: initialReviewMeta.limit,
            });

            setReviews((previousReviews) => {
                const existingIds = new Set(previousReviews.map((review) => review.id));
                const mergedReviews = [...previousReviews];

                for (const review of response.data) {
                    if (existingIds.has(review.id)) {
                        continue;
                    }

                    existingIds.add(review.id);
                    mergedReviews.push(review);
                }

                return mergedReviews;
            });
            setReviewPage(nextPage);
        } catch {
            setReviewsLoadError("Không thể tải thêm đánh giá. Vui lòng thử lại.");
        } finally {
            setIsLoadingMoreReviews(false);
        }
    }, [canLoadMoreReviews, initialReviewMeta.limit, isLoadingMoreReviews, product.id, reviewPage]);

    const totalStock = resolveTotalStock(product.variants);
    const fallbackPrice = formatVndPrice(resolveLowestVariantPrice(product.variants));
    const selectedVariantPrice = selectedVariant
        ? formatVndPrice(Number.parseFloat(selectedVariant.price))
        : fallbackPrice;

    return (
        <div className="space-y-10">
            <section className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <div>
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="relative aspect-square">
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 48vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {galleryImages.map((imageSrc) => {
                            const isSelected = imageSrc === selectedImage;

                            return (
                                <button
                                    key={imageSrc}
                                    type="button"
                                    onClick={() => setSelectedImage(imageSrc)}
                                    className={cn(
                                        "relative overflow-hidden rounded-xl border transition",
                                        isSelected
                                            ? "border-success ring-2 ring-success/25"
                                            : "border-gray-200 hover:border-success/50",
                                    )}
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={imageSrc}
                                            alt={product.name}
                                            fill
                                            sizes="120px"
                                            className="object-cover"
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        Sản phẩm chính hãng
                    </div>

                    <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                        {product.name}
                    </h1>

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
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            {product.description}
                        </p>
                    ) : null}

                    {variantOptions.length > 0 ? (
                        <div className="mt-6 space-y-4">
                            {variantOptions.map((option) => (
                                <div key={option.name}>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {option.name}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {option.values.map((value) => {
                                            const isSelected =
                                                selectedAttributes[option.name] === value;

                                            return (
                                                <button
                                                    key={`${option.name}-${value}`}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectAttributeValue(
                                                            option.name,
                                                            value,
                                                        )
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
                                onClick={() => handleQuantityChange(quantity - 1)}
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
                                onClick={() => handleQuantityChange(quantity + 1)}
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
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                        >
                            Thêm vào giỏ
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            onClick={handleBuyNow}
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
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {product.ratingAverage.toFixed(1)} / 5 từ {product.ratingCount} lượt
                            đánh giá
                        </p>
                    </div>
                    <span className="text-sm text-gray-500">
                        Hiển thị {reviews.length}/{initialReviewMeta.totalItems}
                    </span>
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <article
                                key={review.id}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {review.reviewerName}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {formatReviewDate(review.createdAt)}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <ReviewStars rating={review.rating} />
                                </div>
                                {review.comment ? (
                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                        {review.comment}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Người dùng không để lại bình luận.
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-600">
                        Sản phẩm này chưa có đánh giá nào.
                    </p>
                )}

                {canLoadMoreReviews ? (
                    <div className="mt-5 flex items-center justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                void handleLoadMoreReviews();
                            }}
                            disabled={isLoadingMoreReviews}
                        >
                            {isLoadingMoreReviews ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Đang tải thêm đánh giá...
                                </>
                            ) : (
                                "Xem thêm đánh giá"
                            )}
                        </Button>
                    </div>
                ) : null}

                {reviewsLoadError ? (
                    <p className="mt-3 text-center text-sm text-red-600">{reviewsLoadError}</p>
                ) : null}
            </section>
        </div>
    );
}
