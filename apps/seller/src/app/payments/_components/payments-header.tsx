import { Button } from "@repo/ui";
import { Download, FileText } from "lucide-react";
import type { PaymentHeaderAction } from "../types";

type PaymentsHeaderProps = {
  actions: PaymentHeaderAction[];
  onActionClick: (actionId: PaymentHeaderAction["id"]) => void;
};

const iconByActionId = {
  "export-pdf": FileText,
  "export-excel": Download,
} as const;

export function PaymentsHeader({ actions, onActionClick }: PaymentsHeaderProps) {
  return (
    <section className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Đối soát Tài chính</h1>
        <p className="mt-2 max-w-3xl text-balance text-lg leading-relaxed text-slate-500">
          Quản lý dòng tiền, kiểm soát chênh lệch doanh thu sàn và thực tế định kỳ.
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
                  ? "h-11 rounded-xl border border-blue-500 bg-blue-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500/90"
                  : "h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              }
              onClick={() => onActionClick(action.id)}
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
