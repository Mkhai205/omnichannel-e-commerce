import type { PublicShopDetailItem } from "@repo/shared-types";
import Image from "next/image";
import { ShopActionsClient } from "./shop-actions-client";

type ShopHeaderProps = {
    shop: PublicShopDetailItem;
};

const SHOP_AVATAR_FALLBACK_SRC = "/shop/store-avatar.svg";
const SHOP_COVER_FALLBACK_SRC = "/shop/store-cover.svg";

function formatMonthYear(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Khong ro";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function resolveShopCover(coverUrl?: string | null): string {
    const normalizedCoverUrl = coverUrl?.trim();
    return normalizedCoverUrl ? normalizedCoverUrl : SHOP_COVER_FALLBACK_SRC;
}

function resolveShopAvatar(avatarUrl?: string | null): string {
    const normalizedAvatarUrl = avatarUrl?.trim();
    return normalizedAvatarUrl ? normalizedAvatarUrl : SHOP_AVATAR_FALLBACK_SRC;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
    const ratingLabel = shop.ratingCount > 0 ? shop.ratingAverage.toFixed(1) : "0.0";
    const joinedAtLabel = formatMonthYear(shop.createdAt);
    const coverUrl = resolveShopCover(shop.coverUrl);

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative h-28 bg-gray-100 md:h-50">
                <Image
                    src={coverUrl}
                    alt={`Cover ${shop.shopName}`}
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            <div className="px-4 py-4 md:px-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)] lg:items-center">
                    <div className="flex min-w-0 items-center gap-3 border-b border-gray-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow">
                            <Image
                                src={resolveShopAvatar(shop.avatarUrl)}
                                alt={`Avatar ${shop.shopName}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>
                        <div className="min-w-0">
                            <h1 className="line-clamp-2 text-base font-semibold text-gray-900 md:text-lg">
                                {shop.shopName}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">@{shop.slug}</p>
                            <p className="mt-1 text-xs text-gray-500">
                                Tham gia tu {joinedAtLabel}
                            </p>

                            <div className="mt-2">
                                <ShopActionsClient shopSlug={shop.slug} shopName={shop.shopName} />
                            </div>
                        </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-3">
                        <div>
                            <dt className="text-gray-500">Danh gia</dt>
                            <dd className="font-semibold text-rose-500">
                                {shop.ratingCount.toLocaleString("vi-VN")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Ti le phan hoi</dt>
                            <dd className="font-semibold text-rose-500">100%</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Tham gia</dt>
                            <dd className="font-semibold text-rose-500">{joinedAtLabel}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">San pham</dt>
                            <dd className="font-semibold text-rose-500">
                                {shop.productCount.toLocaleString("vi-VN")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Thoi gian phan hoi</dt>
                            <dd className="font-semibold text-rose-500">trong vai gio</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Diem trung binh</dt>
                            <dd className="font-semibold text-rose-500">{ratingLabel}</dd>
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
