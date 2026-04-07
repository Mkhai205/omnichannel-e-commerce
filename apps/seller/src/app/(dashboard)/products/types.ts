import type { ProductStatus } from "@repo/shared-types";

export type ProductEditorMode = "create" | "edit";

export type VariantDraft = {
    id?: string;
    sku: string;
    price: string;
    stockQuantity: number;
    attributesText: string;
    imageKey?: string | null;
    imageUrl?: string | null;
};

export type ProductDraft = {
    name: string;
    categoryId: string;
    description: string;
    imageKey?: string | null;
    imageUrl?: string | null;
    status: ProductStatus;
    variants: VariantDraft[];
};
