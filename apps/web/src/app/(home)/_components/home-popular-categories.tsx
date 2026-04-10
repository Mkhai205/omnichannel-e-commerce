import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/components/ui";
import { DEFAULT_POPULAR_CATEGORY_SLUG, POPULAR_CATEGORIES } from "@/lib/popular-categories";

export function HomePopularCategories() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-2 pb-14 md:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Danh mục</h2>
                <Link
                    href={`/categories/${DEFAULT_POPULAR_CATEGORY_SLUG}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:text-success-dark"
                >
                    Xem tất cả
                    <ArrowRightIcon className="size-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {POPULAR_CATEGORIES.map((category, index) => (
                    <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className={cn(
                            "group rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-success/35 hover:shadow-md",
                            index === 0 && "border-success/60 ring-1 ring-success/25",
                        )}
                    >
                        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gray-50">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={120}
                                height={120}
                                className="size-20 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-gray-900">{category.name}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
