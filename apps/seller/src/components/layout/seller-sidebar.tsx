"use client";

import { cn } from "@repo/ui";
import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  CreditCard,
  Headset,
  LifeBuoy,
  Megaphone,
  ShoppingCart,
  Truck,
} from "lucide-react";

type SellerSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mainNav = [
  { label: "Orders", icon: ShoppingCart },
  { label: "Inventory", icon: Boxes },
  { label: "Products", icon: ClipboardCheck },
  { label: "Shipping", icon: Truck },
  { label: "Marketing", icon: Megaphone },
  { label: "Payments", icon: CreditCard },
  { label: "Customer Service", icon: Headset },
  { label: "Analytics", icon: BarChart3 },
];

const supportNav = [{ label: "Support", icon: LifeBuoy }];

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        className={cn(
          "fixed inset-0 top-16 z-30 bg-black/25 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 flex h-[calc(100dvh-4rem)] w-64 flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:translate-x-0",
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <nav className="flex flex-col gap-1">
            {mainNav.map((item) => {
              const isActive = item.label === "Orders";
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[18px] font-medium leading-7 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700",
                    isActive && "bg-blue-100 text-blue-700",
                  )}
                  onClick={onClose}
                >
                  <Icon aria-hidden="true" className="size-6 shrink-0" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {supportNav.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[18px] font-medium leading-7 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  onClick={onClose}
                >
                  <Icon aria-hidden="true" className="size-6 shrink-0" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
