import { Card, CardContent, cn } from "@/components/ui";
import { Circle } from "lucide-react";
import type { MarketingOverviewStat } from "../types";

type MarketingOverviewCardsProps = {
  stats: MarketingOverviewStat[];
};

function formatMainValue(stat: MarketingOverviewStat) {
  if (stat.unit === "VND_M") {
    return `₫${stat.mainValue.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
  }

  if (stat.unit === "X") {
    return `${stat.mainValue.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`;
  }

  if (stat.unit === "PERCENT") {
    return `${stat.mainValue.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }

  return stat.mainValue.toLocaleString("en-US");
}

function formatTrendValue(trendPercent: number) {
  const absolute = Math.abs(trendPercent).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${trendPercent >= 0 ? "+" : "-"}${absolute}%`;
}

export function MarketingOverviewCards({ stats }: MarketingOverviewCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const isBlueTone = stat.tone === "blue";

        return (
          <Card key={stat.id} className={cn("shadow-none", isBlueTone ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-white")}>
            <CardContent className="flex min-h-48 flex-col items-center px-5 py-4 text-center">
              <p
                className={cn(
                  "flex h-12 items-start justify-center text-xs font-semibold uppercase tracking-[0.13em]",
                  isBlueTone ? "text-blue-600" : "text-slate-400",
                )}
              >
                {stat.title}
              </p>

              <div className="flex flex-1 items-center justify-center">
                <p className={cn("text-4xl font-semibold leading-none", isBlueTone ? "text-blue-500" : "text-slate-800")}>{formatMainValue(stat)}</p>
              </div>

              <div className="flex h-8 items-center justify-center">
                {typeof stat.trendPercent === "number" && stat.trendLabel ? (
                  <p className={cn("text-sm font-semibold", stat.trendPercent >= 0 ? "text-blue-500" : "text-red-500")}>
                    {formatTrendValue(stat.trendPercent)} {stat.trendLabel}
                  </p>
                ) : <span className="invisible text-sm">-</span>}

                {stat.healthLabel ? (
                  <p className="inline-flex items-center justify-center gap-1 text-sm text-slate-500">
                    <Circle aria-hidden="true" className="size-3" />
                    {stat.healthLabel}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
