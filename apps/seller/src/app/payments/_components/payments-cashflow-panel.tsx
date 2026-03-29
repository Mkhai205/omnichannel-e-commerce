import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { cn } from "@repo/ui";
import type { CashflowLegendItem, CashflowPoint } from "../types";

type PaymentsCashflowPanelProps = {
  legend: CashflowLegendItem[];
  points: CashflowPoint[];
};

export function PaymentsCashflowPanel({ legend, points }: PaymentsCashflowPanelProps) {
  const columnTemplate = `repeat(${Math.max(1, points.length)}, minmax(0, 1fr))`;

  const highestValue = Math.max(
    ...points.flatMap((point) => [point.revenue, point.platformFee, point.profit]),
  );

  const getBarHeightPercent = (value: number) => {
    const normalized = highestValue === 0 ? 0 : (value / highestValue) * 100;

    // Keep very small bars visible in the mock chart.
    return Math.max(8, normalized);
  };

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="gap-4 px-5 pt-5 pb-0 lg:px-6 lg:pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-800">Biểu đồ dòng tiền</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Dữ liệu 30 ngày gần nhất (Tất cả các kênh)</p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {legend.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-500">
                <span className={cn("size-2.5 rounded-full", item.dotClassName)} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 lg:px-6 lg:pb-6">
        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/35 px-4 py-4 lg:px-5">
          <div className="grid h-72 gap-2 border-b-2 border-slate-200 pb-2" style={{ gridTemplateColumns: columnTemplate }}>
            {points.map((point) => (
              <div key={point.label} className="flex min-w-0 flex-col justify-end">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[10px] font-semibold text-blue-500">{point.revenue}</span>
                    <span className="w-full rounded-t bg-blue-500/90" style={{ height: `${getBarHeightPercent(point.revenue)}%` }} />
                  </div>

                  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[10px] font-semibold text-amber-500">{point.platformFee}</span>
                    <span className="w-full rounded-t bg-amber-400" style={{ height: `${getBarHeightPercent(point.platformFee)}%` }} />
                  </div>

                  <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[10px] font-semibold text-emerald-500">{point.profit}</span>
                    <span className="w-full rounded-t bg-emerald-500/90" style={{ height: `${getBarHeightPercent(point.profit)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-3 grid gap-3 text-center text-xs font-semibold tracking-wide text-slate-500 lg:text-sm"
            style={{ gridTemplateColumns: columnTemplate }}
          >
            {points.map((point) => (
              <span key={point.label} className={cn("truncate", point.emphasize && "text-blue-500")}>
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
