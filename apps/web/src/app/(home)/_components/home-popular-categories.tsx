import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/components/ui";

const POPULAR_CATEGORIES = [
    { name: "Thời trang nam", image: "/categories/men-fashion.webp" },
    { name: "Thời trang nữ", image: "/categories/woman-fashion.webp" },
    { name: "Giày dép nam", image: "/categories/men-shoes.webp" },
    { name: "Giày dép nữ", image: "/categories/woman-shoes.webp" },
    { name: "Làm đẹp & Sức khỏe", image: "/categories/beauty-health.webp" },
    { name: "Ô tô & xe máy", image: "/categories/car-moto.webp" },
    { name: "Đồ điện tử", image: "/categories/electrical-equipment.webp" },
    { name: "Đồ gia dụng", image: "/categories/household-appliances.webp" },
    { name: "Trang sức", image: "/categories/jewelry-accessories.webp" },
    { name: "Laptop", image: "/categories/laptop.webp" },
    { name: "Điện thoại", image: "/categories/mobile.webp" },
    { name: "Thú cưng", image: "/categories/pets.webp" },
    { name: "Thể thao", image: "/categories/sports.webp" },
    { name: "Đồ chơi", image: "/categories/toys.webp" },
    { name: "Nhà sách Online", image: "/categories/books.webp" },
    { name: "Voucher khuyến mại", image: "/categories/voucher.webp" },
];

export function HomePopularCategories() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-2 pb-14 md:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Danh mục</h2>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:text-success-dark"
                >
                    Xem tất cả
                    <ArrowRightIcon className="size-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {POPULAR_CATEGORIES.map((category, index) => (
                    <Link
                        key={category.name}
                        href="/shop"
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
