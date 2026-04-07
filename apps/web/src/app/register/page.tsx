import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-background text-on-surface font-body flex min-h-screen flex-col">
      <main className="flex min-h-screen grow flex-col md:flex-row">
        <section className="bg-surface-container-low hidden flex-col justify-between p-12 md:flex md:w-1/2 lg:p-24">
          <div className="space-y-12">
            <div>
              <span className="font-headline text-on-surface text-3xl font-bold tracking-tighter">
                OmniShop
              </span>
            </div>

            <div className="space-y-8">
              <h1 className="font-headline text-on-surface text-4xl leading-tight font-extrabold tracking-tight lg:text-5xl">
                Trai nghiem mua sam <br />
                <span className="text-primary">dang cap so.</span>
              </h1>

              <ul className="space-y-6">
                <li className="group flex items-center gap-4">
                  <div className="bg-surface-container-lowest text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      local_shipping
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-on-surface font-semibold">
                      Theo doi don hang thoi gian thuc
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Luon biet chinh xac vi tri kien hang cua ban.
                    </p>
                  </div>
                </li>

                <li className="group flex items-center gap-4">
                  <div className="bg-surface-container-lowest text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      verified_user
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-on-surface font-semibold">
                      Bao mat thanh toan tuyet doi
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Cong nghe ma hoa da lop bao ve giao dich.
                    </p>
                  </div>
                </li>

                <li className="group flex items-center gap-4">
                  <div className="bg-surface-container-lowest text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      bolt
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-on-surface font-semibold">
                      Thanh toan sieu toc 1-Click
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Tiet kiem thoi gian cho nhung trai nghiem moi.
                    </p>
                  </div>
                </li>

                <li className="group flex items-center gap-4">
                  <div className="bg-surface-container-lowest text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      star
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-on-surface font-semibold">
                      Uu dai doc quyen som nhat
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Dac quyen danh rieng cho thanh vien OmniShop.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative mt-12 aspect-video overflow-hidden rounded-xl shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGdnF79qksxGbsiwr1YXvzaMQ0tiDzHYDXc3khI7DiA0QxurqPUIg7nrL9fPU_JOh2W9l0k7FqPn72jDhchxsT10DmmJsLGOPc9cHdzdEC0MwLcnviLiyCdobddiUuN4AmuHVFmmZILHnksxyZH7PzS5IWEUPU34g-Ym12PORrZBJsRsJiPZVdEVf2jVbcm3dzaSME0A92qNi1lvMhFyDMDKNALsLH3uqMMYn-1ShNeR5kTPjgXux1Q7qSa-puHUsfxXu9rahPeUo"
              alt="Premium retail showroom"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </section>

        <section className="bg-surface flex w-full items-center justify-center p-6 md:w-1/2 md:p-12 lg:p-24">
          <div className="w-full max-w-md space-y-8">
            <div className="mb-8 md:hidden">
              <span className="font-headline text-on-surface text-2xl font-bold tracking-tighter">
                OmniShop
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-headline text-on-surface text-2xl font-bold lg:text-3xl">
                Tao tai khoan moi
              </h2>
              <p className="text-on-surface-variant">
                Nhap thong tin cua ban de bat dau hanh trinh mua sam
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="border-outline-variant hover:bg-surface-container-low flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-200 active:scale-95"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-label text-sm font-medium">Google</span>
              </button>

              <button
                type="button"
                className="border-outline-variant hover:bg-surface-container-low flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-200 active:scale-95"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12S0 .073 0 6.7c0 5.99 4.388 10.954 10.125 11.854V10.17H7.078V6.7h3.047V4.057c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235V2.576H15.83c-1.491 0-1.956.925-1.956 1.874V6.7h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                <span className="font-label text-sm font-medium">Facebook</span>
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="border-outline-variant/30 w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs tracking-widest uppercase">
                <span className="bg-surface text-on-surface-variant font-label px-4">
                  Hoac voi email
                </span>
              </div>
            </div>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="full-name"
                  className="font-label text-on-surface-variant text-xs font-semibold tracking-wider uppercase"
                >
                  Ho va ten
                </label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Nguyen Van A"
                  className="bg-surface-container-high focus:ring-primary focus:bg-surface-container-lowest w-full rounded-xl border-none px-4 py-3 transition-all focus:ring-1"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="font-label text-on-surface-variant text-xs font-semibold tracking-wider uppercase"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="bg-surface-container-high focus:ring-primary focus:bg-surface-container-lowest w-full rounded-xl border-none px-4 py-3 transition-all focus:ring-1"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="font-label text-on-surface-variant text-xs font-semibold tracking-wider uppercase"
                >
                  So dien thoai
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0123 456 789"
                  className="bg-surface-container-high focus:ring-primary focus:bg-surface-container-lowest w-full rounded-xl border-none px-4 py-3 transition-all focus:ring-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="font-label text-on-surface-variant text-xs font-semibold tracking-wider uppercase"
                  >
                    Mat khau
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-surface-container-high focus:ring-primary focus:bg-surface-container-lowest w-full rounded-xl border-none px-4 py-3 transition-all focus:ring-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="font-label text-on-surface-variant text-xs font-semibold tracking-wider uppercase"
                  >
                    Xac nhan mat khau
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-surface-container-high focus:ring-primary focus:bg-surface-container-lowest w-full rounded-xl border-none px-4 py-3 transition-all focus:ring-1"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-headline shadow-primary/20 hover:bg-primary-container w-full rounded-full py-4 font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                  Dang ky tai khoan
                </button>
              </div>
            </form>

            <div className="pt-4 text-center">
              <p className="text-on-surface-variant text-sm">
                Ban da co tai khoan?
                <Link
                  href="/login"
                  className="text-primary ml-1 font-semibold underline-offset-4 hover:underline"
                >
                  Dang nhap ngay
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low flex w-full flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row md:px-12">
        <div className="font-label text-on-surface-variant text-[10px] tracking-widest uppercase">
          COPYRIGHT 2024 OmniShop. The Digital Curator. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link
            href="#"
            className="font-label text-on-surface-variant hover:text-primary text-[10px] tracking-widest uppercase transition-colors"
          >
            Quyen rieng tu
          </Link>
          <Link
            href="#"
            className="font-label text-on-surface-variant hover:text-primary text-[10px] tracking-widest uppercase transition-colors"
          >
            Dieu khoan
          </Link>
        </div>
      </footer>
    </div>
  );
}
