import Link from "next/link";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";

export default function Home() {
    return (
        <>
            <SiteBreadcrumb section="Trang" current="Trang chủ" />

            <main className="bg-background px-6 py-16 text-foreground">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h1 className="text-3xl font-semibold">Hệ thống web đã được cấu trúc lại</h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Bố cục tổng thể hiện đã dùng layout chung cho toàn bộ website. Các trang
                        đăng nhập và đăng ký đã kết nối API xác thực và bám giao diện theo Figma.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <Link
                            href="/login"
                            className="rounded-lg bg-success px-4 py-3 text-center text-sm font-semibold text-success-foreground"
                        >
                            Đi đến Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold"
                        >
                            Đi đến Đăng ký
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Kiểm tra route cần đăng nhập</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <Link href="/account" className="underline underline-offset-4">
                                /account
                            </Link>
                            <Link href="/checkout" className="underline underline-offset-4">
                                /checkout
                            </Link>
                            <Link href="/orders" className="underline underline-offset-4">
                                /orders
                            </Link>
                            <Link href="/wishlist" className="underline underline-offset-4">
                                /wishlist
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
