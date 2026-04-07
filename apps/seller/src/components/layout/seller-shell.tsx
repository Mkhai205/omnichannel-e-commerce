"use client";

import { useEffect, useState } from "react";
import { SellerHeader } from "@/components/layout/seller-header";
import { SellerSidebar } from "@/components/layout/seller-sidebar";

type SellerShellProps = {
  children: React.ReactNode;
};

export function SellerShell({ children }: SellerShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    closeOnDesktop();
    window.addEventListener("resize", closeOnDesktop);

    return () => {
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <SellerHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex min-h-[calc(100dvh-4rem)]">
        <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 md:py-8 md:pl-4 md:pr-6">{children}</main>
      </div>
    </div>
  );
}
