import { Button } from "@repo/ui";
import { ClipboardList, PackagePlus, PackageX } from "lucide-react";
import type { InventoryActionButton } from "../types";

type InventoryHeaderProps = {
  actions: InventoryActionButton[];
};

const iconByActionId = {
  "audit-report": ClipboardList,
  "stock-in": PackagePlus,
  "stock-out": PackageX,
} as const;

export function InventoryHeader({ actions }: InventoryHeaderProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Trung Tâm Điều Hành Kho</h1>
        <p className="mt-2 max-w-3xl text-justify text-lg text-slate-600">
          Kiểm soát dòng hàng hóa đa kênh, quản lý nhập xuất và tối ưu hóa mức tồn kho an toàn trên toàn hệ thống Global Merchant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                  ? "h-11 rounded-lg border border-blue-500 bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-500/90"
                  : "h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              }
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
