'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge: 'NEW ARRIVAL' | 'SALE' | 'HOT';
  description: string;
  images: string[];
  colors: string[];
  features: string[];
  warranty: string;
  delivery: string;
  returns: string;
  tabs: {
    description: string;
    specs: string;
    reviews: string;
  };
  relatedProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Audio-Technica ATH-M50x Premium Wireless',
  brand: 'Audio-Technica',
  price: 299,
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  badge: 'NEW ARRIVAL',
  description:
    'Experience studio-quality sound with the freedom of wireless. The ATH-M50xBT2 delivers the same sonic performance as the legendary original with enhanced features.',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAae4VWtUWnorzmKH8Rm7yD9Cs1lbwPUYARbxh3UxeE4_TJOA9X2PlsKWBXA8BjOedGBLtrhJT2DiqAvgnFNCjSyyteJWWR-x2bLI_8BzZCk4Stb8f-n82jiulfdcBTaPXBADugdfvP9lGZL3IEoljOr1BKUUMiaTB3f0FFwu3LJ3p4LRX8H8XT0EIRsK8XWZ5Lw7JKo-8ZFTnBPLHwBn46qRmCGWRt-i9TkQ7252jOqgZ3K8lL2DFhlp7XWBwkvlly9hD9ntrcyPQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCOUsTY1GbUFebUFU4RC7QoPXiKsxUnevTywsWC-4quEvUlIs7Ek5wBXh2gQcdCP6rqYIvcfx3MriCHWRTd8V1NJdsXeJvPVP0EfoUOkmKGx_GHaCPjma0u9uQSYj9BVaBYS_sXgwNNUsdlApHpFg3yCLeCbSdtUyf47lUPwKm98vdtf-9sc9d7-PhBrAy8yv9MJSjpiEoOSFkPBhTfxgplH4JUnzHpCYU22kFnJjEfVZqBbtZ0l1OaHif_SLn2I7dg1veFwUrXFE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDvy3yJVsa_SG9iNfG2r1aj49FvQ004rjgf8I0JuK4iK-Sb3M9q8B-F2Fe0pNa0r9hzfWOOqnbN_rgeufkzd_d-MQzu-cdOuMqEpaXCGZ4KPvQB_2kapSoDrBjKtiQPI5F6ScgmajT_yZFv12ZjCJm5aMVPUqgcMM1gDkRdZWiadEiyMx1Ld-kaCRfGit21A284eeLeCvkfcxQgJ8yD15-dpR_qiV058FA6JxfxpM4hQltQLT7Mu1o1Cdrc9h9Zv0Sc2HKV7lrGe_s',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Wh9udb67tWo47DAjqDUwCYIAKqHSfbEJ2d7wjzH25hLTTKpM61e6WIY1WzuVT0kI6YV6KjrMfvj_1P4IETvCgN4uEg1UQ0BblT8enSVbhrZmXed5-Ls1-0DdOBSCp60fd7KH_L4C0WJWVoxTHN2mKBoExH-NBnmiLsv8nt6xUnLuSdaTkEzkVlFDeqTpbcrYa1wDG4w77r_KAO_GrOORBP94eLliZemHkYtaYc1nBHzT_S4931k6qjZFqugjXCeD6KfoP1qwymc',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7X-3dYlLqn9auLRB7GojersBPoRInvalGGaDoieoVMX8iSJbjoYENgMMstHVot-62dpq9HIUcxlYtylyennOv3prfvpsWlXoTVvoVxNheyEdRKPlJkl6CzcXEL_jzI_WtS2DqQXVvbR8WYUSiY6lLYySCuhcpzl_rASjncn3R-ENY26HcnBo9s2X4fTs1PurgpQ-lmIR0boYJ-2b5-Lca57QrUt-ilX_gQ74muaq79f-4bc_vFRaLIb3kCJiz3X3i42Zm18i2mhE',
  ],
  colors: ['#1e293b', '#94a3b8', '#1e3a8a'],
  features: [
    'Proprietary 45 mm large-aperture drivers for exceptional clarity.',
    'Dedicated internal headphone amp for superior high-fidelity sound.',
    'Low latency mode improves synchronicity between audio and video.',
  ],
  warranty: '12 Months Warranty',
  delivery: 'Fast Delivery 2h',
  returns: '7 Days Return',
  tabs: {
    description: `The ATH-M50xBT2 delivers the same critically acclaimed sonic performance as the original ATH-M50x professional studio headphones. Whether you're listening on your commute, in a video conference, or just relaxing at home, these headphones provide an exhilarating wireless listening experience.`,
    specs: `
      - Driver Size: 45mm
      - Frequency Response: 15Hz - 20kHz
      - Bluetooth: 5.0
      - Battery Life: 40 hours
      - Weight: 250g
    `,
    reviews: 'Customer reviews will be displayed here',
  },
  relatedProducts: [
    {
      id: '2',
      name: 'Bluetooth Pro Speaker',
      price: 189,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB5HJqLABZDcQ99az8ffduYkFNEwJklnOA9jCMXtINmk2f3qD3oJsYavtaoz3zCG--c8hyVCZ-0EKvgXmkael8ZPEP9J4Y93mkpHuHd2AZM1JMHxpmt-RkXUAytVaygHeSWORlO18YbzPv6rRwtVw5pIOGtBvdMkQFhXONQT4tBDfBLK2_mRt9WpPWeAlI8ON4jVVj0n-b97O4aufll5RZISZuz9hEIDbQSpsbm476jOwoiVqfa4VF5wZBgkzen4voeK4ngAJAsU4U',
    },
    {
      id: '3',
      name: 'In-ear Sport Headphones',
      price: 129,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCgFewTE1UJhxsv7ZZ5W2EySxFHVw3vqtX03cJO8h0rsoGmAugxGwMQ5X-Nc8HGaKOxSHQN0TvTPzcKv0Ma7Y_zU4jvZH3H5jg3XAOcX8iWCRj1YWMbXDTsbxR0sNQY7snPXMgDO2iKU0zpXikY9ZkUZSp4O41L0w5XoB5DjFDCSrkkx7g2T6LbjrS53B0TxNO9LH0W-JRpWJLA9RidHSkqo9sC__5yOn5wG4UYFLTgbd8ih_xOdfR3IUgPBLLdZlLFPUbzKRfiKbU',
    },
    {
      id: '4',
      name: 'Premium Wooden Stand',
      price: 75,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoN06odvt6UkULxKWt9ao5HegF4l3W-AWakIuquG_EfznejNblcRHVSFBjX9yHzxlqB9VAcEAYAQUG9t5TbuXw0tgdqxkKNzq8q_8M2IfWjYcBhvnVOUIDGqD7XpiJaAp2rkeJ2TsyJ8MYfDmnn2oH4ryvE0vlZXNMYz2jzHb3-VHa2asj7omt4csKcmrTCyibRggPkABaMRw-cM4gUlSnZFE4Z4GYOHMZWW-XUfH8J7RwvgXV-pJp0wbR7moECxCI_ZeUoF3DIY',
    },
    {
      id: '5',
      name: 'Durable USB-C Pro Cable',
      price: 25,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSOm5qRR6be9gmfjgCodG_RVFPBi_ykwvXKpAh-OEN4hsMPlu589Eluf56eILj3HP0K19TXmA7z-t8tIZgJo7r7UhffAji6FFRFR_I68ZDVChFFWU64IGnALwWQQYED8I2IhPtDer1O2jpBjlyF9ufiO8BBpp8scyEG3Qw98Z540LE8FxwWKYFZ3uw__6sZG_Qe3eRSFrNpwTrJH26WC6I-0qSrCwLWk6gUXN8jC3LuGDNwNRzS5GTpfOHF_b7Jr4DqbLnJqbXmyg',
    },
  ],
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockProduct;
  const [mainImage, setMainImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const handleQuantityChange = (value: number) => {
    if (value > 0) setQuantity(value);
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Manrope'] antialiased">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 w-full max-w-[1920px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">OmniShop</div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-[#219bf6] dark:text-[#219bf6] font-semibold transition-colors" href="#">
              Shop
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors" href="#">
              Categories
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors" href="#">
              Deals
            </a>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-high rounded-full px-4 py-2 w-64">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-on-surface" placeholder="Search..." type="text" />
            </div>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <button className="active:scale-95 duration-200 hover:text-[#219bf6]">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
              <button className="active:scale-95 duration-200 hover:text-[#219bf6]">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-label text-sm text-on-surface-variant/70">
          <a className="hover:text-primary transition-colors" href="#">
            Home
          </a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">
            Audio
          </a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-medium">{product.name}</span>
        </nav>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          {/* Left: Imagery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center p-8">
              <img alt={product.name} className="w-full h-full object-contain" src={product.images[mainImage]} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden p-2 transition-all ${
                    mainImage === idx ? 'bg-surface-container-lowest border-2 border-primary' : 'bg-surface-container-lowest hover:bg-surface-container'
                  }`}
                >
                  <img alt={`View ${idx + 1}`} className="w-full h-full object-contain" src={image} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full mb-4">
                  {product.badge}
                </span>
                <h1 className="text-4xl font-headline font-bold text-on-surface leading-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < Math.floor(product.rating) ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-on-surface-variant">({product.reviewCount} reviews)</span>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> In Stock
                  </span>
                </div>
              </div>

              <div className="text-3xl font-headline font-extrabold text-primary">${product.price.toFixed(2)}</div>

              <div className="space-y-4">
                <p className="text-on-surface-variant leading-relaxed">{product.description}</p>

                {/* Color Selector */}
                <div className="space-y-3">
                  <span className="block text-sm font-bold text-on-surface">COLOR</span>
                  <div className="flex gap-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === idx ? 'border-primary ring-2 ring-offset-2 ring-primary-fixed' : 'border-outline-variant hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center bg-surface-container rounded-full px-2">
                    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary" onClick={() => handleQuantityChange(quantity - 1)}>
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary" onClick={() => handleQuantityChange(quantity + 1)}>
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-8 rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20">
                    Add to Cart
                  </button>
                  <button className="flex-1 border-2 border-outline-variant hover:border-primary hover:text-primary font-bold py-4 px-8 rounded-full transition-all active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-1 gap-4 pt-8">
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span className="text-sm font-medium">{product.warranty}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <span className="text-sm font-medium">{product.delivery}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-primary">undo</span>
                  <span className="text-sm font-medium">{product.returns}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <section className="mb-24">
          <div className="flex border-b border-outline-variant/20 mb-10 gap-12 overflow-x-auto no-scrollbar">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'specs' && 'Technical Specs'}
                {tab === 'reviews' && `Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {activeTab === 'description' && (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-headline font-bold">Sonic Excellence Redefined</h3>
                  <p className="text-on-surface-variant leading-relaxed">{product.tabs.description}</p>
                  <ul className="space-y-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary mt-0.5">check</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-8">
                  <img
                    alt="Lifestyle"
                    className="w-full h-full object-cover rounded-xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSiuMGqlW0PSf5xWC_oaPJrw1QkdrhHuhpWFTK1LXlt3KpSGr62C2qTn_8ThVt8cZ48cym2jPPlFilEqD5MPuiKeGqpmdxZtrPrQeR2U_-zHBSm2yChyF8sOkY-rK3LwboxgTx9L4M0KgkzHuB-Gecs-FmHCwudZLbA7uxV7U3d_tLnjaLA-vQ2Viy9RZXUCxEqua8pmBuQ1lX2qoYsndNGlHKbVsWMQo_-BrRMTB5_fQSYD73YcqxSJrsE1a9TQPLhzFwMbNLB38"
                  />
                </div>
              </>
            )}
            {activeTab === 'specs' && (
              <div className="col-span-full">
                <pre className="text-on-surface-variant whitespace-pre-wrap">{product.tabs.specs}</pre>
              </div>
            )}
            {activeTab === 'reviews' && <div className="col-span-full text-on-surface-variant">{product.tabs.reviews}</div>}
          </div>
        </section>

        {/* Related Products */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Complete Your Setup</h2>
              <p className="text-on-surface-variant">Recommended accessories and similar items</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 group">
              View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.relatedProducts.map((item) => (
              <div key={item.id} className="group">
                <div className="aspect-[4/5] bg-surface-container-lowest rounded-xl mb-4 overflow-hidden relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img alt={item.name} className="w-full h-full object-contain p-6" src={item.image} />
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-primary">favorite</span>
                  </button>
                </div>
                <h4 className="font-bold text-on-surface mb-1">{item.name}</h4>
                <p className="text-primary font-headline font-bold">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-on-primary">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold mb-6 leading-tight">Elevate your audio journey.</h2>
            <p className="text-on-primary/80 text-lg mb-10">Subscribe to get exclusive early access to new releases and curated editorial content on music production.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 bg-white/10 border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/50 border-none backdrop-blur-sm"
                placeholder="Enter your email"
                type="email"
              />
              <button className="bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-opacity-90 transition-all active:scale-95">Subscribe</button>
            </form>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-6 md:px-12 bg-slate-100 dark:bg-slate-950 font-['Inter'] text-sm leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="font-['Manrope'] font-bold text-lg text-slate-900 dark:text-slate-100">OmniShop</div>
            <p className="text-slate-500 dark:text-slate-400">The world's premier destination for high-end audio and tech essentials.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Headphones
                </a>
              </li>
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Speakers
                </a>
              </li>
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Accessories
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Help</h4>
            <ul className="space-y-2">
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Shipping &amp; Returns
                </a>
              </li>
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Sustainability
                </a>
              </li>
              <li>
                <a className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Connect</h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4">© 2024 OmniShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
