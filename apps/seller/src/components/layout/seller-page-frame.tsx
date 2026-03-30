"use client";

import { usePathname } from "next/navigation";
import { SellerShell } from "@/components/layout/seller-shell";

type SellerPageFrameProps = {
  children: React.ReactNode;
};

export function SellerPageFrame({ children }: SellerPageFrameProps) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/login/") || pathname === "/register" || pathname.startsWith("/register/")) {
    return <>{children}</>;
  }

  return <SellerShell>{children}</SellerShell>;
}
