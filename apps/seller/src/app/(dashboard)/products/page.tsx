"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductsFilters } from "./_components/products-filters";
import { ProductsHeader } from "./_components/products-header";
import { ProductsOverviewCards } from "./_components/products-overview-cards";
import { ProductsTable } from "./_components/products-table";
import {
  channelLabelByFilter,
  channelOptions,
  productRows,
  productsActionButtons,
  productsOverviewStats,
  syncStatusLabelByFilter,
  syncStatusOptions,
  totalProductsCount,
} from "./data/products-mock-data";
import type { ProductFilterValues } from "./types";

const initialFilterValues: ProductFilterValues = {
  syncStatus: "all",
  channel: "all",
  keyword: "",
};

export default function ProductsPage() {
  const [filterValues, setFilterValues] = useState<ProductFilterValues>(initialFilterValues);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const filteredRows = useMemo(() => {
    return productRows.filter((row) => {
      const normalizedKeyword = filterValues.keyword.trim().toLowerCase();
      const isKeywordMatched =
        normalizedKeyword === ""
          ? true
          : row.productName.toLowerCase().includes(normalizedKeyword) || row.sku.toLowerCase().includes(normalizedKeyword);

      const isStatusMatched =
        filterValues.syncStatus === "all" ? true : row.syncStatus === syncStatusLabelByFilter[filterValues.syncStatus];

      const isChannelMatched = filterValues.channel === "all" ? true : row.channel === channelLabelByFilter[filterValues.channel];

      return isKeywordMatched && isStatusMatched && isChannelMatched;
    });
  }, [filterValues]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const paginatedRows = useMemo(() => {
    const skip = (currentPage - 1) * pageSize;
    return filteredRows.slice(skip, skip + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <ProductsHeader actions={productsActionButtons} />

      <ProductsOverviewCards stats={productsOverviewStats} />

      <ProductsFilters
        values={filterValues}
        statusOptions={syncStatusOptions}
        channelOptions={channelOptions}
        onKeywordChange={(value) => {
          setFilterValues((previous) => ({ ...previous, keyword: value }));
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setFilterValues((previous) => ({ ...previous, syncStatus: value }));
          setCurrentPage(1);
        }}
        onChannelChange={(value) => {
          setFilterValues((previous) => ({ ...previous, channel: value }));
          setCurrentPage(1);
        }}
      />

      <ProductsTable
        rows={paginatedRows}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalProductsCount={totalProductsCount}
        filteredRowCount={filteredRows.length}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
