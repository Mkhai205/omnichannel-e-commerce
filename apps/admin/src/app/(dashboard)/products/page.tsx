"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductItem, ProductStatus } from "@repo/shared-types";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getAdminProducts, updateAdminProductStatus } from "@/services/products-service";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: Array<ProductStatus | "ALL"> = ["ALL", "DRAFT", "ACTIVE", "HIDDEN"];

function getProductStatusLabel(status: ProductStatus | "ALL"): string {
    if (status === "ALL") return "Tất cả";
    if (status === "DRAFT") return "Bản nháp";
    if (status === "ACTIVE") return "Đang hiển thị";
    return "Đang ẩn";
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusDrafts, setStatusDrafts] = useState<Record<string, ProductStatus>>({});
    const [mutatingProductId, setMutatingProductId] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getAdminProducts({
                page,
                limit: PAGE_SIZE,
                search: search.trim() || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            });

            setProducts(response.data);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách sản phẩm");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    const totalVariants = useMemo(
        () => products.reduce((sum, product) => sum + product.variants.length, 0),
        [products],
    );

    const totalStock = useMemo(
        () =>
            products.reduce(
                (sum, product) =>
                    sum +
                    product.variants.reduce(
                        (variantSum, variant) => variantSum + variant.stockQuantity,
                        0,
                    ),
                0,
            ),
        [products],
    );

    const handleSaveStatus = async (product: ProductItem) => {
        const nextStatus = statusDrafts[product.id] ?? product.status;
        if (nextStatus === product.status) {
            return;
        }

        setMutatingProductId(product.id);
        try {
            await updateAdminProductStatus(product.id, { status: nextStatus });
            await loadProducts();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể cập nhật trạng thái sản phẩm");
            }
        } finally {
            setMutatingProductId(null);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <header className="grid gap-3 md:grid-cols-2">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Biến thể trên trang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{totalVariants}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Tồn kho trên trang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{totalStock}</p>
                    </CardContent>
                </Card>
            </header>

            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Kiểm duyệt sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                        <Input
                            placeholder="Tìm theo tên sản phẩm"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                        />
                        <select
                            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(event.target.value as ProductStatus | "ALL");
                                setPage(1);
                            }}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    Trạng thái: {getProductStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                        <Button type="button" variant="outline" onClick={() => void loadProducts()}>
                            Tải lại
                        </Button>
                    </div>

                    {errorMessage ? (
                        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Biến thể</TableHead>
                                <TableHead>Tồn kho</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>Đang tải sản phẩm...</TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>Không có sản phẩm phù hợp</TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => {
                                    const draftStatus = statusDrafts[product.id] ?? product.status;
                                    const totalProductStock = product.variants.reduce(
                                        (sum, variant) => sum + variant.stockQuantity,
                                        0,
                                    );
                                    const isMutating = mutatingProductId === product.id;

                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="font-medium text-slate-900">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {product.id}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <select
                                                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                                                    value={draftStatus}
                                                    disabled={isMutating}
                                                    onChange={(event) => {
                                                        setStatusDrafts((prev) => ({
                                                            ...prev,
                                                            [product.id]: event.target
                                                                .value as ProductStatus,
                                                        }));
                                                    }}
                                                >
                                                    <option value="DRAFT">Bản nháp</option>
                                                    <option value="ACTIVE">Đang hiển thị</option>
                                                    <option value="HIDDEN">Đang ẩn</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>{product.variants.length}</TableCell>
                                            <TableCell>{totalProductStock}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={
                                                        isMutating || draftStatus === product.status
                                                    }
                                                    onClick={() => void handleSaveStatus(product)}
                                                >
                                                    Lưu trạng thái
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={page <= 1 || isLoading}
                            onClick={() => {
                                setPage((prev) => Math.max(1, prev - 1));
                            }}
                        >
                            Trước
                        </Button>
                        <span className="text-sm text-slate-600">
                            Trang {page}/{totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={page >= totalPages || isLoading}
                            onClick={() => {
                                setPage((prev) => Math.min(totalPages, prev + 1));
                            }}
                        >
                            Sau
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
