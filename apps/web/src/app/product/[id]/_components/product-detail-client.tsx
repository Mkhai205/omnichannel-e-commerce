"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductItem, ProductReviewListItem, PublicShopDetailItem } from "@repo/shared-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    buildVariantAttributeOptions,
    findMatchingVariant,
    formatVndPrice,
    resolveLowestVariantPrice,
    resolveProductGalleryImages,
    resolveTotalStock,
} from "@/lib/product-detail";
import { PRODUCTS_IMAGE_FALLBACK_SRC } from "@/lib/home-today-suggestions";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { getCatalogProductReviews } from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { ProductReviewsSection } from "./product-reviews-section";
import { ProductShopSummary } from "./product-shop-summary";

type ProductDetailClientProps = {
    product: ProductItem;
    shop: PublicShopDetailItem;
    initialReviews: ProductReviewListItem[];
    initialReviewMeta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
};

export function ProductDetailClient({
    product,
    shop,
    initialReviews,
    initialReviewMeta,
}: ProductDetailClientProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
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

    const redirectToLogin = useCallback(() => {
        const nextPath = `/product/${product.id}`;
        router.push(`/login?next=${encodeURIComponent(nextPath)}&reason=auth-required`);
    }, [product.id, router]);

    const handleAddToCart = useCallback(() => {
        void (async () => {
            if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
                setActionNotice("Biến thể đã hết hàng. Vui lòng chọn biến thể khác.");
                return;
            }

            if (!isAuthenticated) {
                setActionNotice("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
                toast.info("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
                redirectToLogin();
                return;
            }

            try {
                await addItem({
                    variantId: selectedVariant.id,
                    quantity,
                });
                setActionNotice(`Đã thêm ${quantity} sản phẩm vào giỏ hàng.`);
                toast.success("Đã thêm sản phẩm vào giỏ hàng.");
            } catch (error) {
                if (isApiRequestError(error)) {
                    setActionNotice(error.message);
                    toast.error(error.message);
                    return;
                }

                setActionNotice("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
                toast.error("Không thể thêm sản phẩm vào giỏ hàng.");
            }
        })();
    }, [addItem, isAuthenticated, quantity, redirectToLogin, selectedVariant]);

    const handleBuyNow = useCallback(() => {
        void (async () => {
            if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
                setActionNotice("Biến thể đã hết hàng. Vui lòng chọn biến thể khác.");
                return;
            }

            if (!isAuthenticated) {
                setActionNotice("Vui lòng đăng nhập để tiếp tục mua ngay.");
                toast.info("Vui lòng đăng nhập để tiếp tục mua ngay.");
                redirectToLogin();
                return;
            }

            try {
                await addItem({
                    variantId: selectedVariant.id,
                    quantity,
                });
                toast.success("Đã thêm vào giỏ hàng. Đang chuyển tới trang giỏ hàng.");
                router.push("/cart");
            } catch (error) {
                if (isApiRequestError(error)) {
                    setActionNotice(error.message);
                    toast.error(error.message);
                    return;
                }

                setActionNotice("Không thể xử lý mua ngay. Vui lòng thử lại.");
                toast.error("Không thể xử lý mua ngay.");
            }
        })();
    }, [addItem, isAuthenticated, quantity, redirectToLogin, router, selectedVariant]);

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
                <ProductImageGallery
                    productName={product.name}
                    selectedImage={selectedImage}
                    galleryImages={galleryImages}
                    onSelectImage={setSelectedImage}
                />

                <ProductPurchasePanel
                    product={product}
                    variantOptions={variantOptions}
                    selectedAttributes={selectedAttributes}
                    onSelectAttributeValue={handleSelectAttributeValue}
                    selectedVariant={selectedVariant ?? undefined}
                    quantity={quantity}
                    maxQuantity={maxQuantity}
                    onQuantityChange={handleQuantityChange}
                    selectedVariantPrice={selectedVariantPrice}
                    totalStock={totalStock}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    actionNotice={actionNotice}
                />
            </section>

            <ProductShopSummary shop={shop} />

            <ProductReviewsSection
                ratingAverage={product.ratingAverage}
                ratingCount={product.ratingCount}
                reviews={reviews}
                totalReviewItems={initialReviewMeta.totalItems}
                canLoadMoreReviews={canLoadMoreReviews}
                isLoadingMoreReviews={isLoadingMoreReviews}
                reviewsLoadError={reviewsLoadError}
                onLoadMoreReviews={() => {
                    void handleLoadMoreReviews();
                }}
            />
        </div>
    );
}
