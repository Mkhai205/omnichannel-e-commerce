import { Card, CardContent, cn } from "@/components/ui";
import { CircleCheck, PackageCheck, Truck, Undo2 } from "lucide-react";
import type { ShippingOverviewStat } from "../types";

type ShippingOverviewCardsProps = {
  stats: ShippingOverviewStat[];
};

const cardToneClassName = {
  blue: "border-slate-200 bg-white",
  sky: "border-slate-200 bg-white",
  green: "border-slate-200 bg-white",
  red: "border-slate-200 bg-white",
} as const;

const badgeToneClassName = {
  blue: "bg-blue-100 text-blue-600",
  sky: "bg-sky-100 text-sky-600",
  green: "bg-emerald-100 text-emerald-600",
  red: "bg-red-100 text-red-600",
} as const;

const iconToneClassName = {
  blue: "bg-blue-100 text-blue-600",
  sky: "bg-sky-100 text-sky-600",
  green: "bg-emerald-100 text-emerald-600",
  red: "bg-red-100 text-red-600",
} as const;

const iconByStat = {
  pickup: PackageCheck,
  transit: Truck,
  success: CircleCheck,
  return: Undo2,
} as const;

export function ShippingOverviewCards({ stats }: ShippingOverviewCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconByStat[stat.icon];

        return (
          <Card key={stat.id} className={cn("shadow-none", cardToneClassName[stat.tone])}>
            <CardContent className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", iconToneClassName[stat.tone])}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", badgeToneClassName[stat.tone])}>{stat.badgeText}</span>
              </div>

              <p className="mt-5 text-4xl font-semibold leading-none text-slate-800">{stat.value.toLocaleString("en-US")}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
