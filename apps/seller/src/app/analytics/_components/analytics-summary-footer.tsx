import { Button, Card, CardContent } from "@repo/ui";
import { Download, Share2 } from "lucide-react";

type SummaryMetric = {
  id: string;
  label: string;
  value: string;
};

type AnalyticsSummaryFooterProps = {
  metrics: SummaryMetric[];
};

export function AnalyticsSummaryFooter({ metrics }: AnalyticsSummaryFooterProps) {
  return (
    <Card className="border-slate-200 bg-slate-50">
      <CardContent className="grid gap-4 py-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center">
        {metrics.map((metric) => (
          <div key={metric.id}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
          </div>
        ))}

        <Button type="button" variant="outline" className="h-12 rounded-lg border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700">
          <Share2 aria-hidden="true" data-icon="inline-start" />
          Chia sẻ báo cáo
        </Button>
        <Button type="button" variant="default" className="h-12 rounded-lg bg-blue-500 px-6 text-sm font-semibold text-white hover:bg-blue-500/90">
          <Download aria-hidden="true" data-icon="inline-start" />
          Xuất dữ liệu PDF
        </Button>
      </CardContent>
    </Card>
  );
}
