"use client";

import { useEffect, useState } from "react";
import type { ProductItem, SalesChannelType } from "@repo/shared-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import Image from "next/image";

const PRODUCT_FALLBACK_IMAGE_SRC = "/products/image.webp";

type ProductsTableProps = {
    products: ProductItem[];
    categoryMap: Record<string, string>;
    activeChannelType: SalesChannelType;
    syncedChannelsByProductId: Record<string, SalesChannelType[]>;
    isLoading: boolean;
    onRowClick: (productId: string) => void;
};

function toChannelTagLabel(channelType: SalesChannelType): string {
    switch (channelType) {
        case "TIKTOK_MOCK":
            return "TikTok";
        case "SHOPEE_MOCK":
            return "Shopee";
        default:
            return "WEB";
    }
}

function toChannelTagClassName(channelType: SalesChannelType): string {
    switch (channelType) {
        case "TIKTOK_MOCK":
            return "bg-sky-100 text-sky-700 border-sky-200";
        case "SHOPEE_MOCK":
            return "bg-orange-100 text-orange-700 border-orange-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

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
            unoptimized
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
    activeChannelType,
    syncedChannelsByProductId,
    isLoading,
    onRowClick,
}: ProductsTableProps) {
    const showSyncColumn = activeChannelType === "WEB";
    const columnCount = showSyncColumn ? 7 : 6;

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
                        {showSyncColumn ? (
                            <TableHead className="text-center font-extrabold">
                                Đồng bộ kênh
                            </TableHead>
                        ) : null}
                        <TableHead className="text-center font-extrabold">Tổng tồn</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải danh sách sản phẩm...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && products.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Chưa có sản phẩm nào.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? products.map((product) => {
                              const syncedChannels = syncedChannelsByProductId[product.id] ?? [];

                              return (
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
                                      {showSyncColumn ? (
                                          <TableCell className="text-center">
                                              {syncedChannels.length === 0 ? (
                                                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                                      Chưa đồng bộ
                                                  </span>
                                              ) : (
                                                  <div className="flex flex-wrap justify-center gap-1">
                                                      {syncedChannels.map((channelType) => (
                                                          <span
                                                              key={`${product.id}-${channelType}`}
                                                              className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${toChannelTagClassName(
                                                                  channelType,
                                                              )}`}
                                                          >
                                                              {toChannelTagLabel(channelType)}
                                                          </span>
                                                      ))}
                                                  </div>
                                              )}
                                          </TableCell>
                                      ) : null}
                                      <TableCell className="text-center">
                                          {sumVariantStock(product)}
                                      </TableCell>
                                  </TableRow>
                              );
                          })
                        : null}
                </TableBody>
            </Table>
        </section>
    );
}
