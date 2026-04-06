"use client";

import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from "@/components/ui";
import type { ProductStatus } from "@repo/shared-types";
import type { ProductDraft, VariantDraft } from "../types";

type CategoryOption = {
    id: string;
    name: string;
};

type ProductEditorFormProps = {
    categories: CategoryOption[];
    draft: ProductDraft;
    disabled?: boolean;
    onDraftChange: (draft: ProductDraft) => void;
};

const DEFAULT_VARIANT: VariantDraft = {
    sku: "",
    price: "0",
    stockQuantity: 0,
    attributesText: "{}",
};

export function ProductEditorForm({
    categories,
    draft,
    disabled,
    onDraftChange,
}: ProductEditorFormProps) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="product-name">Tên sản phẩm</Label>
                    <Input
                        id="product-name"
                        value={draft.name}
                        disabled={disabled}
                        onChange={(event) =>
                            onDraftChange({
                                ...draft,
                                name: event.target.value,
                            })
                        }
                        placeholder="Nhập tên sản phẩm"
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Danh mục</Label>
                    <Select
                        value={draft.categoryId}
                        disabled={disabled}
                        onValueChange={(value) =>
                            onDraftChange({
                                ...draft,
                                categoryId: value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="product-description">Mô tả</Label>
                    <Textarea
                        id="product-description"
                        value={draft.description}
                        disabled={disabled}
                        onChange={(event) =>
                            onDraftChange({
                                ...draft,
                                description: event.target.value,
                            })
                        }
                        rows={4}
                        placeholder="Mô tả ngắn cho sản phẩm"
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Trạng thái</Label>
                    <Select
                        value={draft.status}
                        disabled={disabled}
                        onValueChange={(value) =>
                            onDraftChange({
                                ...draft,
                                status: value as ProductStatus,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DRAFT">Nháp</SelectItem>
                            <SelectItem value="ACTIVE">Đang bán</SelectItem>
                            <SelectItem value="HIDDEN">Đã ẩn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">Biến thể & tồn kho</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() =>
                            onDraftChange({
                                ...draft,
                                variants: [...draft.variants, { ...DEFAULT_VARIANT }],
                            })
                        }
                    >
                        Thêm biến thể
                    </Button>
                </div>

                {draft.variants.map((variant, index) => (
                    <div
                        key={variant.id ?? `new-${index}`}
                        className="grid gap-3 rounded-md border border-slate-200 p-3"
                    >
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label>SKU</Label>
                                <Input
                                    value={variant.sku}
                                    disabled={disabled || Boolean(variant.id)}
                                    onChange={(event) => {
                                        const nextVariants = [...draft.variants];
                                        const currentVariant = nextVariants[index];

                                        if (!currentVariant) {
                                            return;
                                        }

                                        nextVariants[index] = {
                                            ...currentVariant,
                                            sku: event.target.value,
                                        };
                                        onDraftChange({ ...draft, variants: nextVariants });
                                    }}
                                    placeholder="SKU-001"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Giá</Label>
                                <Input
                                    value={variant.price}
                                    disabled={disabled}
                                    onChange={(event) => {
                                        const nextVariants = [...draft.variants];
                                        const currentVariant = nextVariants[index];

                                        if (!currentVariant) {
                                            return;
                                        }

                                        nextVariants[index] = {
                                            ...currentVariant,
                                            price: event.target.value,
                                        };
                                        onDraftChange({ ...draft, variants: nextVariants });
                                    }}
                                    placeholder="199000"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Tồn kho</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={variant.stockQuantity}
                                    disabled={disabled}
                                    onChange={(event) => {
                                        const nextVariants = [...draft.variants];
                                        const currentVariant = nextVariants[index];

                                        if (!currentVariant) {
                                            return;
                                        }

                                        nextVariants[index] = {
                                            ...currentVariant,
                                            stockQuantity: Number(event.target.value || "0"),
                                        };
                                        onDraftChange({ ...draft, variants: nextVariants });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Attributes (JSON)</Label>
                            <Textarea
                                value={variant.attributesText}
                                disabled={disabled}
                                onChange={(event) => {
                                    const nextVariants = [...draft.variants];
                                    const currentVariant = nextVariants[index];

                                    if (!currentVariant) {
                                        return;
                                    }

                                    nextVariants[index] = {
                                        ...currentVariant,
                                        attributesText: event.target.value,
                                    };
                                    onDraftChange({ ...draft, variants: nextVariants });
                                }}
                                rows={3}
                                placeholder='{"color":"Đen","size":"L"}'
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled || draft.variants.length <= 1}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                onClick={() => {
                                    const nextVariants = draft.variants.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                    );
                                    onDraftChange({ ...draft, variants: nextVariants });
                                }}
                            >
                                Xóa biến thể
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
