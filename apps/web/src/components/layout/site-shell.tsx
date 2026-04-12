import { Suspense, type ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteNewsletter } from "@/components/layout/site-newsletter";
import { RouteToastListener } from "@/components/layout/route-toast-listener";
import { Toaster } from "@/components/ui";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";

type SiteShellProps = {
    children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="flex min-h-screen flex-col bg-white text-gray-900">
                    <SiteHeader />
                    <Suspense fallback={null}>
                        <RouteToastListener />
                    </Suspense>
                    <div className="flex-1">{children}</div>
                    <SiteNewsletter />
                    <SiteFooter />
                    <Toaster />
                </div>
            </CartProvider>
        </AuthProvider>
    );
}
