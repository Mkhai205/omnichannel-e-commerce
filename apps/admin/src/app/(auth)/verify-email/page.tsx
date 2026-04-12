import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type VerifyEmailPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
    const params = (await searchParams) ?? {};
    const rawEmail = params.email;
    const email = typeof rawEmail === "string" ? rawEmail : "";

    return (
        <main className="grid min-h-dvh place-items-center bg-slate-100 p-4">
            <Card className="w-full max-w-xl border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Xác minh email của bạn</CardTitle>
                    <CardDescription>
                        Tài khoản của bạn chưa được xác minh. Vui lòng xác minh email trước khi sử
                        dụng trang quản trị.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Tài khoản:{" "}
                        <span className="font-medium text-slate-900">
                            {email || "Không xác định"}
                        </span>
                    </p>
                    <p className="text-sm text-slate-600">
                        Nếu bạn đã xác minh tài khoản, hãy đăng nhập lại.
                    </p>
                    <Button asChild>
                        <Link href="/login">Quay lại đăng nhập</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
