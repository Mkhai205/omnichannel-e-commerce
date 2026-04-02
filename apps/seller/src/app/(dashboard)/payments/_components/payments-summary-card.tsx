import { Card, CardContent } from "@repo/ui";
import { TrendingUp } from "lucide-react";
import type { PaymentSummaryMetric } from "../types";

type PaymentsSummaryCardProps = {
  metric: PaymentSummaryMetric;
};

export function PaymentsSummaryCard({ metric }: PaymentsSummaryCardProps) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardContent className="px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{metric.title}</p>
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
            <TrendingUp aria-hidden="true" />
          </span>
        </div>

        <p className="mt-4 text-4xl leading-none text-slate-800">
          {metric.totalRevenueBillions.toFixed(2)}B<span className="ml-1 text-xl text-slate-500">VND</span>
        </p>

        <p className="mt-4 inline-flex items-center rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600">
          ↑ +{metric.trendPercent}% {metric.trendLabel}
        </p>
      </CardContent>
    </Card>
  );
}
