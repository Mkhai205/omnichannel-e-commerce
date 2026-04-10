import type { ProductItem } from "@repo/shared-types";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";
import { Button, cn } from "@/components/ui";
import { mapProductToTodaySuggestionCardItem } from "@/lib/home-today-suggestions";
import type { ShopProductsFilters } from "./shop-filters";

type ShopProductsSectionProps = {
    slug: string;
    products: ProductItem[];
    page: number;
    totalPages: number;
    totalItems: number;
    filters: ShopProductsFilters;
};

function buildPageHref(slug: string, page: number, filters: ShopProductsFilters): string {
    const params = new URLSearchParams();

    if (page > 1) {
        params.set("page", String(page));
    }

    if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.minPrice?.trim()) {
        params.set("minPrice", filters.minPrice.trim());
    }

    if (filters.maxPrice?.trim()) {
        params.set("maxPrice", filters.maxPrice.trim());
    }

    if (typeof filters.minRating === "number") {
        params.set("minRating", String(filters.minRating));
    }

    const queryString = params.toString();
    const basePath = `/shop/${encodeURIComponent(slug)}`;

    return queryString.length > 0 ? `${basePath}?${queryString}` : basePath;
}

function renderPageNumbers(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

export function ShopProductsSection({
    slug,
    products,
    page,
    totalPages,
    totalItems,
    filters,
}: ShopProductsSectionProps) {
    const pageNumbers = renderPageNumbers(page, totalPages);

    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">Sản phẩm của cửa hàng</h2>
                <p className="text-sm text-gray-600">
                    Đang xem <strong>{products.length}</strong> / <strong>{totalItems}</strong> sản
                    phẩm
                </p>
            </div>

            {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
                    <p className="text-base font-semibold text-gray-800">
                        Chưa có sản phẩm phù hợp bộ lọc
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Thử thay đổi bộ lọc hoặc khoảng giá để tìm sản phẩm.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => {
                        const cardItem = mapProductToTodaySuggestionCardItem(product);
                        const roundedStars = Math.round(cardItem.ratingAverage);

                        return (
                            <article
                                key={cardItem.id}
                                className="group rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-success/40 hover:shadow-md"
                            >
                                <Link href={cardItem.href} className="block">
                                    <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={cardItem.imageSrc}
                                                alt={cardItem.name}
                                                fill
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                            />
                                        </div>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">
                                        {cardItem.name}
                                    </p>

                                    <div className="mt-1.5 flex items-center gap-2">
                                        <div
                                            className="inline-flex items-center gap-0.5"
                                            aria-hidden
                                        >
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <StarIcon
                                                    key={`${cardItem.id}-star-${index}`}
                                                    className={cn(
                                                        "size-3.5",
                                                        index < roundedStars
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-gray-300",
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        {cardItem.ratingCount > 0 ? (
                                            <span className="text-xs font-medium text-gray-600">
                                                {cardItem.ratingAverage.toFixed(1)} (
                                                {cardItem.ratingCount})
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                Chua co danh gia
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-3">
                                        <span className="text-base font-bold text-success">
                                            {cardItem.displayPrice}
                                        </span>
                                        <span
                                            className={
                                                cardItem.availabilityLabel === "Còn hàng"
                                                    ? "rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                                                    : "rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                                            }
                                        >
                                            {cardItem.availabilityLabel}
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {page <= 1 ? (
                        <Button variant="outline" size="sm" className="min-w-24" disabled>
                            <ChevronLeftIcon className="size-4" />
                            Trước
                        </Button>
                    ) : (
                        <Button asChild variant="outline" size="sm" className="min-w-24">
                            <Link href={buildPageHref(slug, page - 1, filters)}>
                                <ChevronLeftIcon className="size-4" />
                                Trước
                            </Link>
                        </Button>
                    )}

                    {pageNumbers.map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            asChild
                            variant={pageNumber === page ? "default" : "outline"}
                            size="sm"
                            className="min-w-9"
                        >
                            <Link href={buildPageHref(slug, pageNumber, filters)}>
                                {pageNumber}
                            </Link>
                        </Button>
                    ))}

                    {page >= totalPages ? (
                        <Button variant="outline" size="sm" className="min-w-24" disabled>
                            Sau
                            <ChevronRightIcon className="size-4" />
                        </Button>
                    ) : (
                        <Button asChild variant="outline" size="sm" className="min-w-24">
                            <Link href={buildPageHref(slug, page + 1, filters)}>
                                Sau
                                <ChevronRightIcon className="size-4" />
                            </Link>
                        </Button>
                    )}
                </div>
            ) : null}
        </section>
    );
}
