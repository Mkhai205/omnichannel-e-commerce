import { Card, CardContent } from "@repo/ui";
import { TrendingUp } from "lucide-react";
import type { InventoryOverviewStats } from "../types";

type InventoryOverviewCardsProps = {
  stats: InventoryOverviewStats;
};

export function InventoryOverviewCards({ stats }: InventoryOverviewCardsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
      <Card className="border-slate-200 bg-white shadow-none">
        <CardContent className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">TỔNG GIÁ TRỊ TỒN KHO</p>
          <p className="mt-3 text-5xl font-semibold leading-none text-slate-800">
            {stats.totalInventoryValue} <span className="text-4xl font-medium text-slate-500">{stats.totalInventoryCurrency}</span>
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <TrendingUp aria-hidden="true" className="size-4" />
            {stats.monthlyGrowthPercent}
          </span>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/60 shadow-none">
        <CardContent className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-500">CẢNH BÁO TỒN KHO</p>
          <p className="mt-2 text-4xl font-semibold leading-none text-red-700">{stats.lowStockCount}</p>
          <p className="mt-1.5 text-lg font-semibold leading-tight text-red-600">{stats.lowStockLabel}</p>
          <button type="button" className="mt-2.5 text-base font-semibold text-red-600 underline decoration-red-300 underline-offset-4">
            {stats.lowStockCta}
          </button>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-none">
        <CardContent className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">VẬN HÀNH TRONG NGÀY</p>
          <dl className="mt-3 grid gap-2.5 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-4">
              <dt>Nhập kho</dt>
              <dd className="text-xl font-semibold">{stats.inboundToday} đơn</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Xuất kho</dt>
              <dd className="text-xl font-semibold">{stats.outboundToday} đơn</dd>
            </div>
          </dl>

          <div className="mt-4 h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${stats.inboundProgressPercent}%` }} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
