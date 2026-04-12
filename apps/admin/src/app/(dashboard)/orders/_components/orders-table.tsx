import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { OrderStatus, SettlementStatus } from "@repo/shared-types";
import type { AdminOrdersTableRow } from "../types";

type OrdersTableProps = {
    rows: AdminOrdersTableRow[];
    isLoading?: boolean;
    onRowClick: (orderId: string) => void;
};

function getStatusClassName(status: OrderStatus) {
    if (status === "PENDING_PAYMENT") return "border-blue-200 bg-blue-100 text-blue-600";
    if (status === "PAID") return "border-green-200 bg-green-100 text-green-700";
    if (status === "PROCESSING" || status === "SHIPPED") {
        return "border-amber-200 bg-amber-100 text-amber-700";
    }
    if (status === "DELIVERED") return "border-emerald-200 bg-emerald-100 text-emerald-700";
    return "border-rose-200 bg-rose-100 text-rose-700";
}

function getSettlementClassName(status: SettlementStatus) {
    if (status === "SETTLED") {
        return "border-emerald-200 bg-emerald-100 text-emerald-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-700";
}

function formatCurrency(value: string) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0d";
    }

    return `${amount.toLocaleString("vi-VN")}d`;
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
}

export function OrdersTable({ rows, isLoading = false, onRowClick }: OrdersTableProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-100">
                        <TableHead className="font-semibold">Order</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Shop</TableHead>
                        <TableHead className="font-semibold">Placed</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                        <TableHead className="text-center font-semibold">Status</TableHead>
                        <TableHead className="text-center font-semibold">Settlement</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Loading orders...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                No matching orders found.
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading
                        ? rows.map((row) => (
                              <TableRow
                                  key={row.id}
                                  className="cursor-pointer transition-colors hover:bg-slate-50"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => onRowClick(row.id)}
                                  onKeyDown={(event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          onRowClick(row.id);
                                      }
                                  }}
                              >
                                  <TableCell className="font-semibold text-blue-600">
                                      {row.orderNumber}
                                  </TableCell>
                                  <TableCell>
                                      <div className="grid gap-0.5">
                                          <span className="text-sm text-slate-900">
                                              {row.customerName}
                                          </span>
                                          <span className="text-xs text-slate-500">
                                              {row.customerEmail}
                                          </span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-sm text-slate-700">
                                      {row.shopName}
                                  </TableCell>
                                  <TableCell className="text-sm text-slate-700">
                                      {formatDate(row.createdAt)}
                                  </TableCell>
                                  <TableCell className="text-right text-sm font-semibold text-slate-700">
                                      {formatCurrency(row.totalAmount)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                      <span
                                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusClassName(row.status)}`}
                                      >
                                          {row.status}
                                      </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                      <span
                                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getSettlementClassName(row.settlementStatus)}`}
                                      >
                                          {row.settlementStatus}
                                      </span>
                                  </TableCell>
                              </TableRow>
                          ))
                        : null}
                </TableBody>
            </Table>
        </section>
    );
}
