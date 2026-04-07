import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { Sparkles } from "lucide-react";

export function MarketingAiInsight() {
    const handleTryNowClick = () => undefined;

    return (
        <section className="grid gap-4 lg:grid-cols-[2fr_0.9fr]">
            <Card className="relative overflow-hidden border-slate-800 bg-slate-950 text-slate-100 shadow-none">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_50%,rgba(56,189,248,0.26),transparent_58%),radial-gradient(90%_100%_at_100%_0%,rgba(2,6,23,0.9),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.9)_0%,rgba(15,23,42,0.78)_42%,rgba(2,6,23,0.9)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[44px_44px]" />
                </div>

                <CardHeader className="relative z-10 min-h-60 justify-center gap-4 px-6 py-8 sm:px-8">
                    <span className="inline-flex w-fit rounded-md bg-blue-500 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
                        MẸO TỐI ƯU
                    </span>

                    <CardTitle className="max-w-4xl text-3xl leading-tight text-slate-50 lg:text-4xl">
                        Voucher giảm 15% đạt hiệu quả cao nhất vào khung giờ 20:00 - 22:00
                    </CardTitle>

                    <CardDescription className="max-w-3xl text-lg leading-relaxed text-slate-300">
                        Cân nhắc lên lịch các chiến dịch Flash Sale tiếp vào khung giờ vàng để tối
                        ưu hóa tỷ lệ chuyển đổi khách hàng.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="border-blue-500 bg-blue-500 text-white shadow-none">
                <CardHeader className="min-h-60 justify-between px-6 py-8">
                    <div className="space-y-5">
                        <div className="inline-flex size-9 items-center justify-center rounded-full bg-white/15">
                            <Sparkles aria-hidden="true" className="text-white" />
                        </div>

                        <div className="space-y-3">
                            <CardTitle className="text-4xl leading-tight text-white">
                                Dự đoán AI
                            </CardTitle>
                            <CardDescription className="text-xl leading-relaxed text-white/90">
                                Dựa trên xu hướng mua sắm, việc tạo chương trình &quot;Mua 1 tặng
                                1&quot; cho danh mục Phụ kiện vào cuối tuần này có thể tăng doanh số
                                lên tới 35%.
                            </CardDescription>
                        </div>
                    </div>

                    <CardFooter className="p-0">
                        <Button
                            type="button"
                            className="h-12 w-full rounded-xl bg-white text-sm font-semibold tracking-[0.12em] text-blue-600 hover:bg-white/90"
                            onClick={handleTryNowClick}
                        >
                            THỬ NGAY
                        </Button>
                    </CardFooter>
                </CardHeader>
            </Card>
        </section>
    );
}
