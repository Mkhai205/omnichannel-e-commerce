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
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                        Your account is not verified yet. Complete email verification before using
                        the admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Account:{" "}
                        <span className="font-medium text-slate-900">{email || "Unknown"}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                        If you already verified the account, sign in again.
                    </p>
                    <Button asChild>
                        <Link href="/login">Back to login</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
