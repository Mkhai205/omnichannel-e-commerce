import { Button } from "@repo/ui";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import type { ProductActionButton } from "../types";

type ProductsHeaderProps = {
  actions: ProductActionButton[];
};

const iconByActionId = {
  "add-csv-file": FileSpreadsheet,
  "sync-all": RefreshCw,
} as const;

export function ProductsHeader({ actions }: ProductsHeaderProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Trung Tâm Quản Lý Sản Phẩm</h1>
        <p className="mt-2 max-w-3xl text-balance text-left text-lg leading-relaxed text-slate-600">
          Quản lý danh mục đa kênh, theo dõi trạng thái hiển thị và tối ưu tồn kho theo từng sản phẩm để đảm bảo vận hành ổn định.
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
                  ? "h-11 rounded-lg border border-blue-500 bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-500/90"
                  : "h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
