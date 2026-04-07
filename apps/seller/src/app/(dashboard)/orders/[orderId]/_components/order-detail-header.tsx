"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

type OrderDetailHeaderProps = {
    onBack: () => void;
};

export function OrderDetailHeader({ onBack }: OrderDetailHeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
                    Chi tiết đơn hàng
                </h1>
                <p className="text-sm text-slate-500">
                    Theo dõi tiến trình xử lý, thông tin khách hàng và địa chỉ giao hàng tại một
                    nơi.
                </p>
            </div>

            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
                <ArrowLeft className="size-4" />
                Quay lại danh sách
            </Button>
        </header>
    );
}
