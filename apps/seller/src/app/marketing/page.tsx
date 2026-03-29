"use client";

import { useMemo, useState } from "react";
import { MarketingAiInsight } from "./_components/marketing-ai-insight";
import { MarketingCampaignsTable } from "./_components/marketing-campaigns-table";
import { MarketingHeader } from "./_components/marketing-header";
import { MarketingOverviewCards } from "./_components/marketing-overview-cards";
import {
  campaignFilterOptions,
  campaignSortOptions,
  marketingActionButtons,
  marketingCampaignRows,
  marketingOverviewStats,
  totalCampaignCount,
} from "./data/marketing-mock-data";
import type { CampaignFilterValue, CampaignSortValue } from "./types";

export default function MarketingPage() {
  const [selectedFilter, setSelectedFilter] = useState<CampaignFilterValue>("all");
  const [selectedSort, setSelectedSort] = useState<CampaignSortValue>("revenue-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredRows = useMemo(() => {
    if (selectedFilter === "all") {
      return marketingCampaignRows;
    }

    if (selectedFilter === "voucher") {
      return marketingCampaignRows.filter((row) => row.type === "VOUCHER");
    }

    return marketingCampaignRows.filter((row) => row.type === "FLASH_SALE");
  }, [selectedFilter]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];

    if (selectedSort === "revenue-desc") {
      return rows.sort((a, b) => b.revenueMillions - a.revenueMillions);
    }

    if (selectedSort === "roi-desc") {
      return rows.sort((a, b) => b.roiMultiplier - a.roiMultiplier);
    }

    return rows.sort((a, b) => b.sortDateValue.localeCompare(a.sortDateValue));
  }, [filteredRows, selectedSort]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const skip = (currentPage - 1) * pageSize;
    return sortedRows.slice(skip, skip + pageSize);
  }, [currentPage, sortedRows]);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <MarketingHeader actions={marketingActionButtons} />

      <MarketingOverviewCards stats={marketingOverviewStats} />

      <MarketingCampaignsTable
        rows={paginatedRows}
        filterOptions={campaignFilterOptions}
        sortOptions={campaignSortOptions}
        selectedFilter={selectedFilter}
        selectedSort={selectedSort}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        filteredRowCount={sortedRows.length}
        totalCampaignCount={totalCampaignCount}
        onFilterChange={(value) => {
          setSelectedFilter(value);
          setCurrentPage(1);
        }}
        onSortChange={(value) => {
          setSelectedSort(value);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
      />

      <MarketingAiInsight />
    </section>
  );
}
