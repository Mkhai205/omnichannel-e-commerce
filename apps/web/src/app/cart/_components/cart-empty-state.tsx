import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui";

export function CartEmptyState() {
    return (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <ShoppingBagIcon className="size-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Hãy khám phá thêm sản phẩm mới và thêm vào giỏ để bắt đầu mua sắm.
            </p>
            <div className="mt-6">
                <Button asChild className="bg-success text-white hover:bg-success/90">
                    <Link href="/">Tiếp tục mua sắm</Link>
                </Button>
            </div>
        </section>
    );
}
