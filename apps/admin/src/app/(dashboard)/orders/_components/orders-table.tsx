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

function getStatusLabel(status: OrderStatus): string {
    if (status === "PENDING_PAYMENT") return "Chờ thanh toán";
    if (status === "PAID") return "Đã thanh toán";
    if (status === "PROCESSING") return "Đang xử lý";
    if (status === "SHIPPED") return "Đang giao";
    if (status === "DELIVERED") return "Đã giao";
    return "Đã hủy";
}

function getSettlementLabel(status: SettlementStatus): string {
    if (status === "SETTLED") return "Đã đối soát";
    return "Chờ đối soát";
}

function formatCurrency(value: string) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0đ";
    }

    return `${amount.toLocaleString("vi-VN")}đ`;
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
                        <TableHead className="font-semibold">Đơn hàng</TableHead>
                        <TableHead className="font-semibold">Khách hàng</TableHead>
                        <TableHead className="font-semibold">Cửa hàng</TableHead>
                        <TableHead className="font-semibold">Ngày đặt</TableHead>
                        <TableHead className="text-right font-semibold">Tổng tiền</TableHead>
                        <TableHead className="text-center font-semibold">Trạng thái</TableHead>
                        <TableHead className="text-center font-semibold">Đối soát</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Đang tải đơn hàng...
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {!isLoading && rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-10 text-center text-sm text-slate-500"
                            >
                                Không tìm thấy đơn hàng phù hợp.
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
                                          {getStatusLabel(row.status)}
                                      </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                      <span
                                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getSettlementClassName(row.settlementStatus)}`}
                                      >
                                          {getSettlementLabel(row.settlementStatus)}
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
