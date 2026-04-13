import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShoppingBagIcon, StarIcon } from "lucide-react";
import { cn } from "@/components/ui";

type HotDealProduct = {
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    rating: number;
    discount?: string;
};

type HomeHotDealProductCardProps = {
    product: HotDealProduct;
    variant?: "featured" | "compact";
};

function HomeHotDealProductCard({ product, variant = "compact" }: HomeHotDealProductCardProps) {
    if (variant === "featured") {
        return (
            <article className="h-full rounded-3xl border border-success/35 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md cursor-pointer">
                <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold">
                    <span className="rounded bg-red-500 px-2 py-0.5 text-white">
                        {product.discount ?? "Giảm giá"}
                    </span>
                    <span className="rounded bg-blue-500 px-2 py-0.5 text-white">Bán chạy</span>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                    <div className="relative aspect-square">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 30vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <h3 className="line-clamp-2 text-base font-semibold text-success">
                        {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        {product.oldPrice ? (
                            <span className="text-sm text-gray-400 line-through">
                                {product.oldPrice}
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon
                                key={`${product.name}-${index}`}
                                className={cn(
                                    "size-3.5",
                                    index < product.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300",
                                )}
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex items-end justify-center gap-4">
                        {["00", "02", "18", "46"].map((value, index) => (
                            <div key={`${value}-${index}`}>
                                <p className="text-3xl font-bold">{value}</p>
                                <p className="mt-1 text-[10px] tracking-[0.14em] uppercase">
                                    {index === 0
                                        ? "Ngày"
                                        : index === 1
                                          ? "Giờ"
                                          : index === 2
                                            ? "Phút"
                                            : "Giấy"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="group relative rounded-3xl border border-gray-200 bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-success/40 hover:shadow-md cursor-pointer">
            {product.discount ? (
                <div className="absolute top-2 left-2 z-10 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    {product.discount}
                </div>
            ) : null}

            <div className="relative mb-3 overflow-hidden rounded-2xl bg-gray-50">
                <div className="relative aspect-square">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 18vw"
                        className="object-cover"
                    />
                </div>
            </div>

            <p className="line-clamp-2 text-[12px] font-medium text-gray-700">{product.name}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                {product.oldPrice ? (
                    <span className="text-[11px] text-gray-400 line-through">
                        {product.oldPrice}
                    </span>
                ) : null}
            </div>
            <div className="mt-1.5 flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                        key={`${product.name}-${index}`}
                        className={cn(
                            "size-3",
                            index < product.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300",
                        )}
                    />
                ))}
            </div>

            <button
                type="button"
                aria-label={`Thêm ${product.name} vào giỏ`}
                className="absolute bottom-3 right-4 z-10 inline-flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-500 ring-1 ring-gray-200 group-hover:text-success"
            >
                <ShoppingBagIcon className="size-3.5" />
            </button>
        </article>
    );
}

const HOT_DEAL_PRODUCTS: HotDealProduct[] = [
    {
        name: "Nhẫn thông minh RingConn Gen 2",
        image: "/hot-deals/1.webp",
        price: "2.390.000đ",
        oldPrice: "2.990.000đ",
        rating: 5,
        discount: "Giảm 20%",
    },
    {
        name: "Mũ lưỡi trai họa tiết cá tính",
        image: "/hot-deals/2.webp",
        price: "129.000đ",
        oldPrice: "199.000đ",
        rating: 4,
        discount: "Giảm 35%",
    },
    {
        name: "Robot hút bụi lau nhà tự động",
        image: "/hot-deals/3.webp",
        price: "1.290.000đ",
        oldPrice: "2.490.000đ",
        rating: 5,
        discount: "Giảm 48%",
    },
    {
        name: "Bộ bóng đá thi đấu tặng bơm mini",
        image: "/hot-deals/4.webp",
        price: "89.000đ",
        oldPrice: "149.000đ",
        rating: 4,
        discount: "Giảm 40%",
    },
    {
        name: "Xịt thơm miệng Scenti Kissing Spray",
        image: "/hot-deals/5.webp",
        price: "169.000đ",
        oldPrice: "299.000đ",
        rating: 5,
        discount: "Giảm 43%",
    },
    {
        name: "Tai nghe không dây ENC KY Tech",
        image: "/hot-deals/6.webp",
        price: "239.000đ",
        oldPrice: "399.000đ",
        rating: 4,
        discount: "Giảm 40%",
    },
    {
        name: "Bộ móng giả ánh ngọc đính nơ",
        image: "/hot-deals/7.webp",
        price: "59.000đ",
        oldPrice: "99.000đ",
        rating: 4,
        discount: "Giảm 40%",
    },
];

export function HomeHotDealsProducts() {
    const [featuredProduct, ...gridProducts] = HOT_DEAL_PRODUCTS;

    if (!featuredProduct) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-orange-600">
                        SẢN PHẨM HOT DEALS
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                        Sản phẩm Hot Deals trong tuần
                    </h2>
                </div>
                <Link
                    href="/categories"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:text-success-dark"
                >
                    Xem tất cả
                    <ArrowRightIcon className="size-4" />
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
                <HomeHotDealProductCard product={featuredProduct} variant="featured" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gridProducts.map((product) => (
                        <HomeHotDealProductCard key={product.name} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
