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
            setErrorMessage("Email and password are required");
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
                setErrorMessage("This account is currently banned");
                return;
            }

            router.replace(nextPath);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to sign in right now");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="grid min-h-dvh place-items-center bg-slate-100 p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Admin sign in</CardTitle>
                    <CardDescription>
                        Sign in with an ADMIN account to access the operations console
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                                placeholder="Enter your password"
                            />
                        </div>

                        {errorMessage ? (
                            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {errorMessage}
                            </p>
                        ) : null}

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
