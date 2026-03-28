"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@repo/ui";
import { Bell, HelpCircle, Menu, Search, Settings } from "lucide-react";

type SellerHeaderProps = {
  onToggleSidebar: () => void;
};

export function SellerHeader({ onToggleSidebar }: SellerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center">
        <div className="hidden h-full w-64 items-center border-r border-slate-200 px-6 md:flex">
          <p className="flex flex-col leading-[1.05] text-[29px] font-semibold tracking-tight text-[#3696f7]">
            <span>Merchant</span>
            <span>Ledger</span>
          </p>
        </div>

        <div className="flex h-full flex-1 items-center gap-3 px-3 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu aria-hidden="true" />
        </Button>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
          <Search aria-hidden="true" className="size-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm mã đơn, khách hàng..."
            className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
            <Bell aria-hidden="true" />
          </Button>

          <Button type="button" variant="ghost" size="icon" aria-label="Help center">
            <HelpCircle aria-hidden="true" />
          </Button>

          <Button type="button" variant="ghost" size="icon" aria-label="Settings">
            <Settings aria-hidden="true" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" className="h-10 rounded-full px-1">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  KT
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Thông tin tài khoản</DropdownMenuItem>
              <DropdownMenuItem>Thiết lập cửa hàng</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>
    </header>
  );
}
