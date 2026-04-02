"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthPublicRoute, LOGIN_ROUTE, ONBOARDING_ROUTE } from "@/lib/auth-routes";
import { getMyProfile, logoutSeller } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";
import { getMySellerShop } from "@/services/seller-shop-service";

type SellerProtectedGateProps = {
    children: React.ReactNode;
};

export function SellerProtectedGate({ children }: SellerProtectedGateProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const ensureSellerAccess = async () => {
            if (isAuthPublicRoute(pathname)) {
                if (isMounted) {
                    setIsChecking(false);
                }
                return;
            }

            try {
                const profile = await getMyProfile();

                if (profile.status === "UNVERIFIED") {
                    await logoutSeller();
                    router.replace(`/verify-email?email=${encodeURIComponent(profile.email)}`);
                    return;
                }

                if (profile.status === "BANNED") {
                    await logoutSeller();
                    router.replace(LOGIN_ROUTE);
                    return;
                }
            } catch (error) {
                if (
                    isApiRequestError(error) &&
                    (error.statusCode === 401 || error.statusCode === 403)
                ) {
                    const nextParam = encodeURIComponent(pathname);
                    router.replace(`${LOGIN_ROUTE}?next=${nextParam}`);
                    return;
                }

                router.replace(LOGIN_ROUTE);
                return;
            }

            let shop = null;

            try {
                shop = await getMySellerShop();
            } catch (error) {
                if (
                    isApiRequestError(error) &&
                    (error.statusCode === 401 || error.statusCode === 403)
                ) {
                    router.replace(LOGIN_ROUTE);
                    return;
                }

                if (isMounted) {
                    setIsChecking(false);
                }
                return;
            }

            if (!shop && pathname !== ONBOARDING_ROUTE) {
                router.replace(ONBOARDING_ROUTE);
                return;
            }

            if (shop && pathname === ONBOARDING_ROUTE) {
                router.replace("/");
                return;
            }

            if (isMounted) {
                setIsChecking(false);
            }
        };

        setIsChecking(true);
        void ensureSellerAccess();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center">
                <p className="text-sm text-slate-600">Đang kiểm tra phiên đăng nhập...</p>
            </div>
        );
    }

    return <>{children}</>;
}
