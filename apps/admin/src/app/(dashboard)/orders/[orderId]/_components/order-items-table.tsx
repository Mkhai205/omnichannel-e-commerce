import type { SellerOrderDetailItem } from "@repo/shared-types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";

type OrderItemsTableProps = {
    items: SellerOrderDetailItem[];
};

function formatCurrency(value: string): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0d";
    }

    return `${amount.toLocaleString("vi-VN")}d`;
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Unit</TableHead>
                            <TableHead className="text-right">Line total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    No items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="grid gap-0.5">
                                            <span className="text-sm font-medium text-slate-900">
                                                {item.productName}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {item.productId}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.variantSku}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(item.lineTotal)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
