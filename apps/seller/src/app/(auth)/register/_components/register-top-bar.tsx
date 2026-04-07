import Link from "next/link";
import { Button } from "@/components/ui";

export function RegisterTopBar() {
    return (
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 lg:px-10">
            <Link href="/" className="text-3xl font-semibold tracking-tight text-slate-900">
                OmniShop
            </Link>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 lg:text-sm">
                <Link href="#" className="transition-colors hover:text-slate-700">
                    Hỗ trợ
                </Link>
                <Link href="#" className="transition-colors hover:text-slate-700">
                    Trung tâm trợ giúp
                </Link>
                <Button
                    type="button"
                    variant="secondary"
                    className="h-8 rounded-md bg-slate-100 px-3 text-xs text-blue-600 hover:bg-slate-200 lg:h-9 lg:px-4 lg:text-sm"
                >
                    Liên hệ kinh doanh
                </Button>
            </div>
        </header>
    );
}
