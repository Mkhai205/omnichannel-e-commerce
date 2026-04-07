import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { TopCustomer } from "../data/analytics-mock-data";

type TopCustomersCardProps = {
  customers: TopCustomer[];
};

export function TopCustomersCard({ customers }: TopCustomersCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3">
        <p className="text-2xl font-semibold uppercase tracking-wide text-slate-900">Khách hàng tiêu biểu</p>
        <Button type="button" variant="ghost" className="h-9 px-2 text-xs font-semibold uppercase tracking-widest text-blue-600 hover:bg-blue-50">
          Xem tất cả
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs uppercase tracking-widest text-slate-500">Khách hàng</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-slate-500">Tổng đơn</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest text-slate-500">LTV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg border border-slate-200 bg-slate-100" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-700">{customer.orders}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-slate-900">{customer.ltv}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
