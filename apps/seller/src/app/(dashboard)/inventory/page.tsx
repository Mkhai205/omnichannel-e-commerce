"use client";

import { useEffect, useMemo, useState } from "react";
import type { SellerInventoryOverview } from "@repo/shared-types";
import { isApiRequestError } from "@/services/http-client";
import {
    getSellerInventoryItems,
    getSellerInventoryOverview,
    getSellerInventoryWarehouses,
} from "@/services/inventory-service";
import { InventoryHeader } from "./_components/inventory-header";
import { InventoryOverviewCards } from "./_components/inventory-overview-cards";
import { InventoryProductsTable } from "./_components/inventory-products-table";
import type {
    InventoryActionButton,
    InventoryProductRow,
    InventoryStatusFilter,
    WarehouseFilter,
    WarehouseFilterOption,
} from "./types";

const inventoryActionButtons: InventoryActionButton[] = [
    {
        id: "audit-report",
        label: "Báo cáo kiểm kê",
        style: "outline",
    },
    {
        id: "stock-in",
        label: "Nhập kho",
        style: "primary",
    },
    {
        id: "stock-out",
        label: "Xuất kho",
        style: "outline",
    },
];

const defaultOverview: SellerInventoryOverview = {
    totalInventoryValue: "0",
    totalInventoryCurrency: "VND",
    monthlyGrowthPercent: 0,
    lowStockCount: 0,
    inboundToday: 0,
    outboundToday: 0,
    inboundProgressPercent: 0,
};

export default function InventoryPage() {
    const [activeWarehouse, setActiveWarehouse] = useState<WarehouseFilter>("all");
    const [activeStatus, setActiveStatus] = useState<InventoryStatusFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [warehouseOptions, setWarehouseOptions] = useState<WarehouseFilterOption[]>([
        { value: "all", label: "Tất cả" },
    ]);
    const [overview, setOverview] = useState<SellerInventoryOverview>(defaultOverview);
    const [rows, setRows] = useState<InventoryProductRow[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const updatePageSize = () => {
            if (window.innerHeight < 700) {
                setPageSize(4);
                return;
            }

            if (window.innerHeight < 900) {
                setPageSize(7);
                return;
            }

            setPageSize(10);
        };

        updatePageSize();
        window.addEventListener("resize", updatePageSize);

        return () => {
            window.removeEventListener("resize", updatePageSize);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchWarehouses = async () => {
            try {
                const warehouses = await getSellerInventoryWarehouses();

                if (!isMounted) {
                    return;
                }

                const nextOptions: WarehouseFilterOption[] = [
                    { value: "all", label: "Tất cả" },
                    ...warehouses.map((warehouse) => ({
                        value: warehouse.id,
                        label: warehouse.name,
                        isDefault: warehouse.isDefault,
                    })),
                ];

                setWarehouseOptions(nextOptions);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải danh sách kho. Vui lòng thử lại.");
                }
            }
        };

        void fetchWarehouses();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchInventoryData = async () => {
            setIsLoading(true);

            try {
                const warehouseId = activeWarehouse === "all" ? undefined : activeWarehouse;
                const status = activeStatus === "all" ? undefined : activeStatus;

                const [overviewResponse, itemsResponse] = await Promise.all([
                    getSellerInventoryOverview({ warehouseId }),
                    getSellerInventoryItems({
                        page: currentPage,
                        limit: pageSize,
                        warehouseId,
                        status,
                    }),
                ]);

                if (!isMounted) {
                    return;
                }

                setOverview(overviewResponse);
                setRows(
                    itemsResponse.data.map((item) => ({
                        variantId: item.variantId,
                        sku: item.sku,
                        productName: item.productName,
                        categoryLabel: item.categoryLabel,
                        brandLabel: item.brandLabel,
                        warehouseId: item.warehouseId,
                        warehouseName: item.warehouseName,
                        currentStock: item.currentStock,
                        status: item.status,
                    })),
                );
                setTotalPages(Math.max(1, itemsResponse.meta.totalPages));
                setTotalProducts(itemsResponse.meta.totalItems);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Không thể tải dữ liệu tồn kho. Vui lòng thử lại.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchInventoryData();

        return () => {
            isMounted = false;
        };
    }, [activeStatus, activeWarehouse, currentPage, pageSize]);

    const safeTotalPages = useMemo(() => {
        return Math.max(1, totalPages);
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage((previousPage) => Math.min(previousPage, safeTotalPages));
    }, [safeTotalPages]);

    const handleWarehouseChange = (value: WarehouseFilter) => {
        setActiveWarehouse(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: InventoryStatusFilter) => {
        setActiveStatus(value);
        setCurrentPage(1);
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <InventoryHeader actions={inventoryActionButtons} />

            <InventoryOverviewCards stats={overview} />

            {errorMessage ? (
                <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </section>
            ) : null}

            <InventoryProductsTable
                rows={rows}
                currentPage={currentPage}
                totalPages={safeTotalPages}
                pageSize={pageSize}
                totalProducts={totalProducts}
                isLoading={isLoading}
                activeWarehouse={activeWarehouse}
                activeStatus={activeStatus}
                warehouseOptions={warehouseOptions}
                onWarehouseChange={handleWarehouseChange}
                onStatusChange={handleStatusChange}
                onPageChange={setCurrentPage}
            />
        </section>
    );
}
