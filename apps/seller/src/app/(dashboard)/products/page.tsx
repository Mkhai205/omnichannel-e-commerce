"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
    ProductItem,
    ProductStatus,
    SalesChannelType,
    SellerChannelConnectionItem,
} from "@repo/shared-types";
import { Button } from "@/components/ui";
import { getCatalogCategoryMap, getSellerProducts } from "@/services/catalog-service";
import {
    getSellerChannels,
    getSellerProductChannelSyncStatuses,
} from "@/services/channel-sync-service";
import { isApiRequestError } from "@/services/http-client";
import { ProductsTable } from "./_components/products-table";
import { ProductsToolbar } from "./_components/products-toolbar";

const PAGE_SIZE = 20;

const CHANNEL_ORDER: SalesChannelType[] = ["WEB", "TIKTOK_MOCK", "SHOPEE_MOCK"];
const EXTERNAL_CHANNELS: SalesChannelType[] = CHANNEL_ORDER.filter(
    (channelType) => channelType !== "WEB",
);

const CHANNEL_LABELS: Record<SalesChannelType, string> = {
    WEB: "Website nội bộ",
    TIKTOK_MOCK: "TikTok",
    SHOPEE_MOCK: "Shopee",
};

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [channelConnections, setChannelConnections] = useState<SellerChannelConnectionItem[]>([]);
    const [activeChannelType, setActiveChannelType] = useState<SalesChannelType>("WEB");
    const [syncedChannelsByProductId, setSyncedChannelsByProductId] = useState<
        Record<string, SalesChannelType[]>
    >({});
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
                channelType: activeChannelType === "WEB" ? undefined : activeChannelType,
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
    }, [currentPage, keyword, statusFilter, activeChannelType]);

    const fetchCategoryMap = useCallback(async () => {
        try {
            const loadedMap = await getCatalogCategoryMap();
            setCategoryMap(loadedMap);
        } catch {
            setCategoryMap({});
        }
    }, []);

    const fetchChannels = useCallback(async () => {
        try {
            const loadedConnections = await getSellerChannels();
            setChannelConnections(loadedConnections);
        } catch {
            setChannelConnections([]);
        }
    }, []);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        void fetchCategoryMap();
    }, [fetchCategoryMap]);

    useEffect(() => {
        void fetchChannels();
    }, [fetchChannels]);

    useEffect(() => {
        if (activeChannelType === "WEB") {
            return;
        }

        const activeConnection = channelConnections.find(
            (connection) => connection.channelType === activeChannelType,
        );
        if (!activeConnection || activeConnection.status !== "CONNECTED") {
            setActiveChannelType("WEB");
        }
    }, [activeChannelType, channelConnections]);

    useEffect(() => {
        if (products.length === 0) {
            setSyncedChannelsByProductId({});
            return;
        }

        if (activeChannelType !== "WEB") {
            setSyncedChannelsByProductId({});
            return;
        }

        let cancelled = false;

        const loadSyncedChannelTags = async () => {
            try {
                const productIds = products.map((product) => product.id);
                const responses = await Promise.all(
                    EXTERNAL_CHANNELS.map((channelType) =>
                        getSellerProductChannelSyncStatuses({
                            productIds,
                            channelType,
                        }),
                    ),
                );

                if (cancelled) {
                    return;
                }

                const nextMap: Record<string, SalesChannelType[]> = {};

                productIds.forEach((id) => {
                    nextMap[id] = [];
                });

                responses.forEach((response, index) => {
                    const channelType = EXTERNAL_CHANNELS[index];

                    response.items.forEach((item) => {
                        if (!channelType || item.mappedVariantCount <= 0) {
                            return;
                        }

                        const currentTags = nextMap[item.productId] ?? [];
                        if (!currentTags.includes(channelType)) {
                            nextMap[item.productId] = [...currentTags, channelType];
                        }
                    });
                });

                setSyncedChannelsByProductId(nextMap);
            } catch {
                if (!cancelled) {
                    setSyncedChannelsByProductId({});
                }
            }
        };

        void loadSyncedChannelTags();

        return () => {
            cancelled = true;
        };
    }, [products, activeChannelType]);

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

    const getChannelConnection = (channelType: SalesChannelType) => {
        return (
            channelConnections.find((connection) => connection.channelType === channelType) ?? null
        );
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

            <section className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-3">
                {CHANNEL_ORDER.map((channelType) => {
                    const isWeb = channelType === "WEB";
                    const connection = getChannelConnection(channelType);
                    const isDisabled = !isWeb && connection?.status !== "CONNECTED";
                    const isActive = activeChannelType === channelType;

                    return (
                        <button
                            key={channelType}
                            type="button"
                            disabled={isDisabled}
                            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                                isActive
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : isDisabled
                                      ? "border-slate-200 bg-slate-100 text-slate-400"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                            onClick={() => setActiveChannelType(channelType)}
                        >
                            <span className="block font-semibold">
                                {CHANNEL_LABELS[channelType]}
                            </span>
                            {!isWeb ? (
                                <span className="text-xs opacity-80">
                                    {connection?.status === "CONNECTED"
                                        ? "Đã kết nối"
                                        : "Chưa kết nối"}
                                </span>
                            ) : (
                                <span className="text-xs opacity-80">Nguồn chính</span>
                            )}
                        </button>
                    );
                })}
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
                activeChannelType={activeChannelType}
                syncedChannelsByProductId={syncedChannelsByProductId}
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
