"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isApiRequestError } from "@/services/http-client";

export default function AuthCallbackSuccessPage() {
    const router = useRouter();
    const { refreshProfile } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const completeLogin = async () => {
            try {
                await refreshProfile();

                if (!isMounted) {
                    return;
                }

                router.replace("/");
            } catch (error) {
                if (
                    isApiRequestError(error) &&
                    (error.statusCode === 401 || error.statusCode === 403)
                ) {
                    router.replace("/login");
                    return;
                }

                const message = encodeURIComponent("Đăng nhập Google thất bại");
                router.replace(`/auth/callback/error?message=${message}`);
            }
        };

        void completeLogin();

        return () => {
            isMounted = false;
        };
    }, [refreshProfile, router]);

    return (
        <main className="bg-white py-14 sm:py-20">
            <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
                    <h1 className="text-2xl font-semibold text-gray-900">Đang đăng nhập...</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Hệ thống đang hoàn tất phiên đăng nhập Google của bạn.
                    </p>
                </section>
            </div>
        </main>
    );
}
