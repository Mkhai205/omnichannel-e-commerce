import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { ForgotPasswordFormCard } from "./_components/forgot-password-form-card";

export default function ForgotPasswordPage() {
    return (
        <>
            <SiteBreadcrumb section="Tài khoản" current="Quên mật khẩu" />

            <main className="bg-white py-14 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <ForgotPasswordFormCard />
                </div>
            </main>
        </>
    );
}
