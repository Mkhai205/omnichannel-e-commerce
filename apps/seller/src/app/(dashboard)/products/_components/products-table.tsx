"use client";

import { useEffect, useState } from "react";
import type { ProductItem } from "@repo/shared-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import Image from "next/image";

const PRODUCT_FALLBACK_IMAGE_SRC = "/products/product.jpg";

type ProductsTableProps = {
    products: ProductItem[];
    categoryMap: Record<string, string>;
    isLoading: boolean;
    onRowClick: (productId: string) => void;
};

function toStatusLabel(status: ProductItem["status"]): string {
    switch (status) {
        case "ACTIVE":
            return "Đang bán";
        case "HIDDEN":
            return "Đã ẩn";
        default:
            return "Nháp";
    }
}

function toStatusClassName(status: ProductItem["status"]): string {
    switch (status) {
        case "ACTIVE":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "HIDDEN":
            return "bg-slate-100 text-slate-700 border-slate-200";
        default:
            return "bg-amber-100 text-amber-700 border-amber-200";
    }
}

function sumVariantStock(product: ProductItem): number {
    return product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
}

function toProductImageSrc(product: ProductItem): string {
    const normalizedProductImage = product.imageUrl?.trim();

    if (normalizedProductImage && normalizedProductImage.length > 0) {
        return normalizedProductImage;
    }

    const firstVariantImageUrl = product.variants
        .map((variant) => variant.imageUrl?.trim())
        .find((imageUrl) => typeof imageUrl === "string" && imageUrl.length > 0);

    return firstVariantImageUrl || PRODUCT_FALLBACK_IMAGE_SRC;
}

function ProductThumbnail({ src, alt }: { src: string; alt: string }) {
    const [resolvedSrc, setResolvedSrc] = useState(src);

    useEffect(() => {
        setResolvedSrc(src);
    }, [src]);

    return (
        <Image
            width={56}
            height={56}
            src={resolvedSrc}
            alt={alt}
            className="h-14 w-14 rounded-md border border-slate-200 object-cover"
            loading="lazy"
            onError={() => {
                setResolvedSrc(PRODUCT_FALLBACK_IMAGE_SRC);
            }}
        />
    );
}

function summarizeOtherSpecs(product: ProductItem): string {
    const attributeKeys = new Set<string>();

    for (const variant of product.variants) {
        for (const key of Object.keys(variant.attributes)) {
            if (key.trim().length > 0) {
                attributeKeys.add(key);
            }
        }
    }

    if (attributeKeys.size === 0) {
        return "Không có";
    }

    const labels = Array.from(attributeKeys);
    const head = labels.slice(0, 2).join(", ");

    if (labels.length <= 2) {
        return head;
    }

    return `${head} (+${labels.length - 2})`;
}

export function ProductsTable({
    products,
    categoryMap,
    isLoading,
    onRowClick,
}: ProductsTableProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-100">
                        <TableHead className="w-[32%] text-center font-extrabold">
                            Sản phẩm
                        </TableHead>
                        <TableHead className="text-center font-extrabold">Danh mục</TableHead>
                        <TableHead className="text-center font-extrabold">Trạng thái</TableHead>
                        <TableHead className="text-center font-extrabold">Biến thể</TableHead>
                        <TableHead className="text-center font-extrabold">Thông số khác</TableHead>
                        <TableHead className="text-center font-extrabold">Tổng tồn</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải danh sách sản phẩm...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && products.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Chưa có sản phẩm nào.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? products.map((product) => (
                              <TableRow
                                  key={product.id}
                                  className="cursor-pointer transition-colors hover:bg-slate-50"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => onRowClick(product.id)}
                                  onKeyDown={(event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          onRowClick(product.id);
                                      }
                                  }}
                              >
                                  <TableCell>
                                      <div className="grid grid-cols-[56px_1fr] items-start gap-4">
                                          <ProductThumbnail
                                              src={toProductImageSrc(product)}
                                              alt={product.name}
                                          />
                                          <div className="grid gap-1">
                                              <p className="text-sm font-semibold text-slate-900">
                                                  {product.name}
                                              </p>
                                              <p className="line-clamp-2 text-xs text-slate-500">
                                                  {product.description || "Không có mô tả"}
                                              </p>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-sm text-center text-slate-700">
                                      {categoryMap[product.categoryId] || "Không xác định"}
                                  </TableCell>
                                  <TableCell className="text-center">
                                      <span
                                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${toStatusClassName(product.status)}`}
                                      >
                                          {toStatusLabel(product.status)}
                                      </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                      {product.variants.length}
                                  </TableCell>
                                  <TableCell className="text-sm text-center text-slate-600">
                                      {summarizeOtherSpecs(product)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                      {sumVariantStock(product)}
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>
        </section>
    );
}
