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

                router.replace("/auth/callback/error?message=Google%20login%20failed");
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
                <h1 className="text-2xl font-semibold text-slate-900">Dang dang nhap...</h1>
                <p className="mt-3 text-sm text-slate-600">
                    He thong dang hoan tat phien Google login cho tai khoan seller.
                </p>
            </section>
        </main>
    );
}
