import { Suspense } from "react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { ResetPasswordFormCard } from "./_components/reset-password-form-card";

export default function ResetPasswordPage() {
    return (
        <>
            <SiteBreadcrumb section="Tài khoản" current="Đặt lại mật khẩu" />

            <main className="bg-white py-14 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <Suspense fallback={null}>
                        <ResetPasswordFormCard />
                    </Suspense>
                </div>
            </main>
        </>
    );
}
