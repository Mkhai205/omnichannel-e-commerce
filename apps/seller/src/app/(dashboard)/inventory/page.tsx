"use client";

import { useEffect, useMemo, useState } from "react";
import { InventoryHeader } from "./_components/inventory-header";
import { InventoryOverviewCards } from "./_components/inventory-overview-cards";
import { InventoryProductsTable } from "./_components/inventory-products-table";
import {
  inventoryActionButtons,
  inventoryOverviewStats,
  inventoryProductRows,
  totalInventoryProducts,
  warehouseFilterOptions,
} from "./data/inventory-mock-data";
import type { WarehouseFilter } from "./types";

export default function InventoryPage() {
  const [activeWarehouse, setActiveWarehouse] = useState<WarehouseFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const filteredRows = useMemo(() => {
    if (activeWarehouse === "all") {
      return inventoryProductRows;
    }

    return inventoryProductRows.filter((row) => row.warehouseFilterValue === activeWarehouse);
  }, [activeWarehouse]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const paginatedRows = useMemo(() => {
    const skip = (currentPage - 1) * pageSize;
    return filteredRows.slice(skip, skip + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  const handleWarehouseChange = (value: WarehouseFilter) => {
    setActiveWarehouse(value);
    setCurrentPage(1);
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <InventoryHeader actions={inventoryActionButtons} />

      <InventoryOverviewCards stats={inventoryOverviewStats} />

      <InventoryProductsTable
        rows={paginatedRows}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalProducts={totalInventoryProducts}
        filteredRowCount={filteredRows.length}
        activeWarehouse={activeWarehouse}
        warehouseOptions={warehouseFilterOptions}
        onWarehouseChange={handleWarehouseChange}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
