import { Suspense } from "react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { VerifyEmailCard } from "./_components/verify-email-card";

export default function VerifyEmailPage() {
    return (
        <>
            <SiteBreadcrumb section="Tài khoản" current="Xác minh email" />

            <main className="bg-white py-14 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <Suspense fallback={null}>
                        <VerifyEmailCard />
                    </Suspense>
                </div>
            </main>
        </>
    );
}
