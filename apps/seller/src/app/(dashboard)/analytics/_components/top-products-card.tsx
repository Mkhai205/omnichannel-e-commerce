import { Button, Card, CardContent, CardHeader } from "@repo/ui";
import { ListFilter } from "lucide-react";
import type { TopProduct } from "../data/analytics-mock-data";

type TopProductsCardProps = {
  products: TopProduct[];
};

export function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3">
        <p className="text-2xl font-semibold uppercase tracking-wide text-slate-900">Sản phẩm bán chạy nhất</p>
        <Button type="button" variant="ghost" size="icon" className="size-9 rounded-lg text-slate-600 hover:bg-slate-100">
          <ListFilter aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent className="grid gap-5">
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
            <div className="size-14 rounded-lg border border-slate-200 bg-slate-100" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-xs text-slate-500">{product.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{product.soldCount}</p>
              <p className="text-xs text-slate-500">{product.revenue}</p>
              <p className="text-xs font-semibold text-blue-600">{product.growth}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
