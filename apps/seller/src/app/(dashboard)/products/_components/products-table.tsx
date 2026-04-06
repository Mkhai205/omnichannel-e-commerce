"use client";

import type { ProductItem } from "@repo/shared-types";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";

type ProductsTableProps = {
    products: ProductItem[];
    isLoading: boolean;
    onEdit: (product: ProductItem) => void;
    onDelete: (product: ProductItem) => void;
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

export function ProductsTable({ products, isLoading, onEdit, onDelete }: ProductsTableProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/70">
                        <TableHead className="w-[32%]">Sản phẩm</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead>Tổng tồn</TableHead>
                        <TableHead className="w-[220px]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải danh sách sản phẩm...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && products.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Chưa có sản phẩm nào.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? products.map((product) => (
                              <TableRow key={product.id}>
                                  <TableCell>
                                      <div className="grid gap-1">
                                          <p className="text-sm font-semibold text-slate-900">
                                              {product.name}
                                          </p>
                                          <p className="text-xs text-slate-500">
                                              {product.description || "Không có mô tả"}
                                          </p>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <span
                                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${toStatusClassName(product.status)}`}
                                      >
                                          {toStatusLabel(product.status)}
                                      </span>
                                  </TableCell>
                                  <TableCell>{product.variants.length}</TableCell>
                                  <TableCell>{sumVariantStock(product)}</TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => onEdit(product)}
                                          >
                                              Sửa
                                          </Button>
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                              onClick={() => onDelete(product)}
                                          >
                                              Xóa
                                          </Button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>
        </section>
    );
}
