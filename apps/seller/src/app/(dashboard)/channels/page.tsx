"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
    ChannelSyncDirection,
    SalesChannelType,
    SellerChannelConnectionItem,
    SellerChannelSyncRunItem,
} from "@repo/shared-types";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
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
import {
    connectSellerChannel,
    disconnectSellerChannel,
    getSellerChannelSyncRuns,
    getSellerChannels,
    triggerSellerChannelSync,
} from "@/services/channel-sync-service";
import { isApiRequestError } from "@/services/http-client";

const CHANNEL_LABELS: Record<SalesChannelType, string> = {
    WEB: "Website nội bộ",
    TIKTOK_MOCK: "TikTok Mock",
    SHOPEE_MOCK: "Shopee Mock",
};

const DIRECTION_LABELS: Record<ChannelSyncDirection, string> = {
    IMPORT_ORDERS: "Import đơn",
    EXPORT_PRODUCTS: "Export sản phẩm",
    EXPORT_INVENTORY: "Export tồn kho",
};

function formatDateTime(value?: string | null): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function toFriendlyError(error: unknown, fallback: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallback;
    }

    return fallback;
}

export default function ChannelsPage() {
    const [connections, setConnections] = useState<SellerChannelConnectionItem[]>([]);
    const [syncRuns, setSyncRuns] = useState<SellerChannelSyncRunItem[]>([]);
    const [externalShopIds, setExternalShopIds] = useState<Record<string, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isWorking, setIsWorking] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);

        try {
            const [loadedConnections, loadedRuns] = await Promise.all([
                getSellerChannels(),
                getSellerChannelSyncRuns({ page: 1, limit: 20 }),
            ]);

            setConnections(loadedConnections);
            setSyncRuns(loadedRuns.data);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể tải dữ liệu kênh bán."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const sortedConnections = useMemo(() => {
        return [...connections].sort((left, right) => {
            if (left.channelType === "WEB") {
                return -1;
            }

            if (right.channelType === "WEB") {
                return 1;
            }

            return left.channelType.localeCompare(right.channelType);
        });
    }, [connections]);

    const setExternalShopId = (channelType: SalesChannelType, value: string) => {
        setExternalShopIds((previous) => ({
            ...previous,
            [channelType]: value,
        }));
    };

    const connectChannel = async (channelType: SalesChannelType) => {
        setIsWorking(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await connectSellerChannel(channelType, {
                externalShopId: externalShopIds[channelType]?.trim() || undefined,
                accessToken: `mock-access-${channelType.toLowerCase()}`,
                refreshToken: `mock-refresh-${channelType.toLowerCase()}`,
            });

            await loadData();
            setSuccessMessage(`Đã kết nối ${CHANNEL_LABELS[channelType]} thành công.`);
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể kết nối kênh."));
        } finally {
            setIsWorking(false);
        }
    };

    const disconnectChannel = async (channelType: SalesChannelType) => {
        setIsWorking(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await disconnectSellerChannel(channelType);
            await loadData();
            setSuccessMessage(`Đã ngắt kết nối ${CHANNEL_LABELS[channelType]} thành công.`);
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể ngắt kết nối kênh."));
        } finally {
            setIsWorking(false);
        }
    };

    const runSync = async (channelType: SalesChannelType, direction: ChannelSyncDirection) => {
        setIsWorking(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await triggerSellerChannelSync(channelType, {
                direction,
                trigger: "MANUAL",
            });

            await loadData();
            setSuccessMessage(
                `Đã chạy ${DIRECTION_LABELS[direction]} cho ${CHANNEL_LABELS[channelType]} (${result.run.status}).`,
            );
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể chạy đồng bộ kênh."));
        } finally {
            setIsWorking(false);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-5 pb-10">
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl text-slate-900">
                        Quản lý kênh bán đa kênh
                    </CardTitle>
                    <CardDescription>
                        Kết nối TikTok/Shopee và chạy đồng bộ đơn hàng, sản phẩm, tồn kho ngay trong
                        dashboard seller.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {errorMessage ? (
                        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorMessage}
                        </p>
                    ) : null}
                    {successMessage ? (
                        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            {successMessage}
                        </p>
                    ) : null}
                    {isLoading ? (
                        <p className="text-sm text-slate-500">Đang tải dữ liệu kênh...</p>
                    ) : null}
                </CardContent>
            </Card>

            <section className="grid gap-4 lg:grid-cols-3">
                {sortedConnections.map((connection) => {
                    const isWeb = connection.channelType === "WEB";
                    const isConnected = connection.status === "CONNECTED";

                    return (
                        <Card key={connection.id} className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900">
                                    {CHANNEL_LABELS[connection.channelType]}
                                </CardTitle>
                                <CardDescription>
                                    Trạng thái:{" "}
                                    <span className="font-medium">{connection.status}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-xs text-slate-500">
                                    Đồng bộ gần nhất: {formatDateTime(connection.lastSyncedAt)}
                                </p>

                                {isWeb ? (
                                    <p className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                                        Kênh WEB nội bộ luôn kết nối mặc định.
                                    </p>
                                ) : (
                                    <>
                                        <Input
                                            value={externalShopIds[connection.channelType] ?? ""}
                                            onChange={(event) =>
                                                setExternalShopId(
                                                    connection.channelType,
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="External shop id (mock)"
                                        />

                                        <div className="flex flex-wrap gap-2">
                                            {isConnected ? (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    disabled={isWorking}
                                                    onClick={() =>
                                                        disconnectChannel(connection.channelType)
                                                    }
                                                >
                                                    Ngắt kết nối
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    disabled={isWorking}
                                                    onClick={() =>
                                                        connectChannel(connection.channelType)
                                                    }
                                                >
                                                    Kết nối
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="grid gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isWorking || (!isConnected && !isWeb)}
                                        onClick={() =>
                                            runSync(connection.channelType, "IMPORT_ORDERS")
                                        }
                                    >
                                        Import đơn
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isWorking || (!isConnected && !isWeb)}
                                        onClick={() =>
                                            runSync(connection.channelType, "EXPORT_PRODUCTS")
                                        }
                                    >
                                        Export sản phẩm
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isWorking || (!isConnected && !isWeb)}
                                        onClick={() =>
                                            runSync(connection.channelType, "EXPORT_INVENTORY")
                                        }
                                    >
                                        Export tồn kho
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-900">Lịch sử đồng bộ</CardTitle>
                    <CardDescription>
                        Theo dõi trạng thái từng lần chạy sync theo kênh và theo hướng đồng bộ.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kênh</TableHead>
                                <TableHead>Hướng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Kết quả</TableHead>
                                <TableHead>Thời gian</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {syncRuns.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-slate-500" colSpan={5}>
                                        Chưa có lần đồng bộ nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                syncRuns.map((run) => (
                                    <TableRow key={run.id}>
                                        <TableCell>{CHANNEL_LABELS[run.channelType]}</TableCell>
                                        <TableCell>{DIRECTION_LABELS[run.direction]}</TableCell>
                                        <TableCell>{run.status}</TableCell>
                                        <TableCell>
                                            {run.createdCount}/{run.updatedCount}/{run.failedCount}
                                        </TableCell>
                                        <TableCell>{formatDateTime(run.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
    );
}
