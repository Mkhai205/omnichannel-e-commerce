"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";
import { getMySellerShop } from "@/services/seller-shop-service";

export default function AuthCallbackSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const finishLogin = async () => {
            try {
                await getMyProfile();
                const shop = await getMySellerShop();

                if (!isMounted) {
                    return;
                }

                router.replace(shop ? "/" : "/onboarding");
            } catch (error) {
                if (
                    isApiRequestError(error) &&
                    (error.statusCode === 401 || error.statusCode === 403)
                ) {
                    router.replace("/login");
                    return;
                }

                const errorMessage = encodeURIComponent("Đăng nhập Google thất bại");
                router.replace(`/auth/callback/error?message=${errorMessage}`);
            }
        };

        void finishLogin();

        return () => {
            isMounted = false;
        };
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Đang đăng nhập...</h1>
                <p className="mt-3 text-sm text-slate-600">
                    Hệ thống đang hoàn tất phiên đăng nhập Google cho tài khoản người bán.
                </p>
            </section>
        </main>
    );
}
