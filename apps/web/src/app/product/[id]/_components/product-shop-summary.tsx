import type { PublicShopDetailItem } from "@repo/shared-types";
import Image from "next/image";
import Link from "next/link";
import { MessageCircleIcon, StoreIcon } from "lucide-react";
import { Button } from "@/components/ui";

type ProductShopSummaryProps = {
    shop: PublicShopDetailItem;
};

function resolveShopAvatarSrc(avatarUrl?: string | null): string {
    const normalizedAvatarUrl = avatarUrl?.trim();
    return normalizedAvatarUrl || "/shop/store-avatar.svg";
}

function formatJoinDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Không rõ";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export function ProductShopSummary({ shop }: ProductShopSummaryProps) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-4 md:px-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)] lg:items-center">
                    <div className="flex min-w-0 items-center gap-3 border-b border-gray-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow">
                            <Image
                                src={resolveShopAvatarSrc(shop.avatarUrl)}
                                alt={`Avatar cửa hàng ${shop.shopName}`}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-gray-900">
                                {shop.shopName}
                            </p>
                            <p className="text-sm text-gray-500">@{shop.slug}</p>
                            <p className="text-xs text-gray-500">
                                Tham gia từ {formatJoinDate(shop.createdAt)}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                    Yêu thích
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-rose-600"
                                >
                                    <MessageCircleIcon className="size-4" />
                                    Chat ngay
                                </Button>
                                <Button type="button" asChild size="sm" variant="outline">
                                    <Link href={`/shop/${encodeURIComponent(shop.slug)}`}>
                                        <StoreIcon className="size-4" />
                                        Xem shop
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-3">
                        <div>
                            <dt className="text-gray-500">Đánh giá</dt>
                            <dd className="font-semibold text-rose-500">
                                {shop.ratingCount.toLocaleString("vi-VN")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Tỉ lệ phản hồi</dt>
                            <dd className="font-semibold text-rose-500">100%</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Tham gia</dt>
                            <dd className="font-semibold text-rose-500">
                                {formatJoinDate(shop.createdAt)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Sản phẩm</dt>
                            <dd className="font-semibold text-rose-500">
                                {shop.productCount.toLocaleString("vi-VN")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Thời gian phản hồi</dt>
                            <dd className="font-semibold text-rose-500">trong vài giờ</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Người theo dõi</dt>
                            <dd className="font-semibold text-rose-500">--</dd>
                        </div>
                    </dl>
                </div>

                {shop.description ? (
                    <p className="mt-4 border-t border-gray-100 pt-3 text-sm leading-6 text-gray-600">
                        {shop.description}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
