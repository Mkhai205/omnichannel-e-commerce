"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductItem } from "@repo/shared-types";
import {
    getCatalogCategoryMap,
    getSellerProducts,
    getSellerProductsCountByStatus,
    hideSellerProduct,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { toProductRow, toProductsOverviewStats } from "./_adapters/products-adapter";
import { ProductsFilters } from "./_components/products-filters";
import { ProductsHeader } from "./_components/products-header";
import { ProductsOverviewCards } from "./_components/products-overview-cards";
import { ProductsTable } from "./_components/products-table";
import type {
    ProductActionButton,
    ProductChannelFilter,
    ProductFilterOption,
    ProductFilterValues,
    ProductSyncFilter,
} from "./types";

const pageSize = 10;

const productsActionButtons: ProductActionButton[] = [
    {
        id: "add-csv-file",
        label: "Thêm file CSV",
        style: "outline",
    },
    {
        id: "sync-all",
        label: "Đồng bộ tất cả",
        style: "primary",
        isDisabled: true,
        tooltip: "Coming soon",
    },
];

const syncStatusOptions: ProductFilterOption<ProductSyncFilter>[] = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "synced", label: "Đồng bộ" },
    { value: "not-synced", label: "Chưa đồng bộ" },
];

const channelOptions: ProductFilterOption<ProductChannelFilter>[] = [
    { value: "all", label: "Tất cả các kênh" },
    { value: "tiktok", label: "TikTok" },
    { value: "lazada", label: "Lazada" },
    { value: "shopee", label: "Shopee" },
    { value: "other", label: "Khác" },
];

const syncStatusLabelByFilter: Record<
    Exclude<ProductSyncFilter, "all">,
    "ĐÃ ĐỒNG BỘ" | "CHƯA ĐỒNG BỘ"
> = {
    synced: "ĐÃ ĐỒNG BỘ",
    "not-synced": "CHƯA ĐỒNG BỘ",
};

const channelLabelByFilter: Record<
    Exclude<ProductChannelFilter, "all">,
    "Shopee" | "TikTok" | "Lazada" | "Khác"
> = {
    tiktok: "TikTok",
    lazada: "Lazada",
    shopee: "Shopee",
    other: "Khác",
};

const initialFilterValues: ProductFilterValues = {
    syncStatus: "all",
    channel: "all",
    keyword: "",
};

export default function ProductsPage() {
    const [filterValues, setFilterValues] = useState<ProductFilterValues>(initialFilterValues);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sellingGoodsCount, setSellingGoodsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reloadSeed, setReloadSeed] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                const nextCategoryMap = await getCatalogCategoryMap();

                if (!isMounted) {
                    return;
                }

                setCategoryMap(nextCategoryMap);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải danh mục sản phẩm. Vui lòng thử lại.");
                }
            }
        };

        void fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setIsLoading(true);

            try {
                const keyword = filterValues.keyword.trim();

                const [response, activeProductsCount] = await Promise.all([
                    getSellerProducts({
                        page: currentPage,
                        limit: pageSize,
                        search: keyword.length > 0 ? keyword : undefined,
                    }),
                    getSellerProductsCountByStatus("ACTIVE"),
                ]);

                if (!isMounted) {
                    return;
                }

                setProducts(response.data);
                setTotalProductsCount(response.meta.totalItems);
                setTotalPages(Math.max(1, response.meta.totalPages));
                setSellingGoodsCount(activeProductsCount);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [currentPage, filterValues.keyword, reloadSeed]);

    const rows = useMemo(() => {
        return products.map((product) => toProductRow(product, categoryMap));
    }, [categoryMap, products]);

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const isStatusMatched =
                filterValues.syncStatus === "all"
                    ? true
                    : row.syncStatus === syncStatusLabelByFilter[filterValues.syncStatus];

            const isChannelMatched =
                filterValues.channel === "all"
                    ? true
                    : row.channel === channelLabelByFilter[filterValues.channel];

            return isStatusMatched && isChannelMatched;
        });
    }, [filterValues.channel, filterValues.syncStatus, rows]);

    const isClientFiltered = filterValues.syncStatus !== "all" || filterValues.channel !== "all";
    const effectiveTotalPages = isClientFiltered ? 1 : Math.max(1, totalPages);
    const effectiveTotalCount = isClientFiltered ? filteredRows.length : totalProductsCount;

    const productsOverviewStats = useMemo(() => {
        return toProductsOverviewStats({
            totalGoodsCount: totalProductsCount,
            sellingGoodsCount,
            rows,
        });
    }, [rows, sellingGoodsCount, totalProductsCount]);

    useEffect(() => {
        setCurrentPage((previousPage) => Math.min(previousPage, effectiveTotalPages));
    }, [effectiveTotalPages]);

    const handleHideProduct = async (productId: string) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn ẩn sản phẩm này?");

        if (!isConfirmed) {
            return;
        }

        setIsMutating(true);

        try {
            await hideSellerProduct(productId);
            setReloadSeed((previous) => previous + 1);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể ẩn sản phẩm. Vui lòng thử lại.");
            }
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <ProductsHeader
                actions={productsActionButtons}
                onActionClick={(actionId) => {
                    if (actionId === "add-csv-file") {
                        setErrorMessage(
                            "Tính năng nhập CSV sẽ được triển khai trong bước tiếp theo.",
                        );
                    }
                }}
            />

            <ProductsOverviewCards stats={productsOverviewStats} />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <ProductsFilters
                values={filterValues}
                statusOptions={syncStatusOptions}
                channelOptions={channelOptions}
                onKeywordChange={(value) => {
                    setFilterValues((previous) => ({ ...previous, keyword: value }));
                    setCurrentPage(1);
                }}
                onStatusChange={(value) => {
                    setFilterValues((previous) => ({ ...previous, syncStatus: value }));
                    setCurrentPage(1);
                }}
                onChannelChange={(value) => {
                    setFilterValues((previous) => ({ ...previous, channel: value }));
                    setCurrentPage(1);
                }}
            />

            <ProductsTable
                rows={filteredRows}
                currentPage={currentPage}
                totalPages={effectiveTotalPages}
                pageSize={pageSize}
                totalProductsCount={effectiveTotalCount}
                filteredRowCount={filteredRows.length}
                isLoading={isLoading}
                isMutating={isMutating}
                onPageChange={setCurrentPage}
                onHideProduct={handleHideProduct}
            />
        </section>
    );
}
