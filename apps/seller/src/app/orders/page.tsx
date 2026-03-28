"use client";

import { useEffect, useMemo, useState } from "react";
import { OrdersFilters } from "./_components/orders-filters";
import { OrdersHeaderStats } from "./_components/orders-header-stats";
import { OrdersTable } from "./_components/orders-table";
import { channelOptions, orderRows, orderStats, statusOptions, totalOrdersCount } from "./data/orders-mock-data";
import type { FilterValues } from "./types";

const initialFilterValues: FilterValues = {
  channel: "all",
  status: "all",
  orderDate: "",
};

export default function OrdersPage() {
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues);
  const [appliedFilterValues, setAppliedFilterValues] = useState<FilterValues>(initialFilterValues);
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

  const normalizedChannelLabelByValue = useMemo(() => {
    return channelOptions.reduce<Record<string, string>>((acc, option) => {
      acc[option.value] = option.label.toLowerCase();
      return acc;
    }, {});
  }, []);

  const statusLabelByValue: Record<string, string> = {
    pending: "CHỜ XÁC NHẬN",
    shipping: "ĐANG GIAO",
    success: "THÀNH CÔNG",
  };

  const filteredRows = useMemo(() => {
    return orderRows.filter((row) => {
      const isChannelMatched =
        appliedFilterValues.channel === "all"
          ? true
          : row.channel.toLowerCase() === normalizedChannelLabelByValue[appliedFilterValues.channel];

      const isStatusMatched =
        appliedFilterValues.status === "all"
          ? true
          : row.status === statusLabelByValue[appliedFilterValues.status];

      const isDateMatched =
        appliedFilterValues.orderDate.trim() === ""
          ? true
          : row.orderDateValue === appliedFilterValues.orderDate.trim();

      return isChannelMatched && isStatusMatched && isDateMatched;
    });
  }, [appliedFilterValues, normalizedChannelLabelByValue]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedRows = useMemo(() => {
    const skip = (currentPage - 1) * pageSize;
    return filteredRows.slice(skip, skip + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const handleApplyFilters = () => {
    setAppliedFilterValues(filterValues);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues(initialFilterValues);
    setAppliedFilterValues(initialFilterValues);
    setCurrentPage(1);
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <OrdersHeaderStats stats={orderStats} />

      <OrdersFilters
        values={filterValues}
        channelOptions={channelOptions}
        statusOptions={statusOptions}
        onChannelChange={(value) => setFilterValues((prev) => ({ ...prev, channel: value }))}
        onStatusChange={(value) => setFilterValues((prev) => ({ ...prev, status: value }))}
        onDateChange={(value) => setFilterValues((prev) => ({ ...prev, orderDate: value }))}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <OrdersTable
        rows={paginatedRows}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalOrdersCount={totalOrdersCount}
        filteredRowCount={filteredRows.length}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
