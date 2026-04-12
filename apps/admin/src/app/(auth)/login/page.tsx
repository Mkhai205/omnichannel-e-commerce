"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from "@/components/ui";
import { DASHBOARD_ROUTE } from "@/lib/auth-routes";
import { loginAdmin, logoutAdmin } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const nextPath = useMemo(() => {
        const fromQuery = searchParams.get("next");
        if (!fromQuery || !fromQuery.startsWith("/")) {
            return DASHBOARD_ROUTE;
        }
        return fromQuery;
    }, [searchParams]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const response = await loginAdmin({
                email: email.trim(),
                password,
            });

            if (response.user.status === "UNVERIFIED") {
                router.replace(`/verify-email?email=${encodeURIComponent(response.user.email)}`);
                return;
            }

            if (response.user.status === "BANNED") {
                await logoutAdmin();
                setErrorMessage("Tài khoản này hiện đang bị khóa");
                return;
            }

            router.replace(nextPath);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Hiện không thể đăng nhập, vui lòng thử lại");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="grid min-h-dvh place-items-center bg-slate-100 p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Đăng nhập quản trị</CardTitle>
                    <CardDescription>
                        Đăng nhập bằng tài khoản quản trị để truy cập bảng điều khiển vận hành
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Địa chỉ email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                                placeholder="quantri@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        {errorMessage ? (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {errorMessage}
                            </p>
                        ) : null}

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
