export function LoginHero() {
  return (
    <section className="relative hidden overflow-hidden bg-slate-900 lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0ea5e9_0%,#0b3b75_35%,#041f3f_65%,#02152b_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.14),transparent_55%)]" />

      <div className="relative z-10 flex h-full max-w-lg flex-col justify-center gap-8 px-18 py-16 text-slate-100">
        <p className="text-4xl font-semibold tracking-tight">OmniShop</p>
        <div className="space-y-4">
          <h2 className="text-balance text-6xl font-semibold leading-tight">Đồng hành cùng sự phát triển của bạn</h2>
          <p className="max-w-md text-lg leading-relaxed text-slate-200/90">
            Hệ thống quản trị bán hàng đa kênh hiện đại, giúp tối ưu hóa vận hành và tăng trưởng doanh thu bền vững cho doanh nghiệp của bạn.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="h-1.5 w-16 rounded-full bg-blue-400" />
          <span className="h-1.5 w-4 rounded-full bg-slate-400/50" />
          <span className="h-1.5 w-4 rounded-full bg-slate-400/50" />
        </div>
      </div>
    </section>
  );
}
