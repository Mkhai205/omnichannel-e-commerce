"use client";

import type { AuthUser } from "@repo/shared-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Input,
} from "@/components/ui";
import { Bell, HelpCircle, Menu, Search, Settings } from "lucide-react";
import { getMyProfile, logoutSeller } from "@/services/auth-service";
import Link from "next/link";

type SellerHeaderProps = {
    onToggleSidebar: () => void;
};

export function SellerHeader({ onToggleSidebar }: SellerHeaderProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<AuthUser | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [hasAvatarLoadError, setHasAvatarLoadError] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setIsLoadingProfile(true);

            try {
                const currentProfile = await getMyProfile();

                if (!isMounted) {
                    return;
                }

                setProfile(currentProfile);
                setHasAvatarLoadError(false);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setProfile(null);
                console.error("Cannot load seller profile", error);
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        void loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await logoutSeller();
        } finally {
            setIsLoggingOut(false);
            router.replace("/login");
        }
    };

    const displayShopCode = profile?.sellerProfile?.shopId ?? "--";
    const displayShopName = profile?.sellerProfile?.shopName ?? profile?.fullName ?? "--";
    const displayEmail = profile?.email ?? "--";
    const avatarUrl = profile?.sellerProfile?.avatarUrl;

    const getInitials = (value: string): string => {
        const words = value.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) {
            return "S";
        }

        const first = words[0]?.[0] ?? "";
        const second = words[1]?.[0] ?? "";
        const initials = `${first}${second}`.toUpperCase();

        return initials || "S";
    };

    const avatarInitials = getInitials(displayShopName);

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
            <div className="flex h-full items-center">
                <div className="hidden h-full w-64 items-center border-r border-slate-200 px-6 md:flex">
                    <p className="text-2xl font-semibold text-[#3696f7]">Quản lý bán hàng</p>
                </div>

                <div className="flex h-full flex-1 items-center gap-3 px-3 md:px-6">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onToggleSidebar}
                        aria-label="Mở hoặc đóng thanh bên"
                    >
                        <Menu aria-hidden="true" />
                    </Button>

                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border px-3">
                        <Search className="size-4" />
                        <Input
                            placeholder="Tìm kiếm mã đơn, khách hàng..."
                            className="h-10 bg-white! border-0 px-0 focus-visible:ring-0"
                        />
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <Button type="button" variant="ghost" size="icon" aria-label="Thông báo">
                            <Bell aria-hidden="true" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Trung tâm trợ giúp"
                        >
                            <HelpCircle aria-hidden="true" />
                        </Button>

                        <Button type="button" variant="ghost" size="icon" aria-label="Cài đặt">
                            <Settings aria-hidden="true" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-10 rounded-full px-1"
                                    disabled={isLoadingProfile}
                                >
                                    {avatarUrl && !hasAvatarLoadError ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={avatarUrl}
                                            alt={displayShopName}
                                            className="size-8 rounded-full object-cover"
                                            onError={() => {
                                                setHasAvatarLoadError(true);
                                            }}
                                        />
                                    ) : (
                                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                            {avatarInitials}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                className="z-70 w-72 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
                            >
                                <DropdownMenuLabel className="pb-3">
                                    <div className="grid gap-2">
                                        <p className="text-sm font-semibold text-slate-100">
                                            Thông tin chủ shop
                                        </p>
                                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
                                            <div className="grid grid-cols-[96px_1fr] gap-y-1 text-xs">
                                                <span className="text-slate-400">Mã chủ shop</span>
                                                <span className="truncate font-medium text-slate-100">
                                                    {displayShopCode}
                                                </span>
                                                <span className="text-slate-400">Chủ shop</span>
                                                <span className="truncate font-medium text-slate-100">
                                                    {displayShopName}
                                                </span>
                                                <span className="text-slate-400">Email</span>
                                                <span className="truncate font-medium text-slate-100">
                                                    {displayEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="text-slate-100 focus:bg-slate-200 focus:text-slate-800">
                                        Thông tin tài khoản
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-slate-100 focus:bg-slate-200 focus:text-slate-800">
                                        <Link href="/profile">Thiết lập cửa hàng</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                    className="text-rose-400 focus:bg-rose-500/15 focus:text-rose-300"
                                    onSelect={(event) => {
                                        event.preventDefault();
                                        void handleLogout();
                                    }}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
