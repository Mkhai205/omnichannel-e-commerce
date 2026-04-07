'use client';

import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  specs: string;
  price: number;
  quantity: number;
  image: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'OmniType Mechanical Keyboard',
      specs: 'Brown Switch • Matte Black',
      price: 249,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdQHxOBuJeOO0g6Pg72Dte55WVKvSErbranrEhbHjb135fkDi7y8LqX-7HQxdY9F73rtpidbtXX9iIOCBYGJuUDziOIVysxRZO3DGEc1OO8S-pRKP5gtHteyVX5H4O_K-XidktS-cOG7rr9CZVmFES0q7W5d7b1Tyr0jm74ba32_hUdBcC7nA-6xpYEJzWewepXtthlmu0RYzV_3ZAwa1zxxBFnVhZ15_H4ZMjKcLRBV7ax5ilMGCwl1q0GUZykdNYmC1jROVxjVI',
    },
    {
      id: '2',
      name: 'OmniCloud Studio Headphones',
      specs: 'Wireless • Space Grey',
      price: 399,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCIXC_SROkg9c6sCXBT_4RhUq8sh6fi-ODHy6BViBpoh6cQ9MfDApCwJAWG4e9PUa89RAGFceDltTlyANLUykzcGIj4GAEpwIYa1eVb70HvpCeT_lke4aeaGC8u9cqYGyIOFWLV1f0kEv2H9uVbQV2Tc65AQg1XYdYV2QOkivIuf7bTZxSNEetzd0euOWjV2QD_uBqiJKZMqTYokC1FI7UbIIJNzKNDozwGbBArhCFmt5zXNtzi5E7evgjLJ4xKLOvTzmZP_l9JIE8',
    },
  ]);

  const relatedProducts: RelatedProduct[] = [
    {
      id: 'related1',
      name: 'Braided USB-C Cable',
      price: 24,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBL2rT_CxEgVxHZeG4hgfBMJhivfhCfeytbv2LI_0U9PwmLVqhVRM7Uqa-Pnk0AR_EL_rfyq3MbTNzjGKIkCb03thC8ehbni-qMwlYWJEhq4knXAh0GVkgEL0q2r24DoVB5HgIk_wEnfOwVoTI3T5fv6XqMANasVjoo0s8tGwv00uXAYsW0qTDYHtSIXyECigFbxEESGbxxkcU_vyKaITi0muKP0WOq_eZIo_3ZoraiqLHg9oUMXsiV7BPioYu5EPv51jvDH3nmkxU',
    },
    {
      id: 'related2',
      name: 'Wool Desk Mat',
      price: 45,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Hwzb8daCLAxxUqYbr4gzF3ItPSGS_LMwcffyFQNNzBwYMrvYKvHxJnReC22mSTw0TX5uAPyHF5k0L_uaJG_XLuxJ4vqr7Dji9zV-1-zpGLMAKJgNq3yQKMPHEmrtxzConlDXyQ8ojEkfvmrVS6CaP2fgTPjomlO3U0506Q0D8wASvAkoC_FW94FLyNg5700hHHWw9Ma-7VpM4dtQ8YsLtN7n8DblJcknXN7bmKGGgdsOWQPl58Cc9XXbCnc6Ra_RQenNs9lonTE',
    },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const addRelatedProduct = (product: RelatedProduct) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, 1);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          specs: '',
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping: number = 0;
  const total = subtotal + shipping;

  const itemCount = cartItems.length;

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl font-manrope antialiased">
        <nav className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tight text-slate-900">OmniShop</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="#">
              Collections
            </a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="#">
              Editorial
            </a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="#">
              Designers
            </a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="#">
              Journal
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-all duration-300">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-all duration-300">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Shopping Bag</h1>
          <p className="text-on-surface-variant text-lg">
            You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your curator's selection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
                <p className="text-on-surface-variant text-lg">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-[0_32px_48px_rgba(25,28,29,0.04)] transition-all duration-300"
                >
                  <div className="w-full sm:w-32 h-32 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                    <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">{item.name}</h3>
                        {item.specs && <p className="text-sm text-on-surface-variant mt-1">{item.specs}</p>}
                      </div>
                      <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-4 font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-sm"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Frequently Bought Together */}
            {cartItems.length > 0 && (
              <div className="pt-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Frequently Bought Together
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface-container-lowest rounded-lg overflow-hidden flex-shrink-0">
                        <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => addRelatedProduct(product)}
                        className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary-container transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-primary font-semibold">{shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    className="bg-surface-container-high border-none rounded-lg flex-grow px-4 text-sm focus:ring-1 focus:ring-primary"
                    placeholder="OMNI2024"
                    type="text"
                  />
                  <button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-bold text-sm hover:bg-outline-variant transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-bold text-lg mb-6 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Checkout Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="flex justify-center items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="material-symbols-outlined text-2xl">payments</span>
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="material-symbols-outlined text-2xl">contactless</span>
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Fast Shipping</p>
                    <p className="text-xs text-on-surface-variant">Free express delivery worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">12 Month Warranty</p>
                    <p className="text-xs text-on-surface-variant">Full protection for your craft</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">24/7 Support</p>
                    <p className="text-xs text-on-surface-variant">Expert assistance anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-manrope text-sm tracking-wide">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-screen-2xl mx-auto">
          <div className="mb-8 md:mb-0">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">OmniShop</span>
            <p className="text-slate-500 dark:text-slate-400 mt-2">© 2024 OmniShop Editorial Excellence. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-slate-500 dark:text-slate-400">
            <a className="hover:text-[#219bf6] underline-offset-4 hover:underline transition-all duration-200" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#219bf6] underline-offset-4 hover:underline transition-all duration-200" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#219bf6] underline-offset-4 hover:underline transition-all duration-200" href="#">
              Shipping &amp; Returns
            </a>
            <a className="hover:text-[#219bf6] underline-offset-4 hover:underline transition-all duration-200" href="#">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
