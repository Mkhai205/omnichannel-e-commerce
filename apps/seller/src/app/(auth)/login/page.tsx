"use client";

import { LoginFormCard } from "./_components/login-form-card";
import { LoginHero } from "./_components/login-hero";
import { LoginSupportButton } from "./_components/login-support-button";

export default function SellerLoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1.4fr_1fr]">
      <LoginHero />

      <section className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-14">
        <div className="w-full max-w-md">
          <LoginFormCard />

          <div className="mt-6 flex justify-end">
            <LoginSupportButton />
          </div>
        </div>
      </section>
    </main>
  );
}
