"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductItem, ProductStatus, VariantAttributes } from "@repo/shared-types";
import { Button } from "@repo/ui";
import {
    createSellerProduct,
    createSellerProductVariant,
    deleteSellerProduct,
    deleteSellerProductVariant,
    getCatalogCategories,
    getSellerProducts,
    updateSellerProduct,
    updateSellerProductVariant,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductEditorDialog } from "./_components/product-editor-dialog";
import { ProductsTable } from "./_components/products-table";
import { ProductsToolbar } from "./_components/products-toolbar";
import type { ProductDraft, VariantDraft } from "./types";

const PAGE_SIZE = 20;

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

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [refreshSeed, setRefreshSeed] = useState(0);

    const [editorOpen, setEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]);
    const [draft, setDraft] = useState<ProductDraft>(buildDefaultDraft());

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

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getSellerProducts({
                page: currentPage,
                limit: PAGE_SIZE,
                search: keyword.trim() || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            });

            setProducts(response.data);
            setTotalItems(response.meta.totalItems);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách sản phẩm.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, keyword, statusFilter]);

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts, refreshSeed]);

    const totalVariantCount = useMemo(
        () => products.reduce((sum, product) => sum + product.variants.length, 0),
        [products],
    );

    const totalStockCount = useMemo(
        () =>
            products.reduce(
                (sum, product) =>
                    sum +
                    product.variants.reduce(
                        (variantSum, variant) => variantSum + variant.stockQuantity,
                        0,
                    ),
                0,
            ),
        [products],
    );

    const openCreateDialog = () => {
        setEditorMode("create");
        setEditingProductId(null);
        setOriginalVariantIds([]);
        setDraft(buildDefaultDraft());
        setEditorOpen(true);
        setErrorMessage(null);
    };

    const openEditDialog = (product: ProductItem) => {
        setEditorMode("edit");
        setEditingProductId(product.id);
        setOriginalVariantIds(product.variants.map((variant) => variant.id));
        setDraft(mapProductToDraft(product));
        setEditorOpen(true);
        setErrorMessage(null);
    };

    const handleDeleteProduct = async (product: ProductItem) => {
        if (!window.confirm(`Xóa sản phẩm '${product.name}'?`)) {
            return;
        }

        try {
            await deleteSellerProduct(product.id);
            setRefreshSeed((previous) => previous + 1);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể xóa sản phẩm.");
            }
        }
    };

    const handleSubmitEditor = async () => {
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

            if (editorMode === "create") {
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
            } else if (editingProductId) {
                await updateSellerProduct(editingProductId, {
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
                        await createSellerProductVariant(editingProductId, {
                            sku: variant.sku,
                            price: variant.price,
                            stockQuantity: variant.stockQuantity,
                            attributes: variant.attributes,
                        });
                    }
                }
            }

            setEditorOpen(false);
            setRefreshSeed((previous) => previous + 1);
            setErrorMessage(null);
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

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <section className="grid gap-2 rounded-lg border border-slate-200 bg-white p-5">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Quản lý sản phẩm & tồn kho
                </h1>
                <p className="text-sm text-slate-600">
                    Thêm, chỉnh sửa, xóa sản phẩm và cập nhật số lượng tồn kho biến thể trực tiếp
                    trên cùng một màn hình.
                </p>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tổng sản phẩm
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalItems}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tổng biến thể
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {totalVariantCount}
                    </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tổng tồn kho
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalStockCount}</p>
                </div>
            </section>

            <ProductsToolbar
                keyword={keyword}
                status={statusFilter}
                onKeywordChange={(value) => {
                    setKeyword(value);
                    setCurrentPage(1);
                }}
                onStatusChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}
                onCreateClick={openCreateDialog}
            />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <ProductsTable
                products={products}
                isLoading={isLoading}
                onEdit={openEditDialog}
                onDelete={handleDeleteProduct}
            />

            <section className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                >
                    Trước
                </Button>
                <span className="text-sm text-slate-600">
                    Trang {currentPage}/{totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage >= totalPages || isLoading}
                    onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                >
                    Sau
                </Button>
            </section>

            <ProductEditorDialog
                open={editorOpen}
                mode={editorMode}
                categories={categories}
                draft={draft}
                submitting={isSubmitting}
                onOpenChange={setEditorOpen}
                onDraftChange={setDraft}
                onSubmit={handleSubmitEditor}
            />
        </section>
    );
}
