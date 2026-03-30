"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader } from "@repo/ui";
import type { CustomerComplaintRecord } from "../data/customer-service-local-database";

type CustomerConversationListProps = {
  records: CustomerComplaintRecord[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
};

type ConversationFilter = "pending" | "processing";

function formatElapsedTime(createdAt: string): string {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffInMinutes = Math.max(0, Math.floor((now - created) / (1000 * 60)));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export function CustomerConversationList({ records, selectedCustomerId, onSelectCustomer }: CustomerConversationListProps) {
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("pending");

  const pendingRecords = useMemo(
    () => records.filter((record) => record.complaintStatus === "ĐANG_CHỜ"),
    [records],
  );

  const processingRecords = useMemo(
    () => records.filter((record) => record.complaintStatus === "ĐANG_XỬ_LÝ"),
    [records],
  );

  const displayedRecords = activeFilter === "pending" ? pendingRecords : processingRecords;

  useEffect(() => {
    const firstRecord = displayedRecords[0];
    if (!firstRecord) {
      return;
    }

    const hasSelectedInCurrentFilter = displayedRecords.some((record) => record.customerId === selectedCustomerId);
    if (!hasSelectedInCurrentFilter) {
      onSelectCustomer(firstRecord.customerId);
    }
  }, [displayedRecords, onSelectCustomer, selectedCustomerId]);

  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <CardHeader className="border-b border-slate-200 p-3">
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Button
            type="button"
            variant={activeFilter === "pending" ? "default" : "ghost"}
            className={
              activeFilter === "pending"
                ? "h-8 rounded-lg bg-blue-500 text-xs font-semibold text-white hover:bg-blue-500/90"
                : "h-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white"
            }
            onClick={() => setActiveFilter("pending")}
          >
            Đang chờ ({pendingRecords.length})
          </Button>
          <Button
            type="button"
            variant={activeFilter === "processing" ? "default" : "ghost"}
            className={
              activeFilter === "processing"
                ? "h-8 rounded-lg bg-blue-500 text-xs font-semibold text-white hover:bg-blue-500/90"
                : "h-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white"
            }
            onClick={() => setActiveFilter("processing")}
          >
            Tất cả ({processingRecords.length})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Hội thoại trực tuyến</div>
        <div className="flex max-h-160 flex-col overflow-y-auto">
          {displayedRecords.map((record) => (
            <Button
              key={record.customerId}
              type="button"
              variant="ghost"
              className={
                selectedCustomerId === record.customerId
                  ? "h-auto justify-start rounded-none border-l-2 border-l-blue-500 bg-blue-50 px-4 py-4"
                  : "h-auto justify-start rounded-none border-b border-b-slate-100 px-4 py-4 hover:bg-slate-50"
              }
              onClick={() => onSelectCustomer(record.customerId)}
            >
              <div className="flex w-full items-start gap-3 text-left">
                <div className="size-10 shrink-0 rounded-full border border-slate-200 bg-slate-100" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{record.customerFullName}</p>
                    <p className="text-xs text-slate-500">{formatElapsedTime(record.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
