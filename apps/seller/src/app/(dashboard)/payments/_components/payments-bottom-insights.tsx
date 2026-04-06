import { Button, Card, CardContent } from "@/components/ui";
import { ArrowRight, BarChart3, Plus } from "lucide-react";
import type { PaymentMonthlyReport, PaymentSmartTip } from "../types";

type PaymentsBottomInsightsProps = {
  smartTip: PaymentSmartTip;
  monthlyReport: PaymentMonthlyReport;
  onReportClick: () => void;
  onFloatingActionClick: () => void;
};

export function PaymentsBottomInsights({
  smartTip,
  monthlyReport,
  onReportClick,
  onFloatingActionClick,
}: PaymentsBottomInsightsProps) {
  return (
    <section className="relative grid gap-5 xl:grid-cols-2">
      <Card className="border-slate-200 shadow-none">
        <CardContent className="grid min-h-56 gap-5 p-6 lg:grid-cols-[1fr_10rem] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{smartTip.title}</p>

            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {smartTip.heading} <span className="font-semibold text-blue-500">{smartTip.highlightedText}</span> {smartTip.description}
            </p>

            <Button
              type="button"
              variant="ghost"
              className="mt-4 h-auto p-0 text-xs font-semibold tracking-[0.08em] text-blue-500 hover:bg-transparent hover:text-blue-500"
            >
              {smartTip.linkLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>

          <div className="h-24 rounded-xl bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.9)_0%,rgba(15,23,42,0.95)_65%,rgba(2,6,23,1)_100%)] shadow-[inset_0_0_0_1px_rgba(125,211,252,0.2)]" />
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-none">
        <CardContent className="flex min-h-56 flex-col items-center justify-center px-6 py-6 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-500">
            <BarChart3 aria-hidden="true" />
          </span>

          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-800">{monthlyReport.heading}</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">{monthlyReport.description}</p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 h-10 rounded-xl border-blue-200 bg-blue-50 px-8 text-xs font-semibold tracking-[0.14em] text-blue-500 hover:bg-blue-100"
            onClick={onReportClick}
          >
            {monthlyReport.ctaLabel}
          </Button>
        </CardContent>
      </Card>

      <Button
        type="button"
        size="icon"
        aria-label="Thêm báo cáo mới"
        className="absolute right-0 bottom-0 size-16 translate-y-1/3 rounded-2xl bg-blue-500 text-white shadow-lg hover:bg-blue-500/90"
        onClick={onFloatingActionClick}
      >
        <Plus aria-hidden="true" className="size-6" />
      </Button>
    </section>
  );
}
