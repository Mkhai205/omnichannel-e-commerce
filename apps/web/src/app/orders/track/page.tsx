'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isTracked, setIsTracked] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    { id: 1, question: 'When will my order arrive?' },
    { id: 2, question: 'Can I change my delivery address?' },
    { id: 3, question: 'How do I return an item?' },
  ];

  const productRecommendations = [
    {
      id: 1,
      name: 'OmniType Mechanical Keyboard',
      price: '$159.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEadrswLDG_PVlIA0Gg_3m6Y5MUBdnYvtO41KwOSrrYvjUVq_6kYKSb7pNG2As2tEH0hiJYu8wa4QShxm7juqDxAS6c2aOV2g8Pf89T0vpzLbmhHe0iIAGplFBz1wofklAkeOKJe2e2X3h8c4IoHtB1_ywgiRHug_prGI77dGk8RiRksjoY22mHE3XIXr0dEcqmz-4JKM_4w0uhH1F5YtzhgChOOP_QfZmFMHCOmgHQB5zHG6PZOOQWesVMIbCTAMcH7OgQn2yPv0',
      tag: 'NEW',
    },
    {
      id: 2,
      name: 'OmniView 4K Curved Display',
      price: '$499.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI0vKe1QTHjt7bjsEiZnkqKPv4BsBfopxO19GOY4PxRPJ3iIKiFBBi2qJvrwJLFOqOcnLcAq-rcyuJWw64ipaDCuY-9FvnN63teuvYDrYqaUWaiuHGJTMzeHPjVQ0VybkpgxvzA6_se907DODXMKo8JHNn2yy2fdKuDBfDTd5-TfV1lTuSSInG-9EGiL-dSoRMHFBnUwr2UJAy9v0vvMogzo_BACFIn70cNV1JVvB9JRxgjTPVslnALNrFDTZoMpg7SLe9_GoeAvc',
    },
    {
      id: 3,
      name: 'FastCharge Hub Duo',
      price: '$45.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjDBjV-G9_jVNs41utx6DzMn5pngrhki_Wj8AhNuOYwFAHcmqYtlmyN5XzuhVm1h8beb_NxSLNHEQ1KwSyRnKWQy93yWF0o0vtmmz85lsv2LIERUBrYFCzKQoGSdrhQu7OThljsQ7cAuAWYs0ooN3seqkW4D0wnupJd5VTZ4a3Ey781qXwdeIClcg7ap4QB8YNR8VFXyzwSu6BHzgGiNEwVxYOiTuqS6k6qKiR-NnbNi3X27kn3Yw86_0PZnUyxaBySiIVGgzCgQE',
    },
    {
      id: 4,
      name: 'OmniSleeve Pro Case',
      price: '$35.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYoPQAErdamRwMcToCeVOIDuF0mhwSvEAH4dt35O9Qa9R72wlTum2YWjBkt_HTz41_Pt3Cz_KFrsTHqiD3sq9jdbWY9_eBVOlsnQpTyCxrF0O54le4iDWPEIZuf4v3XbeUHr-IbC7eA8Hj7oQGuegcR6hyfGjAM-xU-8vTgoBGPm2j15cXzQAUrJ0_R24Xl9LZ8qyjQOzuZE0yCt9WqDaPTZaIXF3JVot0rxltqqEtd-e6H-zWpidhN4GKjRlvhQk9zu2YvA4Z7S0',
    },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && email) {
      setIsTracked(true);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-manrope antialiased">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              OmniShop
            </span>
            <div className="hidden md:flex gap-6">
              <a className="text-slate-600 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors" href="#">
                Shop
              </a>
              <a className="text-slate-600 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors" href="#">
                Collections
              </a>
              <a className="text-slate-600 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors" href="#">
                Journal
              </a>
              <a className="text-slate-600 dark:text-slate-400 hover:text-[#219bf6] dark:hover:text-[#219bf6] transition-colors" href="#">
                Archive
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all">
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">search</span>
            </button>
            <button className="p-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all">
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">shopping_cart</span>
            </button>
            <button className="p-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all bg-[#219bf6] dark:bg-[#219bf6]/70">
              <span className="material-symbols-outlined text-white">person</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Hero Section: Tracking Interface */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: Input Card */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col justify-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2 text-on-surface">
              Track Your Order
            </h1>
            <p className="text-on-surface-variant mb-8 font-body">
              Enter your details to see the current status of your shipment.
            </p>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5 ml-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. OMS-992834"
                  className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 rounded-full transition-all mt-4 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
              >
                <span>Track Status</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </div>

          {/* Right: Status Display */}
          {isTracked && (
            <div className="lg:col-span-7 bg-primary text-on-primary p-8 md:p-12 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    In Transit
                  </span>
                  <span className="text-white/60 text-sm">Order #OMS-992834</span>
                </div>
                <h2 className="font-headline text-5xl font-extrabold mb-4">Arriving Oct 24</h2>
                <p className="text-primary-fixed text-lg max-w-md">
                  Your package is currently being processed at the regional distribution center in Chicago.
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-8 items-end">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-fixed font-bold mb-1">
                    Carrier
                  </p>
                  <p className="font-semibold text-xl">Omni Logistics Express</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-fixed font-bold mb-1">
                    Tracking Number
                  </p>
                  <p className="font-semibold text-xl">TRK-8820-XL-09</p>
                </div>
                <button className="ml-auto bg-white text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline Section */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-low rounded-xl p-8 md:p-10">
              <h3 className="font-headline text-2xl font-bold mb-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">route</span>
                Shipment Journey
              </h3>
              <div className="relative space-y-12 ml-4">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>

                {/* Milestone 4 (Delivered - Inactive) */}
                <div className="relative flex items-start gap-8 opacity-40">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-4 border-surface-container-low">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Delivered</h4>
                    <p className="text-sm text-on-surface-variant">Estimated delivery by October 24, 2023</p>
                  </div>
                </div>

                {/* Milestone 3 (In Transit - ACTIVE) */}
                <div className="relative flex items-start gap-8">
                  <div className="absolute left-[-4px] top-[-4px] w-[48px] h-[48px] bg-primary/10 rounded-full animate-pulse"></div>
                  <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container-low shadow-lg shadow-primary/30">
                    <span
                      className="material-symbols-outlined text-white text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_shipping
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-primary">In Transit</h4>
                      <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                        Current
                      </span>
                    </div>
                    <p className="text-on-surface font-medium">Chicago Regional Hub, IL</p>
                    <p className="text-xs text-on-surface-variant mt-1">October 21, 2023 — 02:45 PM</p>
                  </div>
                </div>

                {/* Milestone 2 (Processed) */}
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center border-4 border-surface-container-low">
                    <span
                      className="material-symbols-outlined text-on-secondary-container text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Order Processed</h4>
                    <p className="text-on-surface">International Export Center, HK</p>
                    <p className="text-xs text-on-surface-variant mt-1">October 19, 2023 — 11:20 AM</p>
                  </div>
                </div>

                {/* Milestone 1 (Placed) */}
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center border-4 border-surface-container-low">
                    <span className="material-symbols-outlined text-on-secondary-container text-[20px]">shopping_cart</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Order Placed</h4>
                    <p className="text-on-surface">OmniShop Online Store</p>
                    <p className="text-xs text-on-surface-variant mt-1">October 18, 2023 — 09:12 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="font-headline text-2xl font-bold mb-6">Delivery FAQ</h3>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest p-6 rounded-xl hover:bg-surface transition-colors cursor-pointer group"
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-on-surface">{item.question}</h4>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        {expandedFaq === item.id ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                    {expandedFaq === item.id && (
                      <p className="text-on-surface-variant text-sm mt-4 leading-relaxed">
                        We're here to help! For more information, please contact our customer support team at support@omnishop.com
                        or visit our FAQ page.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
              <h3 className="font-headline text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-6 mb-8">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      alt="product"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmv2fknbN4jE8PNJuXOaSLRFShfEpUUYZYq5fmmSZ-h5eT9_GYW-80qFjQ2dxSCYcMo9gTDKfii3PKKN6LU7QOO09WEbPW_FfpQyeJSlJWBJ8SkkidtMz9gZeNUAtIQAS6PfLnUeDb5TKYnq6GziAc5XW2NBOWhMk1MnNGbYaOeWvGfmXBItyrB3tCW6KT5YChEhU6a0k2SlzJ92hibFLs7e4kT7uvUL8kgjB4CcCXQDpWYRTp8HcA-ravcb7jRuLNaiC9X39KWBw"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <p className="font-bold text-sm leading-tight">OmniWatch Series 7</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Space Gray / 44mm</p>
                    </div>
                    <p className="font-manrope font-bold text-primary">$399.00</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      alt="product"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKQRbX2y6d4tNC2o5r1i4y5lfmYb-xvXbsBhk2_isvEBL8WqnpLLstxL9KQJTVnVl7RABovnfuM2DPm787TPnzXI-WZp_kGfNe-BvZiE1fCjRs7mTKj_fLjgobw4U2CJy0NblNEMwpIpBmdrr17UI0dAcR8653dYyE6fZTrgHA7O02ySR1nqnu26a_qBjnfy4s37vU3agmo9sAyAazNM1pXs6Kt4J8hB0sUnLZrPonIA7V9RhcoqsmO0YAzvrbDeSDVZg65s8s9-k"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <p className="font-bold text-sm leading-tight">OmniPods Studio</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Noise Cancelling</p>
                    </div>
                    <p className="font-manrope font-bold text-primary">$249.00</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-manrope font-semibold">$648.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-primary font-bold uppercase tracking-tighter">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Tax</span>
                  <span className="font-manrope font-semibold">$51.84</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-outline-variant/20">
                  <span className="font-bold">Total Paid</span>
                  <span className="text-2xl font-extrabold font-manrope text-on-surface">$699.84</span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
                Download Invoice
              </button>
            </div>
          </aside>
        </div>

        {/* Recommendations */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-2 block">
                Curated for You
              </span>
              <h2 className="font-headline text-3xl font-extrabold">Complete Your Tech Kit</h2>
            </div>
            <button className="text-primary font-bold flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {productRecommendations.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden mb-4 relative">
                  <img
                    alt="product"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={product.image}
                  />
                  {product.tag && (
                    <span className="absolute top-4 left-4 bg-tertiary-container text-white text-[10px] font-bold px-2 py-1 rounded">
                      {product.tag}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                <p className="text-primary font-manrope font-bold mt-1">{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]">
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5" href="#">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-medium font-manrope uppercase tracking-wider mt-1">
            Shop
          </span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5" href="#">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium font-manrope uppercase tracking-wider mt-1">
            Search
          </span>
        </a>
        <a className="flex flex-col items-center justify-center bg-[#219bf6] dark:bg-[#219bf6]/60 text-white rounded-xl px-3 py-1.5" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
          <span className="text-[10px] font-medium font-manrope uppercase tracking-wider mt-1">
            Orders
          </span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1.5" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium font-manrope uppercase tracking-wider mt-1">
            Profile
          </span>
        </a>
      </nav>

      {/* Footer Area */}
      <footer className="bg-surface-container-low pt-20 pb-32 md:pb-20 border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-primary mb-6 block">OmniShop</span>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Redefining the digital shopping experience through curated technology and editorial design.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">public</span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">photo_camera</span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">alternate_email</span>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">
              Explore
            </h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Collections
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Best Sellers
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Gift Guides
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Omni Rewards
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">
              Customer Care
            </h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Shipping &amp; Returns
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Order Tracking
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Size Guide
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">
              Newsletter
            </h5>
            <p className="text-sm text-on-surface-variant mb-4">
              Join our list for exclusive editorial content and early access.
            </p>
            <div className="flex gap-2">
              <input
                className="bg-white border-none rounded-full px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary"
                placeholder="Email address"
                type="email"
              />
              <button className="bg-on-surface text-surface px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline font-medium">
          <p>© 2023 OmniShop. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Settings</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
