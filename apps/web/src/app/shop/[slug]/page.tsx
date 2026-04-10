import { notFound } from "next/navigation";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { getCatalogProducts } from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { getPublicShopBySlug } from "@/services/shop-service";
import { ShopFilters, type ShopProductsFilters } from "./_components/shop-filters";
import { ShopHeader } from "./_components/shop-header";
import { ShopProductsSection } from "./_components/shop-products-section";

type SearchParamsInput = Record<string, string | string[] | undefined>;

type ShopPageProps = {
    params: { slug: string } | Promise<{ slug: string }>;
    searchParams?: SearchParamsInput | Promise<SearchParamsInput>;
};

const PRODUCTS_PAGE_SIZE = 12;
const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

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

function parseSearch(value?: string): string | undefined {
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : undefined;
}

function parseDecimal(value?: string): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue || !DECIMAL_PATTERN.test(trimmedValue)) {
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

function parsePage(value?: string): number {
    if (!value) {
        return 1;
    }

    const parsedValue = Number.parseInt(value, 10);

    if (!Number.isFinite(parsedValue) || parsedValue < 1) {
        return 1;
    }

    return parsedValue;
}

function readFilters(searchParams: SearchParamsInput): ShopProductsFilters {
    const minPrice = parseDecimal(getSingleSearchParam(searchParams, "minPrice"));
    const maxPrice = parseDecimal(getSingleSearchParam(searchParams, "maxPrice"));

    return {
        search: parseSearch(getSingleSearchParam(searchParams, "search")),
        minPrice:
            minPrice && maxPrice && Number.parseFloat(minPrice) > Number.parseFloat(maxPrice)
                ? undefined
                : minPrice,
        maxPrice,
        minRating: parseMinRating(getSingleSearchParam(searchParams, "minRating")),
    };
}

export default async function ShopBySlugPage({ params, searchParams }: ShopPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
    const slug = decodeURIComponent(resolvedParams.slug);

    const page = parsePage(getSingleSearchParam(resolvedSearchParams, "page"));
    const filters = readFilters(resolvedSearchParams);

    try {
        const shop = await getPublicShopBySlug(slug);

        let productsResponse = await getCatalogProducts({
            page,
            limit: PRODUCTS_PAGE_SIZE,
            shopId: shop.id,
            search: filters.search,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRating: filters.minRating,
        });

        if (productsResponse.meta.totalPages > 0 && page > productsResponse.meta.totalPages) {
            productsResponse = await getCatalogProducts({
                page: productsResponse.meta.totalPages,
                limit: PRODUCTS_PAGE_SIZE,
                shopId: shop.id,
                search: filters.search,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                minRating: filters.minRating,
            });
        }

        const currentPage =
            productsResponse.meta.totalPages === 0
                ? 1
                : Math.min(page, productsResponse.meta.totalPages);

        return (
            <main>
                {/* <SiteBreadcrumb section="Cua hang" current={shop.shopName} /> */}

                <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
                    <ShopHeader shop={shop} />

                    <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                        <ShopFilters slug={shop.slug} filters={filters} />
                        <ShopProductsSection
                            slug={shop.slug}
                            products={productsResponse.data}
                            page={currentPage}
                            totalPages={productsResponse.meta.totalPages}
                            totalItems={productsResponse.meta.totalItems}
                            filters={filters}
                        />
                    </div>
                </section>
            </main>
        );
    } catch (error) {
        if (isApiRequestError(error) && (error.statusCode === 404 || error.statusCode === 400)) {
            notFound();
        }

        throw error;
    }
}
