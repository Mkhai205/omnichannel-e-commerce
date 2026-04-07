import {
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import type { SellerOrderDetailResponse } from "@repo/shared-types";
import { formatCurrency } from "../utils/order-detail-format";

type OrderItemsTableProps = {
    items: SellerOrderDetailResponse["items"];
};

export function OrderItemsTable({ items }: OrderItemsTableProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <CardContent className="px-0 py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead className="w-[20%] text-center font-extrabold uppercase">
                                Sản phẩm
                            </TableHead>
                            <TableHead className="text-center font-extrabold uppercase">
                                SKU
                            </TableHead>
                            <TableHead className="text-center font-extrabold uppercase">
                                Số lượng
                            </TableHead>
                            <TableHead className="text-center font-extrabold uppercase">
                                Đơn giá
                            </TableHead>
                            <TableHead className="text-center font-extrabold uppercase">
                                Thành tiền
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-sm text-slate-500"
                                >
                                    Đơn hàng chưa có sản phẩm.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id} className="border-slate-200">
                                    <TableCell className="px-4 py-4 text-sm font-medium text-center text-slate-800">
                                        {item.productName}
                                    </TableCell>
                                    <TableCell className="px-4 py-4  text-center text-slate-600">
                                        {item.variantSku}
                                    </TableCell>
                                    <TableCell className="px-4 py-4  text-center text-slate-600">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-4  text-center text-slate-600">
                                        {formatCurrency(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="px-4 py-4  text-center font-semibold text-slate-800">
                                        {formatCurrency(item.lineTotal)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </section>
    );
}
