import { RegisterFormCard } from "./_components/register-form-card";
import { RegisterHeroPanel } from "./_components/register-hero-panel";
import { RegisterTopBar } from "./_components/register-top-bar";

export default function SellerRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen max-w-7xl bg-slate-100">
        <RegisterTopBar />

        <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr] lg:gap-0">
          <RegisterHeroPanel />

          <section className="px-5 pb-8 lg:px-10 lg:pb-10 lg:pt-6">
            <RegisterFormCard />
          </section>
        </div>
      </div>
    </main>
  );
}
