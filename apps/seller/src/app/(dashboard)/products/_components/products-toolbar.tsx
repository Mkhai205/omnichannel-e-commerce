"use client";

import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui";
import type { ProductStatus } from "@repo/shared-types";

type ProductsToolbarProps = {
    keyword: string;
    status: ProductStatus | "ALL";
    onKeywordChange: (value: string) => void;
    onStatusChange: (value: ProductStatus | "ALL") => void;
    onCreateClick: () => void;
};

export function ProductsToolbar({
    keyword,
    status,
    onKeywordChange,
    onStatusChange,
    onCreateClick,
}: ProductsToolbarProps) {
    return (
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_auto] md:items-center">
            <Input
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="h-10"
            />

            <Select
                value={status}
                onValueChange={(value) => onStatusChange(value as ProductStatus | "ALL")}
            >
                <SelectTrigger className="h-10">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="DRAFT">Nháp</SelectItem>
                    <SelectItem value="ACTIVE">Đang bán</SelectItem>
                    <SelectItem value="HIDDEN">Đã ẩn</SelectItem>
                </SelectContent>
            </Select>

            <Button type="button" className="h-10" onClick={onCreateClick}>
                Thêm sản phẩm
            </Button>
        </section>
    );
}
