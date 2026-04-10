"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboardIcon, LogOutIcon, SettingsIcon, ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, cn } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";

type AccountNavItem = {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
};

const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
    { label: "Dashboard", href: "/account/dashboard", icon: LayoutDashboardIcon },
    { label: "Order History", href: "/account/orders", icon: ShoppingBagIcon },
    { label: "Settings", href: "/account/settings", icon: SettingsIcon },
];

export function AccountNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Đã đăng xuất tài khoản.");
            router.replace("/login");
        } catch (error) {
            toast.error(toFriendlyErrorMessage(error, "Không thể đăng xuất. Vui lòng thử lại."));
        }
    };

    return (
        <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="px-2 pb-2 text-sm font-semibold text-gray-900">Navigation</p>
            <nav className="space-y-1">
                {ACCOUNT_NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                                isActive && "bg-success/10 text-success-dark",
                            )}
                        >
                            <Icon className="size-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-3 border-t border-gray-100 pt-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                        void handleLogout();
                    }}
                >
                    <LogOutIcon className="size-4" />
                    Log out
                </Button>
            </div>
        </aside>
    );
}
