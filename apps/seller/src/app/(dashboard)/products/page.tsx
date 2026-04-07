"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductItem, ProductStatus } from "@repo/shared-types";
import { Button } from "@/components/ui";
import { getCatalogCategoryMap, getSellerProducts } from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductsTable } from "./_components/products-table";
import { ProductsToolbar } from "./_components/products-toolbar";

const PAGE_SIZE = 20;

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

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

    const fetchCategoryMap = useCallback(async () => {
        try {
            const loadedMap = await getCatalogCategoryMap();
            setCategoryMap(loadedMap);
        } catch {
            setCategoryMap({});
        }
    }, []);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        void fetchCategoryMap();
    }, [fetchCategoryMap]);

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

    const openCreatePage = () => {
        router.push("/products/new");
    };

    const openDetailPage = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
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
                onCreateClick={openCreatePage}
            />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <ProductsTable
                products={products}
                categoryMap={categoryMap}
                isLoading={isLoading}
                onRowClick={openDetailPage}
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
        </section>
    );
}
