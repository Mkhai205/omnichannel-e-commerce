"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon, PhoneCallIcon, SearchIcon, ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

const NAV_ITEMS = [
    { href: "/", label: "Trang chủ" },
    { href: "/blog", label: "Tin tức" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
];

export function SiteHeader() {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState("");
    const { user: currentUser, isInitializing } = useAuth();
    const { totalItems, isInitializing: isCartInitializing } = useCart();

    const userInitials =
        currentUser?.fullName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "U";

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const normalizedKeyword = searchKeyword.trim();

        if (normalizedKeyword.length === 0) {
            toast.warning("Vui lòng nhập từ khóa trước khi tìm kiếm.");
            return;
        }

        toast.success(`Đang tìm kiếm: ${normalizedKeyword}`);
        router.push(`/shop?q=${encodeURIComponent(normalizedKeyword)}`);
    };

    return (
        <header className="sticky top-0 z-50">
            <div className="border-b border-gray-100 bg-white">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-4 py-3 md:grid-cols-[auto_1fr_auto] md:px-6">
                    <BrandLogo />

                    <form
                        className="mx-auto flex w-full max-w-xl items-center rounded-md border border-gray-200 bg-white p-1"
                        onSubmit={handleSearchSubmit}
                    >
                        <SearchIcon className="ml-2 size-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchKeyword}
                            onChange={(event) => setSearchKeyword(event.target.value)}
                            className="h-9 border-0 shadow-none focus-visible:ring-0"
                        />
                        <Button
                            type="submit"
                            className="h-9 rounded-sm bg-success px-5 text-sm text-white hover:bg-success-dark"
                        >
                            Tìm
                        </Button>
                    </form>

                    <div className="ml-auto inline-flex items-center gap-4 text-gray-700">
                        <button
                            type="button"
                            aria-label="Danh sách yêu thích"
                            className="hover:text-success"
                        >
                            <HeartIcon className="size-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-200" />
                        <Link
                            href="/cart"
                            aria-label="Giỏ hàng"
                            className="relative inline-flex items-center gap-2 hover:text-success"
                        >
                            <ShoppingBagIcon className="size-5" />
                            {!isCartInitializing && totalItems > 0 ? (
                                <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-semibold text-white">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            ) : null}
                        </Link>

                        {!isInitializing ? (
                            currentUser ? (
                                <Link
                                    href="/account"
                                    className="inline-flex size-8 items-center justify-center rounded-full bg-success text-xs font-semibold text-white"
                                    aria-label="Tài khoản người dùng"
                                >
                                    {userInitials}
                                </Link>
                            ) : (
                                <div className="inline-flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-success/40 hover:text-success"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-success px-3 py-1.5 text-sm font-semibold text-white hover:bg-success-dark"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div className="h-8 w-28 animate-pulse rounded-md bg-gray-100" />
                        )}
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-100 bg-success text-white">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                    <nav className="hidden items-center gap-8 text-sm md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="cursor-pointer hover:text-white/80"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="inline-flex items-center gap-2 text-sm">
                        <PhoneCallIcon className="size-4" />
                        <span>(+84) 123 456 789</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
