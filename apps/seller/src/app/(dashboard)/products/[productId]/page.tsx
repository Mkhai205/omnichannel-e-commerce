"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ProductItem, VariantAttributes } from "@repo/shared-types";
import { Button } from "@/components/ui";
import {
    createSellerProduct,
    createSellerProductVariant,
    deleteSellerProduct,
    deleteSellerProductVariant,
    getCatalogCategories,
    getSellerProductById,
    updateSellerProduct,
    updateSellerProductVariant,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductEditorForm } from "../_components/product-editor-form";
import type { ProductDraft, VariantDraft } from "../types";

type CategoryOption = {
    id: string;
    name: string;
};

type NormalizedVariantDraft = {
    id?: string;
    sku: string;
    price: string;
    stockQuantity: number;
    attributes: VariantAttributes;
};

function buildDefaultDraft(): ProductDraft {
    return {
        name: "",
        categoryId: "",
        description: "",
        status: "DRAFT",
        variants: [
            {
                sku: "",
                price: "0",
                stockQuantity: 0,
                attributesText: "{}",
            },
        ],
    };
}

function mapProductToDraft(product: ProductItem): ProductDraft {
    return {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description ?? "",
        status: product.status,
        variants: product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            stockQuantity: variant.stockQuantity,
            attributesText: JSON.stringify(variant.attributes, null, 2),
        })),
    };
}

function parseAttributesText(attributesText: string): VariantAttributes {
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

function normalizeVariants(variants: VariantDraft[]): NormalizedVariantDraft[] {
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

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();

    const productId = useMemo(() => {
        const value = params.productId;

        if (typeof value === "string") {
            return value;
        }

        if (Array.isArray(value)) {
            return value[0] ?? "";
        }

        return "";
    }, [params.productId]);

    const isCreateMode = productId === "new";

    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [draft, setDraft] = useState<ProductDraft>(buildDefaultDraft());
    const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        const loaded: CategoryOption[] = [];
        let page = 1;

        while (true) {
            const response = await getCatalogCategories({ page, limit: 100 });
            loaded.push(
                ...response.data.map((item) => ({
                    id: item.id,
                    name: item.name,
                })),
            );

            if (page >= response.meta.totalPages || response.meta.totalPages === 0) {
                break;
            }

            page += 1;
        }

        setCategories(loaded);
    }, []);

    const fetchProduct = useCallback(async () => {
        if (isCreateMode) {
            setDraft(buildDefaultDraft());
            setOriginalVariantIds([]);
            return;
        }

        if (productId.length === 0) {
            throw new Error("Mã sản phẩm không hợp lệ.");
        }

        const product = await getSellerProductById(productId);
        setDraft(mapProductToDraft(product));
        setOriginalVariantIds(product.variants.map((variant) => variant.id));
    }, [isCreateMode, productId]);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);

        try {
            await Promise.all([fetchCategories(), fetchProduct()]);
            setErrorMessage(null);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải thông tin sản phẩm.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchCategories, fetchProduct]);

    useEffect(() => {
        void loadInitialData();
    }, [loadInitialData]);

    const handleSubmit = async () => {
        if (draft.name.trim().length === 0) {
            setErrorMessage("Tên sản phẩm không được để trống");
            return;
        }

        if (draft.categoryId.trim().length === 0) {
            setErrorMessage("Vui lòng chọn danh mục sản phẩm");
            return;
        }

        if (draft.variants.length === 0) {
            setErrorMessage("Sản phẩm cần ít nhất một biến thể");
            return;
        }

        setIsSubmitting(true);

        try {
            const normalizedVariants = normalizeVariants(draft.variants);

            if (isCreateMode) {
                const createdProduct = await createSellerProduct({
                    name: draft.name.trim(),
                    categoryId: draft.categoryId,
                    description: draft.description.trim() || undefined,
                    status: draft.status,
                });

                for (const variant of normalizedVariants) {
                    await createSellerProductVariant(createdProduct.id, {
                        sku: variant.sku,
                        price: variant.price,
                        stockQuantity: variant.stockQuantity,
                        attributes: variant.attributes,
                    });
                }

                setSuccessMessage("Tạo sản phẩm thành công.");
                router.replace(`/products/${createdProduct.id}`);
                return;
            }

            await updateSellerProduct(productId, {
                name: draft.name.trim(),
                categoryId: draft.categoryId,
                description: draft.description.trim() || undefined,
                status: draft.status,
            });

            const nextVariantIdSet = new Set(
                normalizedVariants
                    .filter((variant) => Boolean(variant.id))
                    .map((variant) => variant.id as string),
            );

            for (const originalVariantId of originalVariantIds) {
                if (!nextVariantIdSet.has(originalVariantId)) {
                    await deleteSellerProductVariant(originalVariantId);
                }
            }

            for (const variant of normalizedVariants) {
                if (variant.id) {
                    await updateSellerProductVariant(variant.id, {
                        price: variant.price,
                        stockQuantity: variant.stockQuantity,
                        attributes: variant.attributes,
                    });
                } else {
                    await createSellerProductVariant(productId, {
                        sku: variant.sku,
                        price: variant.price,
                        stockQuantity: variant.stockQuantity,
                        attributes: variant.attributes,
                    });
                }
            }

            setOriginalVariantIds(
                normalizedVariants
                    .filter((variant) => Boolean(variant.id))
                    .map((variant) => variant.id as string),
            );
            setSuccessMessage("Cập nhật sản phẩm thành công.");
            setErrorMessage(null);
            await loadInitialData();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể lưu sản phẩm. Vui lòng thử lại.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (isCreateMode || productId.length === 0) {
            return;
        }

        if (!window.confirm("Xóa sản phẩm này?")) {
            return;
        }

        setIsSubmitting(true);

        try {
            await deleteSellerProduct(productId);
            router.push("/products");
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể xóa sản phẩm.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = isCreateMode ? "Thêm sản phẩm mới" : "Chi tiết sản phẩm";

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <section className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="text-sm text-slate-600">
                        Chỉnh sửa thông tin sản phẩm trực tiếp trên trang, không dùng modal.
                    </p>
                </div>
                <Button asChild type="button" variant="outline">
                    <Link href="/products">Quay lại danh sách</Link>
                </Button>
            </section>

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            {successMessage ? (
                <section className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                </section>
            ) : null}

            {isLoading ? (
                <section className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                    Đang tải dữ liệu sản phẩm...
                </section>
            ) : (
                <>
                    <ProductEditorForm
                        categories={categories}
                        draft={draft}
                        disabled={isSubmitting}
                        onDraftChange={setDraft}
                    />

                    <section className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-4">
                        {!isCreateMode ? (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                onClick={handleDeleteProduct}
                            >
                                Xóa sản phẩm
                            </Button>
                        ) : null}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => router.push("/products")}
                        >
                            Hủy
                        </Button>
                        <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
                            {isSubmitting
                                ? "Đang lưu..."
                                : isCreateMode
                                  ? "Tạo sản phẩm"
                                  : "Lưu thay đổi"}
                        </Button>
                    </section>
                </>
            )}
        </section>
    );
}
