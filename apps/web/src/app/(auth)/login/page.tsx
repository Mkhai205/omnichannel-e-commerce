import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { LoginFormCard } from "./_components/login-form-card";

export default function LoginPage() {
    return (
        <>
            <SiteBreadcrumb section="Tài khoản" current="Đăng nhập" />

            <main className="bg-white py-14 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <LoginFormCard />
                </div>
            </main>
        </>
    );
}
