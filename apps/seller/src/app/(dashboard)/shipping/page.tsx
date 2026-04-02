"use client";

import { useMemo, useState } from "react";
import { ShippingHeader } from "./_components/shipping-header";
import { ShippingOrdersTable } from "./_components/shipping-orders-table";
import { ShippingOverviewCards } from "./_components/shipping-overview-cards";
import {
  shippingActionButtons,
  shippingOverviewStats,
  shippingRows,
  shippingStatusTabs,
  totalShippingOrdersCount,
} from "./data/shipping-mock-data";
import type { ShippingTabFilter } from "./types";

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<ShippingTabFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRows = useMemo(() => {
    if (activeTab === "all") {
      return shippingRows;
    }

    if (activeTab === "in-transit") {
      return shippingRows.filter((row) => row.status === "ĐANG VẬN CHUYỂN");
    }

    return shippingRows.filter((row) => row.status === "CHỜ XỬ LÝ HOÀN");
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const skip = (currentPage - 1) * pageSize;
    return filteredRows.slice(skip, skip + pageSize);
  }, [currentPage, filteredRows]);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <ShippingHeader actions={shippingActionButtons} />

      <ShippingOverviewCards stats={shippingOverviewStats} />

      <ShippingOrdersTable
        rows={paginatedRows}
        tabs={shippingStatusTabs}
        activeTab={activeTab}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        filteredRowCount={filteredRows.length}
        totalShippingOrders={totalShippingOrdersCount}
        onTabChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
