"use client";

import { usePathname } from "next/navigation";
import { isAuthPublicRoute } from "@/lib/auth-routes";
import { AdminProtectedGate } from "@/components/layout/admin-protected-gate";
import { AdminShell } from "@/components/layout/admin-shell";

type AdminPageFrameProps = {
    children: React.ReactNode;
};

export function AdminPageFrame({ children }: AdminPageFrameProps) {
    const pathname = usePathname();

    if (isAuthPublicRoute(pathname)) {
        return <>{children}</>;
    }

    return (
        <AdminShell>
            <AdminProtectedGate>{children}</AdminProtectedGate>
        </AdminShell>
    );
}
