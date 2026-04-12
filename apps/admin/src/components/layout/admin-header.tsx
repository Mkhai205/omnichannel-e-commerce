"use client";

import type { AuthUser } from "@repo/shared-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui";
import { LOGIN_ROUTE } from "@/lib/auth-routes";
import { getMyProfile, logoutAdmin } from "@/services/auth-service";

type AdminHeaderProps = {
    onToggleSidebar: () => void;
};

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<AuthUser | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
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
            } catch {
                if (!isMounted) {
                    return;
                }
                setProfile(null);
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
            await logoutAdmin();
        } finally {
            setIsLoggingOut(false);
            router.replace(LOGIN_ROUTE);
        }
    };

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
            <div className="flex h-full items-center gap-3 px-3 md:px-6">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onToggleSidebar}
                    aria-label="Bật/tắt thanh bên"
                >
                    <Menu aria-hidden="true" />
                </Button>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="inline-flex size-9 items-center justify-center rounded-md bg-slate-900 text-white">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            Bảng điều khiển quản trị
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            Giám sát và vận hành hệ thống đa kênh
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" disabled={isLoadingProfile}>
                            {profile?.email ?? "Quản trị viên"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel className="grid gap-1">
                            <span className="text-xs text-slate-500">Đang đăng nhập với</span>
                            <span className="truncate text-sm font-medium">
                                {profile?.fullName ?? "Người dùng quản trị"}
                            </span>
                            <span className="truncate text-xs text-slate-500">
                                {profile?.email ?? "--"}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                                void handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="text-rose-600"
                        >
                            <LogOut className="mr-2 size-4" aria-hidden="true" />
                            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
