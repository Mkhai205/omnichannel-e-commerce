import type { ProductItem, ProductVariantItem } from "@repo/shared-types";
import { PRODUCTS_IMAGE_FALLBACK_SRC } from "@/lib/home-today-suggestions";

export type VariantAttributeOption = {
    name: string;
    values: string[];
};

export function formatVndPrice(amount: number | null): string {
    if (amount === null) {
        return "Liên hệ";
    }

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function toPositivePrice(value: string): number | null {
    const parsed = Number.parseFloat(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
}

export function resolveLowestVariantPrice(variants: ProductVariantItem[]): number | null {
    let currentLowestPrice: number | null = null;

    for (const variant of variants) {
        const variantPrice = toPositivePrice(variant.price);

        if (variantPrice === null) {
            continue;
        }

        if (currentLowestPrice === null || variantPrice < currentLowestPrice) {
            currentLowestPrice = variantPrice;
        }
    }

    return currentLowestPrice;
}

export function resolveProductGalleryImages(product: ProductItem): string[] {
    const imageSet = new Set<string>();

    const normalizedProductImage = product.imageUrl?.trim();

    if (normalizedProductImage) {
        imageSet.add(normalizedProductImage);
    }

    for (const variant of product.variants) {
        const normalizedVariantImage = variant.imageUrl?.trim();

        if (normalizedVariantImage) {
            imageSet.add(normalizedVariantImage);
        }
    }

    if (imageSet.size === 0) {
        imageSet.add(PRODUCTS_IMAGE_FALLBACK_SRC);
    }

    return [...imageSet];
}

export function buildVariantAttributeOptions(
    variants: ProductVariantItem[],
): VariantAttributeOption[] {
    const attributesMap = new Map<string, Set<string>>();

    for (const variant of variants) {
        for (const [attributeName, attributeValue] of Object.entries(variant.attributes)) {
            const normalizedName = attributeName.trim();
            const normalizedValue = attributeValue.trim();

            if (!normalizedName || !normalizedValue) {
                continue;
            }

            if (!attributesMap.has(normalizedName)) {
                attributesMap.set(normalizedName, new Set<string>());
            }

            attributesMap.get(normalizedName)?.add(normalizedValue);
        }
    }

    return [...attributesMap.entries()].map(([name, values]) => ({
        name,
        values: [...values],
    }));
}

export function findMatchingVariant(
    variants: ProductVariantItem[],
    selectedAttributes: Record<string, string>,
): ProductVariantItem | null {
    for (const variant of variants) {
        const isMatch = Object.entries(selectedAttributes).every(
            ([attributeName, attributeValue]) =>
                variant.attributes[attributeName] === attributeValue,
        );

        if (isMatch) {
            return variant;
        }
    }

    return variants[0] ?? null;
}

export function resolveTotalStock(variants: ProductVariantItem[]): number {
    return variants.reduce((total, variant) => total + Math.max(variant.stockQuantity, 0), 0);
}
