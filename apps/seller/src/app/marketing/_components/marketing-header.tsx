import { Button } from "@repo/ui";
import { BadgePlus, Zap } from "lucide-react";
import type { MarketingActionButton } from "../types";

type MarketingHeaderProps = {
  actions: MarketingActionButton[];
};

const iconByActionId = {
  "setup-flash-sale": Zap,
  "create-voucher": BadgePlus,
} as const;

export function MarketingHeader({ actions }: MarketingHeaderProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Chiến dịch Marketing</h1>
        <p className="mt-2 max-w-3xl text-balance text-lg leading-relaxed text-slate-500">
          Quản lý và theo dõi hiệu quả các chương trình ưu đãi của bạn với độ chính xác cao.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = iconByActionId[action.id];
          const isPrimary = action.style === "primary";

          return (
            <Button
              key={action.id}
              type="button"
              variant={isPrimary ? "default" : "outline"}
              className={
                isPrimary
                  ? "h-11 rounded-lg border border-blue-500 bg-blue-500 px-5 text-sm font-semibold text-white hover:bg-blue-500/90"
                  : "h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              }
              onClick={() => {}}
            >
              <Icon aria-hidden="true" data-icon="inline-start" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
