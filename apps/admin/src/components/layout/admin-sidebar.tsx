"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, CreditCard, House, ShoppingBag, Store, Users } from "lucide-react";
import { cn } from "@/components/ui";

type AdminSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const mainNav = [
    { label: "Tổng quan", icon: House, href: "/dashboard" },
    { label: "Người dùng", icon: Users, href: "/users" },
    { label: "Cửa hàng", icon: Store, href: "/shops" },
    { label: "Sản phẩm", icon: ClipboardCheck, href: "/products" },
    { label: "Đơn hàng", icon: ShoppingBag, href: "/orders" },
    { label: "Thanh toán", icon: CreditCard, href: "/payments" },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            <button
                type="button"
                aria-label="Đóng lớp phủ thanh bên"
                className={cn(
                    "fixed inset-0 top-16 z-30 bg-black/30 transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 flex h-[calc(100dvh-4rem)] w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "md:sticky md:translate-x-0",
                )}
            >
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
                    <nav className="flex flex-col gap-1">
                        {mainNav.map((item) => {
                            const isActive =
                                pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                                        isActive &&
                                            "bg-slate-900 text-white hover:bg-slate-900 hover:text-white",
                                    )}
                                    onClick={onClose}
                                >
                                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
