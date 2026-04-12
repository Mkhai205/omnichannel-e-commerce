"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminShopItem, ShopStatus } from "@repo/shared-types";
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
import { getAdminShops, updateAdminShopStatus } from "@/services/shops-service";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: Array<ShopStatus | "ALL"> = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function getShopStatusLabel(status: ShopStatus | "ALL"): string {
    if (status === "ALL") return "Tất cả";
    if (status === "PENDING") return "Chờ duyệt";
    if (status === "APPROVED") return "Đã duyệt";
    return "Từ chối";
}

export default function ShopsPage() {
    const [shops, setShops] = useState<AdminShopItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShopStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mutatingShopId, setMutatingShopId] = useState<string | null>(null);

    const loadShops = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getAdminShops({
                page,
                limit: PAGE_SIZE,
                search: search.trim() || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            });

            setShops(response.data);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể tải danh sách cửa hàng");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => {
        void loadShops();
    }, [loadShops]);

    const handleApprove = async (shopId: string) => {
        setMutatingShopId(shopId);
        try {
            await updateAdminShopStatus(shopId, { status: "APPROVED" });
            await loadShops();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể duyệt cửa hàng này");
            }
        } finally {
            setMutatingShopId(null);
        }
    };

    const handleReject = async (shopId: string) => {
        const reason = window.prompt("Nhập lý do từ chối");
        if (!reason || !reason.trim()) {
            return;
        }

        setMutatingShopId(shopId);
        try {
            await updateAdminShopStatus(shopId, {
                status: "REJECTED",
                rejectionReason: reason.trim(),
            });
            await loadShops();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Không thể từ chối cửa hàng này");
            }
        } finally {
            setMutatingShopId(null);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Kiểm duyệt cửa hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
                        <Input
                            placeholder="Tìm theo tên cửa hàng, chủ shop, slug"
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
                                setStatusFilter(event.target.value as ShopStatus | "ALL");
                                setPage(1);
                            }}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    Trạng thái: {getShopStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                        <Button type="button" variant="outline" onClick={() => void loadShops()}>
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
                                <TableHead>Cửa hàng</TableHead>
                                <TableHead>Chủ sở hữu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>Đang tải cửa hàng...</TableCell>
                                </TableRow>
                            ) : shops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>Không có cửa hàng phù hợp</TableCell>
                                </TableRow>
                            ) : (
                                shops.map((shop) => {
                                    const isMutating = mutatingShopId === shop.id;
                                    return (
                                        <TableRow key={shop.id}>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="font-medium text-slate-900">
                                                        {shop.shopName}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {shop.slug}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="text-sm text-slate-900">
                                                        {shop.ownerFullName}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {shop.ownerEmail}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getShopStatusLabel(shop.status)}</TableCell>
                                            <TableCell>
                                                {new Date(shop.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        disabled={
                                                            isMutating || shop.status === "APPROVED"
                                                        }
                                                        onClick={() => void handleApprove(shop.id)}
                                                    >
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        disabled={isMutating}
                                                        onClick={() => void handleReject(shop.id)}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </div>
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
