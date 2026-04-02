import { Card, CardContent, CardHeader } from "@repo/ui";
import type { ChannelShare } from "../data/analytics-mock-data";

type ChannelRateCardProps = {
  title: string;
  percent: number;
  channels: ChannelShare[];
};

export function ChannelRateCard({ title, percent, channels }: ChannelRateCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <p className="text-xl font-semibold uppercase tracking-wide text-slate-900">{title}</p>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="mx-auto flex size-44 items-center justify-center rounded-full bg-[conic-gradient(#3b82f6_0_65%,#64748b_65%_90%,#cbd5e1_90%_100%)] p-4">
          <div className="flex size-full flex-col items-center justify-center rounded-full bg-white">
            <p className="text-4xl font-semibold text-slate-900">{percent}%</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Tăng trưởng</p>
          </div>
        </div>

        <div className="grid gap-4">
          {channels.map((channel) => (
            <div key={channel.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className={`size-2.5 rounded-sm ${channel.colorClassName}`} />
              <p className="text-sm font-medium text-slate-700">{channel.name}</p>
              <p className="text-sm font-semibold text-slate-900">{channel.percent}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
