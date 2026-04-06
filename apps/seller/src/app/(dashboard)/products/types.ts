import type { ProductStatus } from "@repo/shared-types";

export type ProductEditorMode = "create" | "edit";

export type VariantDraft = {
    id?: string;
    sku: string;
    price: string;
    stockQuantity: number;
    attributesText: string;
};

export type ProductDraft = {
    name: string;
    categoryId: string;
    description: string;
    status: ProductStatus;
    variants: VariantDraft[];
};
