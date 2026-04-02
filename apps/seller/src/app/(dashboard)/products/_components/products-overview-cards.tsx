import { Card, CardContent } from "@repo/ui";
import { AlertTriangle, PackageCheck, PackageSearch, Store } from "lucide-react";
import type { ProductOverviewStats } from "../types";

type ProductsOverviewCardsProps = {
  stats: ProductOverviewStats;
};

export function ProductsOverviewCards({ stats }: ProductsOverviewCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-slate-200 bg-white shadow-none">
        <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Tổng hàng hóa</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-slate-800">{stats.totalGoodsCount.toLocaleString("en-US")}</p>
          </div>
          <span className="rounded-md bg-blue-100 p-2 text-blue-600">
            <Store aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>

      <Card className="border-emerald-100 bg-emerald-50/40 shadow-none">
        <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-emerald-600">Đang bán</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-emerald-700">{stats.sellingGoodsCount.toLocaleString("en-US")}</p>
          </div>
          <span className="rounded-md bg-emerald-100 p-2 text-emerald-700">
            <PackageCheck aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>

      <Card className="border-amber-100 bg-amber-50/40 shadow-none">
        <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-amber-600">Chưa đồng bộ</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-amber-700">{stats.unsyncedGoodsCount.toLocaleString("en-US")}</p>
          </div>
          <span className="rounded-md bg-amber-100 p-2 text-amber-700">
            <PackageSearch aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/40 shadow-none">
        <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-red-600">Số kênh</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-red-700">{stats.channelCount.toLocaleString("en-US")}</p>
          </div>
          <span className="rounded-md bg-red-100 p-2 text-red-700">
            <AlertTriangle aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>
    </section>
  );
}
