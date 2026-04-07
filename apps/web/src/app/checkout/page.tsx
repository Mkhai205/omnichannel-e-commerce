'use client';

import { useState } from 'react';

const CHECKOUT_STEPS = [
  { id: 1, label: 'Shipping', icon: 'local_shipping' },
  { id: 2, label: 'Delivery', icon: 'local_shipping' },
  { id: 3, label: 'Payment', icon: 'payments' },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'OmniSound Gen 2 Wireless Headphones',
    variant: 'Matte Black',
    quantity: 1,
    price: 299.0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'OmniWatch Series X Titanium',
    variant: '44mm / Midnight',
    quantity: 1,
    price: 449.0,
    image: 'https://images.unsplash.com/photo-1544117518-2b462f588bbc?q=80&w=1000&auto=format&fit=crop',
  },
];

const SUBTOTAL = 748.0;
const TAX = 63.58;
const TOTAL = SUBTOTAL + TAX;

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postal: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-headline">
            OmniShop
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Shop
            </a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Collections
            </a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Journal
            </a>
          </nav>
          <div className="flex items-center space-x-5">
            <button className="text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="text-slate-500 hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>
            </button>
            <button className="text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 md:px-12 max-w-screen-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0"></div>

            {CHECKOUT_STEPS.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20 transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`mt-3 text-xs font-semibold uppercase tracking-widest font-headline transition-colors ${
                    currentStep >= step.id ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-8 space-y-10">
            {/* Shipping Information Section */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline">
                    Shipping Information
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Digital Avenue"
                    className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="San Francisco"
                      className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="California"
                      className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      placeholder="94103"
                      className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="bg-surface-container-high px-4 flex items-center rounded-l-xl text-on-surface-variant text-sm border-r border-outline-variant/20">
                      +1
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 000-0000"
                      className="w-full bg-surface-container-high border-none rounded-r-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* Payment Section */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline">
                    Payment Method
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    All transactions are secure and encrypted.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant/20 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-5 h-5 rounded-full border-4 ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-white'
                          : 'border-outline-variant bg-white'
                      }`}
                    ></div>
                    <span className="font-semibold text-on-surface">Credit or Debit Card</span>
                  </div>
                </button>

                {paymentMethod === 'card' && (
                  <div className="p-6 bg-surface-container-low rounded-2xl space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-white border border-outline-variant/30 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">lock</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full bg-white border border-outline-variant/30 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full bg-white border border-outline-variant/30 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full flex items-center space-x-4 p-5 rounded-2xl border transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant/20 bg-white hover:border-outline'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-4 ${
                      paymentMethod === 'paypal'
                        ? 'border-primary bg-white'
                        : 'border-outline-variant bg-white'
                    }`}
                  ></div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-on-surface">PayPal</span>
                    <span className="text-xs text-on-surface-variant">Secure payment</span>
                  </div>
                </button>
              </div>
            </section>

            {/* Trust Badges & Policies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                <h4 className="font-bold text-sm font-headline">Secure Payment</h4>
                <p className="text-[11px] text-on-surface-variant">256-bit SSL encryption</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
                <span className="material-symbols-outlined text-primary text-2xl">assignment_return</span>
                <h4 className="font-bold text-sm font-headline">30-Day Returns</h4>
                <p className="text-[11px] text-on-surface-variant">Easy, no-hassle returns</p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center text-center space-y-2">
                <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
                <h4 className="font-bold text-sm font-headline">24/7 Support</h4>
                <p className="text-[11px] text-on-surface-variant">Always here to help you</p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <section className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline mb-8">
                  Order Summary
                </h2>

                {/* Products */}
                <div className="space-y-6 mb-8">
                  {MOCK_PRODUCTS.map((product) => (
                    <div key={product.id} className="flex space-x-4">
                      <div className="w-20 h-20 bg-surface-container-low rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-bold text-on-surface font-headline leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">{product.variant}</p>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-xs text-on-surface-variant">
                            Qty: {product.quantity}
                          </span>
                          <span className="font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-8 border-t border-outline-variant/20 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="font-medium text-on-surface">${SUBTOTAL.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="font-medium text-tertiary">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Estimated Tax</span>
                    <span className="font-medium text-on-surface">${TAX.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <span className="text-lg font-bold text-on-surface font-headline">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-primary font-headline">
                        ${TOTAL.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-on-surface-variant">including VAT</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-10 bg-primary hover:bg-primary-container text-white py-5 rounded-full font-bold text-lg tracking-tight transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center space-x-3">
                  <span>Place Order Now</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                <p className="mt-6 text-center text-[11px] text-on-surface-variant leading-relaxed">
                  By placing your order, you agree to OmniShop's{' '}
                  <a href="#" className="underline hover:text-primary">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                  .
                </p>
              </section>

              {/* Promo Code Box */}
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline mb-4">
                  Promo Code
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-grow bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button className="bg-on-surface text-white px-6 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-white dark:bg-slate-950 z-50 rounded-t-3xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 transition-all duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-medium font-headline uppercase tracking-widest mt-1">
            Shop
          </span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 transition-all duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium font-headline uppercase tracking-widest mt-1">
            Search
          </span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center bg-[#219bf6] dark:bg-[#219bf6]/60 text-white rounded-2xl px-5 py-2 transition-all duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-medium font-headline uppercase tracking-widest mt-1">
            Bag
          </span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 transition-all duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium font-headline uppercase tracking-widest mt-1">
            Profile
          </span>
        </a>
      </nav>

      {/* Footer Space */}
      <footer className="bg-surface-container-low pt-16 pb-32 md:pb-16 text-center border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <p className="text-sm text-on-surface-variant font-headline font-semibold tracking-wide">
            © 2024 OmniShop. High-End Editorial E-Commerce Experience.
          </p>
        </div>
      </footer>
    </>
  );
}
