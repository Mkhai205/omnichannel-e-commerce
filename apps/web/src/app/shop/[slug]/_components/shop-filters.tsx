import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button, Input } from "@/components/ui";

export type ShopProductsFilters = {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: number;
};

type ShopFiltersProps = {
    slug: string;
    filters: ShopProductsFilters;
};

const MIN_RATING_OPTIONS = [5, 4, 3] as const;

function buildShopBasePath(slug: string): string {
    return `/shop/${encodeURIComponent(slug)}`;
}

export function ShopFilters({ slug, filters }: ShopFiltersProps) {
    return (
        <aside className="lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-gray-900">Bộ lọc sản phẩm</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Lọc trong phạm vi cửa hàng hiện tại
                    </p>
                </div>

                <form method="get" action={buildShopBasePath(slug)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="shop-search"
                            className="mb-1.5 block text-xs font-semibold text-gray-700"
                        >
                            Tìm kiếm trong shop
                        </label>
                        <div className="relative">
                            <SearchIcon className="pointer-events-none absolute left-2 top-2.5 size-4 text-gray-400" />
                            <Input
                                id="shop-search"
                                name="search"
                                defaultValue={filters.search}
                                className="h-9 pl-8"
                                placeholder="Tên sản phẩm..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="shop-min-price"
                                className="mb-1.5 block text-xs font-semibold text-gray-700"
                            >
                                Giá từ
                            </label>
                            <Input
                                id="shop-min-price"
                                name="minPrice"
                                inputMode="decimal"
                                defaultValue={filters.minPrice}
                                placeholder="100000"
                                className="h-9"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="shop-max-price"
                                className="mb-1.5 block text-xs font-semibold text-gray-700"
                            >
                                Giá đến
                            </label>
                            <Input
                                id="shop-max-price"
                                name="maxPrice"
                                inputMode="decimal"
                                defaultValue={filters.maxPrice}
                                placeholder="1000000"
                                className="h-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="shop-min-rating"
                            className="mb-1.5 block text-xs font-semibold text-gray-700"
                        >
                            Đánh giá tối thiểu
                        </label>
                        <select
                            id="shop-min-rating"
                            name="minRating"
                            defaultValue={
                                typeof filters.minRating === "number"
                                    ? String(filters.minRating)
                                    : ""
                            }
                            className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-gray-700 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <option value="">Tất cả</option>
                            {MIN_RATING_OPTIONS.map((value) => (
                                <option key={value} value={String(value)}>
                                    Từ {value} sao
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button type="submit" className="h-9 w-full">
                            Áp dụng
                        </Button>
                        <Button type="button" asChild variant="outline" className="h-9 w-full">
                            <Link href={buildShopBasePath(slug)}>Xóa lọc</Link>
                        </Button>
                    </div>
                </form>

                <div className="mt-5 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                    Sắp xếp nâng cao sẽ được bổ sung ở phase tiếp theo.
                </div>
            </div>
        </aside>
    );
}
