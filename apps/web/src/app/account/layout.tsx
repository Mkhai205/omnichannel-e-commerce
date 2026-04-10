import type { ReactNode } from "react";
import { AccountNav } from "./_components/account-nav";

type AccountLayoutProps = {
    children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
    return (
        <main className="bg-gray-50 py-10 sm:py-12">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
                    <div className="lg:sticky lg:top-24">
                        <AccountNav />
                    </div>
                    <section className="space-y-5">{children}</section>
                </div>
            </div>
        </main>
    );
}
