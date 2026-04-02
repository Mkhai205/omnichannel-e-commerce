import { Button, Card, CardContent, CardHeader } from "@repo/ui";
import { Download, Ellipsis } from "lucide-react";
import type { RevenuePoint } from "../data/analytics-mock-data";

type RevenueCardProps = {
  title: string;
  total: string;
  growth: string;
  points: RevenuePoint[];
};

export function RevenueCard({ title, total, growth, points }: RevenueCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="grid gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold uppercase tracking-wide text-slate-900">{title}</p>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-5xl font-semibold tracking-tight text-slate-900">{total}</p>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">{growth}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg border-slate-200 text-slate-600">
              <Download aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg border-slate-200 text-slate-600">
              <Ellipsis aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl bg-slate-50 px-4 pb-4 pt-6">
          <div className="grid grid-cols-4 items-end gap-0">
            {points.map((point) => (
              <div key={point.month} className="flex flex-col items-center gap-3">
                <div className={`relative w-full ${point.baselineHeight} rounded-t-md bg-slate-200/70`}>
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${point.barHeight} rounded-t-md ${point.isHighlighted ? "bg-blue-500" : "bg-blue-200"}`}
                  />
                </div>
                <span className={point.isHighlighted ? "text-xs font-semibold text-blue-600" : "text-xs font-semibold text-slate-500"}>{point.month}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
