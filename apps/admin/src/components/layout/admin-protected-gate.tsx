"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthPublicRoute, LOGIN_ROUTE } from "@/lib/auth-routes";
import { getMyProfile, logoutAdmin } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

type AdminProtectedGateProps = {
    children: React.ReactNode;
};

export function AdminProtectedGate({ children }: AdminProtectedGateProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const ensureAdminAccess = async () => {
            if (isAuthPublicRoute(pathname)) {
                if (isMounted) {
                    setIsChecking(false);
                }
                return;
            }

            try {
                const profile = await getMyProfile();

                if (profile.role !== "ADMIN") {
                    await logoutAdmin();
                    router.replace(LOGIN_ROUTE);
                    return;
                }

                if (profile.status === "UNVERIFIED") {
                    await logoutAdmin();
                    router.replace(`/verify-email?email=${encodeURIComponent(profile.email)}`);
                    return;
                }

                if (profile.status === "BANNED") {
                    await logoutAdmin();
                    router.replace(LOGIN_ROUTE);
                    return;
                }

                if (isMounted) {
                    setIsChecking(false);
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
            }
        };

        setIsChecking(true);
        void ensureAdminAccess();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center">
                <p className="text-sm text-slate-600">Đang kiểm tra phiên quản trị...</p>
            </div>
        );
    }

    return <>{children}</>;
}
