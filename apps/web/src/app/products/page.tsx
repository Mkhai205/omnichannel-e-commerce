'use client';

import { useState } from 'react';

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Noise Cancelling',
    brand: 'Sony',
    price: 8490000,
    originalPrice: 9500000,
    rating: 4.9,
    reviews: 124,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCroEb3hXfeikhxtLwzZSFl5q8h4JlbO7toL0-NjBBzkH4pyrmgA4a060V1NFXg80tuiMjmxWj9cNOTlqQoqn5w4O_zLT0PJO-dzaHnFoL9XeFzViDEkAjzO1CVv7okW53_zBaeiofSgqh_aofJTCVSAN51Il0O2t15SXYNH9BHLHMCjYD6G97fCNQtlfjbHLf8JeKxTSHm-YXjlSKchI4ncZCskKFfMwRsSN7W3OWulF7zYM8_nv2NCHYF1vfkaNQFYKh9nDx2lhg',
    badge: 'Sale',
    badgeColor: 'bg-tertiary',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS',
    brand: 'Apple',
    price: 11290000,
    rating: 5.0,
    reviews: 86,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUetNHt193PYgqs1PNrJKLrdAoSUuC3AkQmSqWzQ6ByCAgAvtXdDtsxt9e5MpVOpddPcKQAc0nkiTLaunlyX_F35_8PFEqskNu8ntYEizBHEbaaGnYpx95BLCkmxRPeyHSeuk-kawxFl6OvAF3XuxfAtjTTreK12O4c0zkIda--bkssCInNq-QD0-n8h0WmvNyHcBgI6Jilxn0y8ESpjS72svkyew0eeHzfgeiT3uZUX1RsxojctTxp8cqX5riqH5XAT9WeQr4HIQ',
    badge: 'New',
    badgeColor: 'bg-secondary-container',
  },
  {
    id: 3,
    name: 'Fujifilm X-T5 Mirrorless Camera',
    brand: 'Fujifilm',
    price: 43990000,
    rating: 4.8,
    reviews: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJgvAGvgSKY2DQg1kcfe8NC3D01VYhwyjwZfJ6x1tiBOGB236oYuEQ6U1sLylVnV8l3NjJeE4EAIvShVFr6Lmus7tz2EzC6WCR9GU0neB2UE-lmSLQttA4MNhIkAOi4ZtNIyAr070oUv87vzriJdTtxGkkCW5DZMottjFaOIuVFlCUtW9gdDzzFHU6WYQcvMNv2JXXO_pVBPWX6ZzBcVNWjx7eHznD9LhQMXP5Naa2qQXKcCvtjrtcafT1R5O5Q0NIAmVSXcoSRQ',
  },
  {
    id: 4,
    name: 'Marshall Emberton II Portable',
    brand: 'Marshall',
    price: 4250000,
    originalPrice: 4800000,
    rating: 4.9,
    reviews: 215,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfE8kh5bgO4mmigCJdROhbs64t5RE8P6dzpAYQs9gtQXaySVDvB0BlUPlP-azgU_sINbm3_0XUdF9hZnd_48ONBQuWAyfGNSXL-X2e0z219H7hn7o5eCqqYaSPPydMI6MeNZLXz-M6COlsWEKvR0uq_p2kNfTbryOF3OuqNAywv2HVAHZ9H9c5bV_o2a3FTeoXbZn7iP9aYxq-5Ypifcd_yLFiPmnMpAKxe42aLKKXkClztyzwyWz9SUP40ZbRuQrw-ngVUnqJzvM',
    badge: 'Hot',
    badgeColor: 'bg-tertiary',
  },
  {
    id: 5,
    name: 'Logitech MX Master 3S Wireless',
    brand: 'Logitech',
    price: 2490000,
    rating: 4.7,
    reviews: 512,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYnK3PtRQ78V4f0hGx-oy5Gf6Zdjf6TjJYT-LYFLOVt7sl2u6_OyRrrHRSe-aOWUaufHy3veTEu1xb5MJUGiaBMS9mYU9p6WqAl6DydFJHbpCthQW8GkkPl8hUtaqGwgEaxYVXvbWR_wYl1bZZ4m-KTO4m6t0lGnQJ6jri1N-gj7LfDzZNsWc57o7RFTba1-PQjCRBiVPJsbh9YzVeAfY8ElAqBF13YXgsrarVWyYXhbYMW4QDoDxORKUzbl5KPoBnEYBdLnuCYA8',
  },
  {
    id: 6,
    name: 'Samsung T7 Shield 2TB SSD',
    brand: 'Samsung',
    price: 3850000,
    rating: 4.8,
    reviews: 33,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO1_DdAzh2vl5GDZ-WK8h7GukdFFHD5uUlWdp80pfLB4YPi2_vDMTewY0d-iHBXH5ugJyXzqAVsHv0Ecr_HB8YtFzbp6St93CFCNwCiWXmwGEy1S1jou-n6qi_A09lhRsuvcjDLQ1CLk67-lpPHkQwuasvOQgH8Ld0K9XxU-G_a9Nc-IQJOD9-DUqLuPBOdYzVoxkfJ9n11M_Wn1oT17kQNFHxVGgFd0cYswC71qsgUgbhoPSNsa4HfX_526M9rDMyXqJEOmVfvY8',
  },
];

const CATEGORIES = [
  { name: 'Điện tử' },
  { name: 'Phụ kiện', selected: true },
  { name: 'Gia dụng' },
  { name: 'Âm thanh' },
  { name: 'Máy ảnh' },
];

const BRANDS = [
  { name: 'Apple' },
  { name: 'Sony' },
  { name: 'Samsung', selected: true },
  { name: 'Logitech' },
  { name: 'Dell' },
  { name: 'Marshall' },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <>
      {/* TopNavBar Shell */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl font-['Manrope'] antialiased">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1920px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            OmniShop
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              href="#"
            >
              New Arrivals
            </a>
            <a
              className="text-[#219bf6] dark:text-[#219bf6] font-semibold border-b-2 border-[#219bf6] dark:border-[#219bf6] pb-1"
              href="#"
            >
              Curated
            </a>
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              href="#"
            >
              Collections
            </a>
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              href="#"
            >
              Journal
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                className="bg-surface-container-high border-none rounded-full py-2 px-6 w-64 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Tìm kiếm sản phẩm..."
                type="text"
              />
            </div>
            <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-8 pt-28 pb-20 flex gap-8">
        {/* SideNavBar Shell */}
        <aside className="hidden lg:block h-full w-72 sticky top-24 pb-8 font-['Inter'] text-sm font-medium">
          <div className="flex flex-col gap-6 px-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Filters</h2>
              <p className="text-xs text-slate-500 mb-4">Refine your selection</p>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <span className="material-symbols-outlined text-lg">category</span>
                <span>Danh mục</span>
              </div>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.name}
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer group transition-all ${
                      cat.selected
                        ? 'bg-white dark:bg-slate-800 text-[#219bf6] dark:text-[#219bf6] shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <input
                      defaultChecked={cat.selected}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                      type="checkbox"
                    />
                    <span
                      className={`${
                        cat.selected ? 'font-semibold' : 'text-slate-600 group-hover:translate-x-1'
                      } transition-transform`}
                    >
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                <span className="material-symbols-outlined text-lg">payments</span>
                <span>Khoảng giá (VND)</span>
              </div>
              <input
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                type="range"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0đ</span>
                <span>50.000.000đ</span>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2 pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Thương hiệu</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.name}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                      brand.selected
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-outline-variant/30 hover:border-primary/50'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Banner */}
            <div className="mt-4 rounded-xl overflow-hidden relative group aspect-[4/5] bg-primary">
              <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
              <img
                alt="Summer Sale"
                className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd7nIai9wbFUJAMYhppCq1RTLVCyRyL6W2pCPOKZlHiJbmK4_o4g5N5wVWYKyNrgDxG7XOgQmhlsX-uZMooYV4mJ1qPhDec4x8eFhoB1L6OK8AmU_HZlwoFwL1v2ovtTmmGEWaTAy8kUL8TnvSjRgid5jOULz7j1KQCfgEuAT14p_bAyV3ZBohst5WdfueT2YW8aVsxkDhEHgn_PpXPf9gETi1Q3rvKNg-Qbr5fpAlSX_9hPpE0F7rExbKZOi88I1n3NpzBoFJzX0"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Seasonal Promo</p>
                <h3 className="text-xl font-headline font-extrabold leading-tight mb-2">
                  Ưu đãi mùa hè
                </h3>
                <p className="text-xs opacity-90 mb-4">Giảm đến 40% cho các thiết bị di động</p>
                <button className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold w-full">
                  Khám phá ngay
                </button>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 hover:text-error transition-colors text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <section className="flex-1">
          {/* Header & Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">
                Tất cả sản phẩm
              </h1>
              <p className="text-on-surface-variant text-sm">Hiển thị 1-12 của 144 kết quả</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-surface-container rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all ${
                    viewMode === 'list'
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container border-none rounded-lg text-sm font-medium py-2.5 px-4 focus:ring-2 focus:ring-primary/20 min-w-[180px]"
              >
                <option value="latest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="group bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-variant/30">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={product.image}
                  />
                  {product.badge && (
                    <div
                      className={`absolute top-4 left-4 ${product.badgeColor} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                    >
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                  >
                    <span
                      className={`material-symbols-outlined transition-colors ${
                        favorites.includes(product.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                      }`}
                      style={{ fontVariationSettings: favorites.includes(product.id) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                    {product.brand}
                  </span>
                  <h3 className="text-base font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-4">
                    <span
                      className="material-symbols-outlined text-amber-400 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-xs font-bold text-on-surface">{product.rating}</span>
                    <span className="text-xs text-on-surface-variant">({product.reviews})</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="text-xs text-on-surface-variant line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-headline font-extrabold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container transition-all active:scale-95">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
              3
            </button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant font-bold">
              12
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <section className="max-w-[1920px] mx-auto px-8 mb-20">
        <div className="bg-primary/5 rounded-3xl p-12 md:p-20 text-center flex flex-col items-center">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
            Stay Connected
          </span>
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mb-6">
            Không bỏ lỡ ưu đãi đặc biệt nào!
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">
            Đăng ký nhận tin để nhận thông báo về các bộ sưu tập mới nhất và ưu đãi độc quyền dành
            riêng cho bạn.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
            <input
              className="flex-1 bg-white border-none rounded-full py-4 px-8 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="Địa chỉ email của bạn"
              type="email"
            />
            <button
              className="bg-primary text-white font-bold px-10 py-4 rounded-full hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
              type="submit"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      {/* Footer Shell */}
      <footer className="w-full py-12 bg-slate-100 dark:bg-slate-900 font-['Inter'] text-xs tracking-wide uppercase">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-[1920px] mx-auto">
          <div className="font-['Manrope'] font-black text-slate-400 dark:text-slate-600 text-2xl">
            OmniShop
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="text-slate-500 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-slate-500 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-slate-500 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors"
              href="#"
            >
              Shipping
            </a>
            <a
              className="text-slate-500 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors"
              href="#"
            >
              Returns
            </a>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-medium">
            © 2024 OmniShop. The Digital Curator.
          </div>
        </div>
      </footer>
    </>
  );
}
