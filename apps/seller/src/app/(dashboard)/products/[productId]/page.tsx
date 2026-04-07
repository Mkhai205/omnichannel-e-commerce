"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ProductItem } from "@repo/shared-types";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
    createSellerProduct,
    createSellerProductVariant,
    deleteSellerProduct,
    deleteSellerProductVariant,
    getCatalogCategories,
    getSellerProductById,
    uploadCatalogImage,
    updateSellerProduct,
    updateSellerProductVariant,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductEditorForm } from "../_components/product-editor-form";
import { normalizeVariants, validateCatalogImageFile } from "../utils/product-draft";
import type { ProductDraft } from "../types";
import { ProductDetailHeader } from "./_components/product-detail-header";
import { ProductFeedbackAlert } from "./_components/product-feedback-alert";
import { ProductImagePanel } from "./_components/product-image-panel";

type CategoryOption = {
    id: string;
    name: string;
};

const PRODUCT_STATUS_LABEL: Record<ProductDraft["status"], string> = {
    DRAFT: "Nháp",
    ACTIVE: "Đang bán",
    HIDDEN: "Đã ẩn",
};

function buildDefaultDraft(): ProductDraft {
    return {
        name: "",
        categoryId: "",
        description: "",
        imageKey: null,
        imageUrl: null,
        status: "DRAFT",
        variants: [
            {
                sku: "",
                price: "0",
                stockQuantity: 0,
                attributesText: "{}",
                imageKey: null,
                imageUrl: null,
            },
        ],
    };
}

function mapProductToDraft(product: ProductItem): ProductDraft {
    return {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description ?? "",
        imageKey: product.imageKey ?? null,
        imageUrl: product.imageUrl ?? null,
        status: product.status,
        variants: product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            stockQuantity: variant.stockQuantity,
            attributesText: JSON.stringify(variant.attributes, null, 2),
            imageKey: variant.imageKey ?? null,
            imageUrl: variant.imageUrl ?? null,
        })),
    };
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
    const [resolvedProductId, setResolvedProductId] = useState<string | null>(null);
    const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadingVariantIds, setUploadingVariantIds] = useState<string[]>([]);
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
            setResolvedProductId(null);
            setOriginalVariantIds([]);
            return;
        }

        if (productId.length === 0) {
            throw new Error("Mã sản phẩm không hợp lệ.");
        }

        const product = await getSellerProductById(productId);
        setDraft(mapProductToDraft(product));
        setResolvedProductId(product.id);
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

    const handleBackToProducts = useCallback(() => {
        router.push("/products");
    }, [router]);

    const handleUploadProductImage = useCallback(
        async (file: File) => {
            const normalizedProductId = resolvedProductId?.trim() ?? "";

            if (isCreateMode || normalizedProductId.length === 0) {
                setErrorMessage("ID sản phẩm chưa sẵn sàng. Hãy lưu sản phẩm trước khi tải ảnh.");
                return;
            }

            try {
                validateCatalogImageFile(file);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                }

                return;
            }

            setIsUploadingImage(true);

            try {
                const uploaded = await uploadCatalogImage("PRODUCT", normalizedProductId, file);
                const updatedProduct = await updateSellerProduct(normalizedProductId, {
                    imageKey: uploaded.objectKey,
                });

                setDraft((currentDraft) => ({
                    ...currentDraft,
                    imageKey: updatedProduct.imageKey ?? uploaded.objectKey,
                    imageUrl:
                        updatedProduct.imageUrl ??
                        uploaded.imageUrl ??
                        currentDraft.imageUrl ??
                        null,
                }));
                setErrorMessage(null);
                setSuccessMessage("Cập nhật ảnh sản phẩm thành công.");
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải ảnh sản phẩm. Vui lòng thử lại.");
                }
            } finally {
                setIsUploadingImage(false);
            }
        },
        [isCreateMode, resolvedProductId],
    );

    const handleUploadVariantImage = useCallback(async (variantId: string, file: File) => {
        const normalizedVariantId = variantId.trim();

        if (normalizedVariantId.length === 0) {
            setErrorMessage("ID biến thể chưa sẵn sàng. Hãy lưu biến thể trước khi tải ảnh.");
            return;
        }

        try {
            validateCatalogImageFile(file);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }

            return;
        }

        setUploadingVariantIds((previousIds) =>
            previousIds.includes(normalizedVariantId)
                ? previousIds
                : [...previousIds, normalizedVariantId],
        );

        try {
            const uploaded = await uploadCatalogImage("PRODUCT_VARIANT", normalizedVariantId, file);
            const updatedVariant = await updateSellerProductVariant(normalizedVariantId, {
                imageKey: uploaded.objectKey,
            });

            setDraft((currentDraft) => ({
                ...currentDraft,
                variants: currentDraft.variants.map((variant) => {
                    if (variant.id !== normalizedVariantId) {
                        return variant;
                    }

                    return {
                        ...variant,
                        imageKey: updatedVariant.imageKey ?? uploaded.objectKey,
                        imageUrl: updatedVariant.imageUrl ?? uploaded.imageUrl ?? variant.imageUrl,
                    };
                }),
            }));

            setErrorMessage(null);
            setSuccessMessage("Cập nhật ảnh biến thể thành công.");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải ảnh biến thể. Vui lòng thử lại.");
            }
        } finally {
            setUploadingVariantIds((previousIds) =>
                previousIds.filter((currentId) => currentId !== normalizedVariantId),
            );
        }
    }, []);

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
                        imageKey:
                            draft.variants.find((item) => item.id === variant.id)?.imageKey ??
                            undefined,
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

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <ProductDetailHeader isCreateMode={isCreateMode} onBack={handleBackToProducts} />

            {errorMessage ? <ProductFeedbackAlert tone="error" message={errorMessage} /> : null}

            {successMessage ? (
                <ProductFeedbackAlert tone="success" message={successMessage} />
            ) : null}

            {isLoading ? (
                <section className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                    Đang tải dữ liệu sản phẩm...
                </section>
            ) : (
                <>
                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
                        <ProductEditorForm
                            categories={categories}
                            draft={draft}
                            disabled={isSubmitting || isUploadingImage}
                            uploadingVariantIds={uploadingVariantIds}
                            onDraftChange={setDraft}
                            onVariantImageUpload={handleUploadVariantImage}
                        />

                        <aside className="grid gap-4">
                            <ProductImagePanel
                                imageKey={draft.imageKey}
                                imageUrl={draft.imageUrl}
                                isCreateMode={isCreateMode}
                                disabled={isSubmitting || !resolvedProductId}
                                isUploading={isUploadingImage}
                                onUpload={handleUploadProductImage}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Tổng quan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-slate-600">
                                    <p>Trạng thái: {PRODUCT_STATUS_LABEL[draft.status]}</p>
                                    <p>Số biến thể: {draft.variants.length}</p>
                                    <p>{isCreateMode ? "Chế độ tạo mới" : "Chế độ cập nhật"}</p>
                                </CardContent>
                            </Card>
                        </aside>
                    </section>

                    <section className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-4">
                        {!isCreateMode ? (
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting || isUploadingImage}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                onClick={handleDeleteProduct}
                            >
                                Xóa sản phẩm
                            </Button>
                        ) : null}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting || isUploadingImage}
                            onClick={handleBackToProducts}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            disabled={isSubmitting || isUploadingImage}
                            onClick={handleSubmit}
                        >
                            {isSubmitting || isUploadingImage
                                ? "Đang xử lý..."
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
