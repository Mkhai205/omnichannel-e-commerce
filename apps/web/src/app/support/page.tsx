export default function SupportPage() {
  return (
    <div className="bg-surface text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl font-['Manrope'] antialiased">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">OmniShop</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Shop
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Categories
            </a>
            <a className="text-[#219bf6] dark:text-[#219bf6] border-b-2 border-[#219bf6] dark:border-[#219bf6] pb-1" href="#">
              Help
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Orders
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:opacity-80 active:scale-95">
              <span className="material-symbols-outlined">person</span>
            </button>
            <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:opacity-80 active:scale-95 relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-primary-container/10"></div>
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface mb-8 tracking-tight">
              Chung toi co the giup gi cho ban?
            </h1>
            <div className="relative group max-w-2xl mx-auto">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-2xl">search</span>
              <input
                className="w-full pl-14 pr-6 py-5 rounded-full bg-surface-container-lowest border-none shadow-xl focus:ring-2 focus:ring-primary transition-all text-lg font-body placeholder:text-outline-variant"
                placeholder="Tim kiem huong dan, cau hoi thuong gap..."
                type="text"
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-on-surface-variant text-sm font-label">Xu huong tim kiem:</span>
              <a className="text-primary text-sm font-label hover:underline" href="#">
                Theo doi don hang
              </a>
              <a className="text-primary text-sm font-label hover:underline" href="#">
                Huy don
              </a>
              <a className="text-primary text-sm font-label hover:underline" href="#">
                Hoan tien
              </a>
            </div>
          </div>
        </section>

        {/* Main Categories & Support Request Form Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content: Categories & FAQ */}
            <div className="lg:col-span-7 space-y-16">
              {/* Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">inventory_2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quan ly don hang</h3>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Theo doi hanh trinh don hang va cap nhat thong tin van chuyen.
                  </p>
                </div>
                <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center mb-6 text-tertiary">
                    <span className="material-symbols-outlined text-3xl">sync_alt</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Doi tra &amp; Hoan tien</h3>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Chinh sach doi tra trong 30 ngay va quy trinh hoan tra tien nhanh.
                  </p>
                </div>
                <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center mb-6 text-on-primary-fixed-variant">
                    <span className="material-symbols-outlined text-3xl">payments</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thanh toan &amp; Thue</h3>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Quan ly phuong thuc thanh toan va tra cuu hoa don VAT.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-extrabold mb-8">Cau hoi thuong gap</h2>
                <div className="space-y-4">
                  <details className="group bg-surface-container-low rounded-xl overflow-hidden" open>
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                      <span className="font-bold text-lg">Lam cach nao de theo doi don hang cua toi?</span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="px-6 pb-6 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/10 pt-4">
                      Ban co the theo doi don hang bang cach dang nhap vao tai khoan, truy cap muc "Don
                      hang cua toi" va chon "Theo doi van chuyen". Mot ma van don cung da duoc gui den
                      email cua ban ngay khi don hang duoc xuat kho.
                    </div>
                  </details>
                  <details className="group bg-surface-container-low rounded-xl overflow-hidden">
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                      <span className="font-bold text-lg">Toi co the thay doi dia chi nhan hang sau khi dat khong?</span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="px-6 pb-6 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/10 pt-4">
                      Dia chi chi co the thay doi neu don hang chua chuyen sang trang thai "Dang dong
                      goi". Vui long lien he hotline ngay lap tuc neu ban can ho tro thay doi thong tin.
                    </div>
                  </details>
                  <details className="group bg-surface-container-low rounded-xl overflow-hidden">
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                      <span className="font-bold text-lg">Bao lau thi toi nhan duoc tien hoan lai?</span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="px-6 pb-6 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/10 pt-4">
                      Sau khi chung toi nhan duoc hang tra ve va kiem tra dieu kien san pham, tien se duoc
                      hoan vao tai khoan cua ban trong vong 3-7 ngay lam viec tuy thuoc vao ngan hang phat
                      hanh the.
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Request Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-surface-container-lowest rounded-2xl p-8 shadow-2xl border border-outline-variant/10">
                <h2 className="text-2xl font-extrabold mb-2">Gui yeu cau ho tro</h2>
                <p className="text-on-surface-variant text-sm mb-8">
                  Chung toi se phan hoi yeu cau cua ban trong vong 24 gio lam viec.
                </p>
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Ho ten</label>
                      <input
                        className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Nguyen Van A"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Email</label>
                      <input
                        className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="example@email.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Chu de can ho tro</label>
                    <select className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary transition-all appearance-none">
                      <option>Van de ve thanh toan</option>
                      <option>Van chuyen &amp; Giao hang</option>
                      <option>Chat luong san pham</option>
                      <option>Yeu cau hoan tien</option>
                      <option>Khac</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Ma don hang (neu co)</label>
                    <input
                      className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="#OMN-123456"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Tin nhan</label>
                    <textarea
                      className="w-full px-4 py-3 bg-surface-container-high rounded-lg border-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      placeholder="Mo ta chi tiet van de ban dang gap phai..."
                      rows={4}
                    ></textarea>
                  </div>
                  <button
                    className="w-full py-4 bg-primary text-on-primary font-bold rounded-full transition-all hover:bg-primary-container shadow-lg shadow-primary/20 active:scale-[0.98]"
                    type="button"
                  >
                    Gui yeu cau ngay
                  </button>
                </form>
                <div className="mt-10 pt-8 border-t border-outline-variant/10">
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">contact_support</span>
                    Lien he truc tiep
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span className="text-sm font-body">Hotline: 1900 888 666 (8:00 - 22:00)</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span className="text-sm font-body">Email: support@omnishop.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter / Community Section */}
        <section className="bg-surface-container-low py-16 px-6">
          <div className="max-w-7xl mx-auto rounded-3xl bg-primary py-12 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div className="relative z-10 text-white max-w-xl">
              <h2 className="text-3xl font-extrabold mb-4">Can giai dap nhanh chong?</h2>
              <p className="text-white/85 leading-relaxed">
                Gia nhap cong dong OmniShop de nhan duoc su ho tro tu hang ngan nguoi dung khac va
                cap nhat meo mua sam thong minh.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <button className="w-full md:w-auto px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-slate-50 transition-all">
                Tham gia cong dong
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-slate-900 dark:text-white text-xl">OmniShop</div>
            <p className="font-['Manrope'] text-sm text-slate-500 max-w-xs">
              © 2024 OmniShop. The Digital Curator. Nang tam trai nghiem mua sam ky thuat so cua ban.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-slate-500 hover:text-[#219bf6] transition-colors text-sm font-body" href="#">
              Privacy Policy
            </a>
            <a className="text-slate-500 hover:text-[#219bf6] transition-colors text-sm font-body" href="#">
              Terms of Service
            </a>
            <a className="text-slate-500 hover:text-[#219bf6] transition-colors text-sm font-body" href="#">
              Accessibility
            </a>
            <a className="text-slate-500 hover:text-[#219bf6] transition-colors text-sm font-body" href="#">
              Contact Us
            </a>
          </div>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:text-[#219bf6] transition-all" href="#">
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:text-[#219bf6] transition-all" href="#">
              <span className="material-symbols-outlined text-xl">language</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Live Chat Button */}
      <div className="fixed bottom-8 right-8 z-100">
        <button className="group flex items-center gap-3 bg-primary text-on-primary pl-4 pr-6 py-4 rounded-full shadow-2xl hover:bg-primary-container transition-all active:scale-95">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
          <span className="font-bold tracking-tight">Tro chuyen truc tiep</span>
        </button>
      </div>
    </div>
  );
}