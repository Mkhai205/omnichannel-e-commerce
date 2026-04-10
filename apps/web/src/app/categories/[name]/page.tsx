import type { CategoryItem } from "@repo/shared-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StarIcon } from "lucide-react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { Button, cn } from "@/components/ui";
import { POPULAR_CATEGORIES } from "@/lib/popular-categories";
import {
    getCatalogCategories,
    getCatalogCategoryBySlug,
    getCatalogProducts,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { CategoryProductsGridClient } from "./_components/category-products-grid-client";

type SearchParamsInput = Record<string, string | string[] | undefined>;

type CategoryPageProps = {
    params: { name: string } | Promise<{ name: string }>;
    searchParams?: SearchParamsInput | Promise<SearchParamsInput>;
};

type QueryFilters = {
    minPrice?: string;
    maxPrice?: string;
    minRating?: number;
};

type RelatedCategoryOption = {
    slug: string;
    name: string;
};

const PRODUCTS_PAGE_SIZE = 12;

const MIN_PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

const PRICE_PRESETS = [
    { label: "Dưới 500.000đ", minPrice: undefined, maxPrice: "500000" },
    { label: "500.000đ - 2.000.000đ", minPrice: "500000", maxPrice: "2000000" },
    { label: "2.000.000đ - 10.000.000đ", minPrice: "2000000", maxPrice: "10000000" },
    { label: "Trên 10.000.000đ", minPrice: "10000000", maxPrice: undefined },
] as const;

const MIN_RATING_OPTIONS = [5, 4, 3] as const;

function getSingleSearchParam(searchParams: SearchParamsInput, key: string): string | undefined {
    const value = searchParams[key];

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value[0];
    }

    return undefined;
}

function parseDecimalQueryValue(value?: string): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue || !MIN_PRICE_PATTERN.test(trimmedValue)) {
        return undefined;
    }

    return trimmedValue;
}

function parseMinRating(value?: string): number | undefined {
    if (!value) {
        return undefined;
    }

    const parsedValue = Number.parseFloat(value);

    if (!Number.isFinite(parsedValue) || parsedValue < 0 || parsedValue > 5) {
        return undefined;
    }

    return parsedValue;
}

function readQueryFilters(searchParams: SearchParamsInput): QueryFilters {
    const minPrice = parseDecimalQueryValue(getSingleSearchParam(searchParams, "minPrice"));
    const maxPrice = parseDecimalQueryValue(getSingleSearchParam(searchParams, "maxPrice"));

    const normalizedMinPrice =
        minPrice && maxPrice && Number.parseFloat(minPrice) > Number.parseFloat(maxPrice)
            ? undefined
            : minPrice;

    return {
        minPrice: normalizedMinPrice,
        maxPrice,
        minRating: parseMinRating(getSingleSearchParam(searchParams, "minRating")),
    };
}

function formatVndPrice(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}

function buildFiltersHref(
    slug: string,
    filters: QueryFilters,
    overrides?: Partial<QueryFilters>,
): string {
    const nextFilters: QueryFilters = {
        ...filters,
        ...overrides,
    };
    const params = new URLSearchParams();

    if (nextFilters.minPrice) {
        params.set("minPrice", nextFilters.minPrice);
    }

    if (nextFilters.maxPrice) {
        params.set("maxPrice", nextFilters.maxPrice);
    }

    if (typeof nextFilters.minRating === "number") {
        params.set("minRating", String(nextFilters.minRating));
    }

    const queryString = params.toString();
    return queryString.length > 0
        ? `/categories/${encodeURIComponent(slug)}?${queryString}`
        : `/categories/${encodeURIComponent(slug)}`;
}

function buildRelatedCategories(
    currentCategory: CategoryItem,
    categoriesFromApi: CategoryItem[],
): RelatedCategoryOption[] {
    const mergedCategories = new Map<string, RelatedCategoryOption>();

    mergedCategories.set(currentCategory.slug, {
        slug: currentCategory.slug,
        name: currentCategory.name,
    });

    for (const category of categoriesFromApi) {
        mergedCategories.set(category.slug, {
            slug: category.slug,
            name: category.name,
        });
    }

    for (const category of POPULAR_CATEGORIES) {
        if (mergedCategories.has(category.slug)) {
            continue;
        }

        mergedCategories.set(category.slug, {
            slug: category.slug,
            name: category.name,
        });
    }

    return [...mergedCategories.values()];
}

export default async function CategoryListingPage({ params, searchParams }: CategoryPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
    const slug = decodeURIComponent(resolvedParams.name);
    const filters = readQueryFilters(resolvedSearchParams);

    let currentCategory: CategoryItem;

    try {
        currentCategory = await getCatalogCategoryBySlug(slug);
    } catch (error) {
        if (isApiRequestError(error) && error.statusCode === 404) {
            notFound();
        }

        throw error;
    }

    const [relatedCategoriesResponse, productsResponse] = await Promise.all([
        getCatalogCategories({
            page: 1,
            limit: 50,
            parentId: currentCategory.parentId ?? undefined,
        }),
        getCatalogProducts({
            page: 1,
            limit: PRODUCTS_PAGE_SIZE,
            categoryId: currentCategory.id,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRating: filters.minRating,
        }),
    ]);

    const relatedCategories = buildRelatedCategories(
        currentCategory,
        relatedCategoriesResponse.data,
    );
    const hasFilters =
        Boolean(filters.minPrice) ||
        Boolean(filters.maxPrice) ||
        typeof filters.minRating === "number";

    return (
        <main>
            <SiteBreadcrumb section="Danh mục" current={currentCategory.name} />

            <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="lg:self-start">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-base font-bold text-gray-900">Bộ lọc</h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Lọc nhanh theo danh mục, giá và đánh giá
                                </p>
                            </div>

                            <section className="border-t border-gray-100 pt-5">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Danh mục liên quan
                                </h3>
                                <div className="mt-3 space-y-2">
                                    {relatedCategories.map((category) => {
                                        const isCurrentCategory =
                                            category.slug === currentCategory.slug;

                                        return (
                                            <Link
                                                key={category.slug}
                                                href={buildFiltersHref(category.slug, filters, {})}
                                                className={cn(
                                                    "block rounded-lg border px-3 py-2 text-sm transition",
                                                    isCurrentCategory
                                                        ? "border-success/60 bg-success/5 font-semibold text-success"
                                                        : "border-gray-200 text-gray-700 hover:border-success/30 hover:bg-gray-50",
                                                )}
                                            >
                                                {category.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="mt-6 border-t border-gray-100 pt-5">
                                <h3 className="text-sm font-semibold text-gray-900">Khoảng giá</h3>
                                <div className="mt-3 space-y-2">
                                    {PRICE_PRESETS.map((preset) => {
                                        const isActivePreset =
                                            filters.minPrice === preset.minPrice &&
                                            filters.maxPrice === preset.maxPrice;

                                        return (
                                            <Link
                                                key={preset.label}
                                                href={buildFiltersHref(
                                                    currentCategory.slug,
                                                    filters,
                                                    {
                                                        minPrice: preset.minPrice,
                                                        maxPrice: preset.maxPrice,
                                                    },
                                                )}
                                                className={cn(
                                                    "block rounded-lg border px-3 py-2 text-sm transition",
                                                    isActivePreset
                                                        ? "border-success/60 bg-success/5 font-semibold text-success"
                                                        : "border-gray-200 text-gray-700 hover:border-success/30 hover:bg-gray-50",
                                                )}
                                            >
                                                {preset.label}
                                            </Link>
                                        );
                                    })}
                                </div>

                                <form
                                    method="get"
                                    className="mt-4 space-y-2 rounded-lg border border-gray-200 p-3"
                                >
                                    <p className="text-xs font-semibold text-gray-600">
                                        Khoảng giá tùy chỉnh
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            name="minPrice"
                                            inputMode="decimal"
                                            placeholder="Từ"
                                            defaultValue={filters.minPrice}
                                            className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm outline-none transition focus:border-success/40"
                                        />
                                        <input
                                            type="text"
                                            name="maxPrice"
                                            inputMode="decimal"
                                            placeholder="Đến"
                                            defaultValue={filters.maxPrice}
                                            className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm outline-none transition focus:border-success/40"
                                        />
                                    </div>
                                    {typeof filters.minRating === "number" ? (
                                        <input
                                            type="hidden"
                                            name="minRating"
                                            value={String(filters.minRating)}
                                        />
                                    ) : null}
                                    <Button type="submit" size="sm" className="w-full">
                                        Áp dụng khoảng giá
                                    </Button>
                                </form>
                            </section>

                            <section className="mt-6 border-t border-gray-100 pt-5">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Đánh giá tối thiểu
                                </h3>
                                <div className="mt-3 space-y-2">
                                    {MIN_RATING_OPTIONS.map((ratingOption) => {
                                        const isActiveRating = filters.minRating === ratingOption;

                                        return (
                                            <Link
                                                key={ratingOption}
                                                href={buildFiltersHref(
                                                    currentCategory.slug,
                                                    filters,
                                                    {
                                                        minRating: ratingOption,
                                                    },
                                                )}
                                                className={cn(
                                                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition",
                                                    isActiveRating
                                                        ? "border-success/60 bg-success/5 font-semibold text-success"
                                                        : "border-gray-200 text-gray-700 hover:border-success/30 hover:bg-gray-50",
                                                )}
                                            >
                                                <span>Từ {ratingOption} sao</span>
                                                <span className="inline-flex items-center gap-0.5 text-amber-400">
                                                    {Array.from(
                                                        { length: ratingOption },
                                                        (_, index) => (
                                                            <StarIcon
                                                                key={`rating-${ratingOption}-${index}`}
                                                                className="size-3.5 fill-current"
                                                            />
                                                        ),
                                                    )}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>

                            {hasFilters ? (
                                <div className="mt-6 border-t border-gray-100 pt-5">
                                    <Button variant="outline" size="sm" asChild className="w-full">
                                        <Link
                                            href={`/categories/${encodeURIComponent(currentCategory.slug)}`}
                                        >
                                            Xóa tất cả bộ lọc
                                        </Link>
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </aside>

                    <div>
                        <header className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold tracking-[0.12em] text-success">
                                CATEGORY
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                                {currentCategory.name}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span>
                                    Có <strong>{productsResponse.meta.totalItems}</strong> sản phẩm
                                    phù hợp
                                </span>
                                {filters.minPrice ? (
                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                        Từ {formatVndPrice(Number.parseFloat(filters.minPrice))}
                                    </span>
                                ) : null}
                                {filters.maxPrice ? (
                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                        Đến {formatVndPrice(Number.parseFloat(filters.maxPrice))}
                                    </span>
                                ) : null}
                                {typeof filters.minRating === "number" ? (
                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                        Từ {filters.minRating} sao
                                    </span>
                                ) : null}
                            </div>
                        </header>

                        {productsResponse.data.length > 0 ? (
                            <>
                                <CategoryProductsGridClient
                                    initialItems={productsResponse.data}
                                    totalItems={productsResponse.meta.totalItems}
                                    pageSize={PRODUCTS_PAGE_SIZE}
                                    categoryId={currentCategory.id}
                                    minPrice={filters.minPrice}
                                    maxPrice={filters.maxPrice}
                                    minRating={filters.minRating}
                                />
                            </>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Chưa có sản phẩm phù hợp
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Thử thay đổi khoảng giá hoặc mức đánh giá để tìm thêm sản phẩm.
                                </p>
                                <Button className="mt-4" asChild>
                                    <Link
                                        href={`/categories/${encodeURIComponent(currentCategory.slug)}`}
                                    >
                                        Đặt lại bộ lọc
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
