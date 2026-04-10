import type { ProductItem, ProductVariantItem } from "@repo/shared-types";

export const PRODUCTS_IMAGE_FALLBACK_SRC = "/products/image.webp";

export type TodaySuggestionCardItem = {
    id: string;
    name: string;
    imageSrc: string;
    displayPrice: string;
    availabilityLabel: string;
    ratingAverage: number;
    ratingCount: number;
    href: string;
};

function normalizeRatingAverage(value: number): number {
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }

    if (value > 5) {
        return 5;
    }

    return value;
}

function normalizeRatingCount(value: number): number {
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }

    return Math.floor(value);
}

function toPositivePrice(variant: ProductVariantItem): number | null {
    const parsed = Number.parseFloat(variant.price);
    if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
}

function resolveLowestVariantPrice(variants: ProductVariantItem[]): number | null {
    let currentLowestPrice: number | null = null;

    for (const variant of variants) {
        const variantPrice = toPositivePrice(variant);

        if (variantPrice === null) {
            continue;
        }

        if (currentLowestPrice === null || variantPrice < currentLowestPrice) {
            currentLowestPrice = variantPrice;
        }
    }

    return currentLowestPrice;
}

function resolveTotalStock(variants: ProductVariantItem[]): number {
    return variants.reduce((total, variant) => total + Math.max(variant.stockQuantity, 0), 0);
}

function resolveProductImageSrc(imageUrl?: string | null): string {
    const normalizedImageUrl = imageUrl?.trim();

    return normalizedImageUrl ? normalizedImageUrl : PRODUCTS_IMAGE_FALLBACK_SRC;
}

function formatVndPrice(amount: number | null): string {
    if (amount === null) {
        return "Liên hệ";
    }

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function mapProductToTodaySuggestionCardItem(product: ProductItem): TodaySuggestionCardItem {
    const totalStock = resolveTotalStock(product.variants);

    return {
        id: product.id,
        name: product.name,
        imageSrc: resolveProductImageSrc(product.imageUrl),
        displayPrice: formatVndPrice(resolveLowestVariantPrice(product.variants)),
        availabilityLabel: totalStock > 0 ? "Còn hàng" : "Hết hàng",
        ratingAverage: normalizeRatingAverage(product.ratingAverage),
        ratingCount: normalizeRatingCount(product.ratingCount),
        href: `/product/${product.id}`,
    };
}
