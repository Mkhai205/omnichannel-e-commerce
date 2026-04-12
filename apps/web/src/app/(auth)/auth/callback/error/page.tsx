"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LOGIN_ROUTE } from "@/lib/auth-routes";

export default function AuthCallbackErrorPage() {
    return (
        <Suspense fallback={null}>
            <AuthCallbackErrorContent />
        </Suspense>
    );
}

function AuthCallbackErrorContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "Đăng nhập Google thất bại";

    return (
        <main className="bg-white py-14 sm:py-20">
            <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Đăng nhập Google thất bại
                    </h1>
                    <p className="mt-2 text-sm text-rose-600">{message}</p>
                    <div className="mt-6">
                        <Link href={LOGIN_ROUTE} className="text-sm font-semibold text-gray-900">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
