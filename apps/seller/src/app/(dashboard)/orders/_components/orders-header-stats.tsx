import { Card, CardContent } from "@repo/ui";
import type { Stats } from "../types";

type OrdersHeaderStatsProps = {
  stats: Stats;
};

export function OrdersHeaderStats({ stats }: OrdersHeaderStatsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Quản lý Đơn hàng</h1>
        <p className="mt-2 max-w-md text-xl text-slate-600">
          Theo dõi và xử lý đơn hàng từ tất cả các kênh bán lẻ của bạn.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="w-44 border-slate-200 bg-white shadow-none">
          <CardContent className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Chờ xác nhận</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-blue-500">{stats.pendingConfirmation}</p>
          </CardContent>
        </Card>

        <Card className="w-44 border-slate-200 bg-white shadow-none">
          <CardContent className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Đang giao</p>
            <p className="mt-2 text-4xl font-semibold leading-none text-slate-700">{stats.shipping}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
