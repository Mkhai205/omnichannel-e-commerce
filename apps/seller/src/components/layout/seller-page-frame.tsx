"use client";

import { usePathname } from "next/navigation";
import { isAuthPublicRoute } from "@/lib/auth-routes";
import { SellerProtectedGate } from "@/components/layout/seller-protected-gate";
import { SellerShell } from "@/components/layout/seller-shell";

type SellerPageFrameProps = {
    children: React.ReactNode;
};

export function SellerPageFrame({ children }: SellerPageFrameProps) {
    const pathname = usePathname();

    if (isAuthPublicRoute(pathname)) {
        return <>{children}</>;
    }

    return (
        <SellerShell>
            <SellerProtectedGate>{children}</SellerProtectedGate>
        </SellerShell>
    );
}
