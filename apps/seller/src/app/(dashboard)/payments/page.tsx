"use client";

import { useMemo, useState } from "react";
import { PaymentsBottomInsights } from "./_components/payments-bottom-insights";
import { PaymentsCashflowPanel } from "./_components/payments-cashflow-panel";
import { PaymentsHeader } from "./_components/payments-header";
import { PaymentsSummaryCard } from "./_components/payments-summary-card";
import { PaymentsTransactionTable } from "./_components/payments-transaction-table";
import { PaymentsWarningCard } from "./_components/payments-warning-card";
import {
  cashflowLegend,
  cashflowPoints,
  paymentDiscrepancyWarning,
  paymentHeaderActions,
  paymentMonthlyReport,
  paymentSmartTip,
  paymentStatusFilterOptions,
  paymentSummaryMetric,
  paymentTransactionRows,
  totalPaymentTransactions,
} from "./data/payments-mock-data";
import type { PaymentStatusFilterValue } from "./types";

export default function PaymentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatusFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const filteredRows = useMemo(() => {
    if (selectedStatus === "all") {
      return paymentTransactionRows;
    }

    if (selectedStatus === "settled") {
      return paymentTransactionRows.filter((row) => row.status === "Đã về ví");
    }

    if (selectedStatus === "pending") {
      return paymentTransactionRows.filter((row) => row.status === "Chờ xử lý");
    }

    return paymentTransactionRows.filter((row) => row.warningLabel !== "—");
  }, [selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows]);

  const handleNoopAction = () => undefined;

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-5 pb-14">
      <PaymentsHeader actions={paymentHeaderActions} onActionClick={handleNoopAction} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <PaymentsCashflowPanel legend={cashflowLegend} points={cashflowPoints} />

        <div className="grid gap-5">
          <PaymentsSummaryCard metric={paymentSummaryMetric} />
          <PaymentsWarningCard warning={paymentDiscrepancyWarning} />
        </div>
      </section>

      <PaymentsTransactionTable
        rows={paginatedRows}
        statusOptions={paymentStatusFilterOptions}
        selectedStatus={selectedStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalPaymentTransactions}
        filteredRecords={filteredRows.length}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
        onFilterClick={handleNoopAction}
        onPageChange={setCurrentPage}
      />

      <PaymentsBottomInsights
        smartTip={paymentSmartTip}
        monthlyReport={paymentMonthlyReport}
        onReportClick={handleNoopAction}
        onFloatingActionClick={handleNoopAction}
      />
    </section>
  );
}
