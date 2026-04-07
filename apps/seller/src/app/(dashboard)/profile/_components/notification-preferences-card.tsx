"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { TuyChonThongBao } from "../types";

type NotificationPreferencesCardProps = {
  items: TuyChonThongBao[];
};

function StaticToggle({
  isOn,
  label,
  onToggle,
}: {
  isOn: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isOn}
      aria-label={`${label}: ${isOn ? "Đang bật" : "Đang tắt"}`}
      onClick={onToggle}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        isOn ? "bg-blue-500" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
          isOn ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export function NotificationPreferencesCard({ items }: NotificationPreferencesCardProps) {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((item) => [item.id, item.dangBat])),
  );

  const handleToggle = (id: string) => {
    setToggleStates((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-slate-800">Tùy chọn thông báo</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-800">{item.tieuDe}</p>
              <p className="text-xs text-slate-500">{item.moTa}</p>
            </div>
            <StaticToggle
              isOn={toggleStates[item.id] ?? item.dangBat}
              label={item.tieuDe}
              onToggle={() => handleToggle(item.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
