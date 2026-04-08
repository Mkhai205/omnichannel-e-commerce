import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { RegisterFormCard } from "./_components/register-form-card";

export default function RegisterPage() {
    return (
        <>
            <SiteBreadcrumb section="Tài khoản" current="Tạo tài khoản" />

            <main className="py-14 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <RegisterFormCard />
                </div>
            </main>
        </>
    );
}
