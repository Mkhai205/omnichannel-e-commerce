"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

type ProductDetailHeaderProps = {
    isCreateMode: boolean;
    onBack: () => void;
};

export function ProductDetailHeader({ isCreateMode, onBack }: ProductDetailHeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
                    {isCreateMode ? "Tạo sản phẩm mới" : "Chi tiết sản phẩm"}
                </h1>
                <p className="text-sm text-slate-500">
                    Quản lý thông tin, biến thể và hình ảnh sản phẩm tại một nơi.
                </p>
            </div>

            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
                <ArrowLeft className="size-4" />
                Quay lại danh sách
            </Button>
        </header>
    );
}
