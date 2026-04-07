import type { VariantAttributes } from "@repo/shared-types";
import type { VariantDraft } from "../types";

export type NormalizedVariantDraft = {
    id?: string;
    sku: string;
    price: string;
    stockQuantity: number;
    attributes: VariantAttributes;
};

const SUPPORTED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function parseAttributesText(attributesText: string): VariantAttributes {
    const normalizedText = attributesText.trim().length > 0 ? attributesText : "{}";
    const parsed = JSON.parse(normalizedText) as unknown;

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Attributes phải là JSON object");
    }

    const output: VariantAttributes = {};

    for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            output[key] = String(value);
            continue;
        }

        throw new Error(`Giá trị của thuộc tính '${key}' phải là string/number/boolean`);
    }

    return output;
}

export function normalizeVariants(variants: VariantDraft[]): NormalizedVariantDraft[] {
    return variants.map((variant) => {
        const sku = variant.sku.trim();
        const price = variant.price.trim();
        const stockQuantity = Number(variant.stockQuantity);

        if (!variant.id && sku.length === 0) {
            throw new Error("SKU không được để trống cho biến thể mới");
        }

        if (price.length === 0 || Number.isNaN(Number(price)) || Number(price) < 0) {
            throw new Error("Giá biến thể không hợp lệ");
        }

        if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
            throw new Error("Số lượng tồn kho phải lớn hơn hoặc bằng 0");
        }

        return {
            id: variant.id,
            sku,
            price,
            stockQuantity,
            attributes: parseAttributesText(variant.attributesText),
        };
    });
}

export function validateCatalogImageFile(file: File): void {
    if (!SUPPORTED_IMAGE_MIME_TYPES.has(file.type)) {
        throw new Error("Ảnh không hợp lệ. Chỉ chấp nhận JPEG, PNG, WEBP hoặc GIF.");
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("Ảnh vượt quá 5MB. Vui lòng chọn file nhỏ hơn.");
    }
}
