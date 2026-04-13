import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export function HomeHotDealsBanner() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-4 pb-8 md:px-6">
            <div className="grid gap-4 lg:grid-cols-3">
                <Link href="/categories" className="group relative overflow-hidden rounded-2xl">
                    <Image
                        src="/hot-deals/banner/1.png"
                        alt="Sale of the Month"
                        width={1536}
                        height={768}
                        priority
                        className="h-108 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-x-6 top-8 text-center text-white">
                        <p className="text-xs font-semibold tracking-[0.16em] uppercase">
                            Best Deals
                        </p>
                        <h3 className="mt-2 text-4xl leading-tight font-bold">
                            Bán chạy nhất trong tháng
                        </h3>
                        <div className="mt-6 flex items-end justify-center gap-4">
                            {["00", "02", "18", "46"].map((value, index) => (
                                <div key={`${value}-${index}`}>
                                    <p className="text-3xl font-bold">{value}</p>
                                    <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-blue-100">
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
                        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-success">
                            Xem ngay
                            <ArrowRightIcon className="size-4" />
                        </span>
                    </div>
                </Link>

                <Link href="/categories" className="group relative overflow-hidden rounded-2xl">
                    <Image
                        src="/hot-deals/banner/2.png"
                        alt="Low-Fat Meat"
                        width={1536}
                        height={768}
                        className="h-108 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-6 top-8 text-center text-white">
                        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-200">
                            85% Fat Free
                        </p>
                        <h3 className="mt-2 text-5xl leading-tight font-bold">Thịt ít béo</h3>
                        <p className="mt-4 text-xl text-gray-200">
                            Chỉ với <span className="font-bold text-orange-400">99.000 VND</span>
                        </p>
                        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-success">
                            Xem ngay
                            <ArrowRightIcon className="size-4" />
                        </span>
                    </div>
                </Link>

                <Link href="/categories" className="group relative overflow-hidden rounded-2xl">
                    <Image
                        src="/hot-deals/banner/3.png"
                        alt="100% Fresh Fruit"
                        width={1536}
                        height={768}
                        className="h-108 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-6 top-8 text-center text-gray-900">
                        <p className="text-xs font-semibold tracking-[0.16em] uppercase">
                            Fresh & Organic
                        </p>
                        <h3 className="mt-2 text-5xl leading-tight font-bold">
                            100% Trái cây tươi
                        </h3>
                        <p className="mt-4 text-xl">
                            Up to
                            <span className="ml-2 rounded-md bg-black px-2 py-1 text-lg font-bold text-yellow-300">
                                64% OFF
                            </span>
                        </p>
                        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-success">
                            Xem ngay
                            <ArrowRightIcon className="size-4" />
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
