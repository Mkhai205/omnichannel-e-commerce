"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "@repo/ui";
import { resetPassword } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const currentToken = new URLSearchParams(window.location.search).get("token");
        setToken(currentToken ?? "");
        setIsReady(true);
    }, []);

    const canSubmit = useMemo(() => {
        return (
            token.length > 0 &&
            password.length >= 8 &&
            confirmPassword.length >= 8 &&
            password === confirmPassword &&
            !isSubmitting
        );
    }, [confirmPassword, isSubmitting, password, token.length]);

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await resetPassword(token, password);
            setSuccessMessage("Dat lai mat khau thanh cong. Ban co the dang nhap lai.");
        } catch (error) {
            const fallbackMessage = "Dat lai mat khau that bai. Vui long thu lai.";
            if (isApiRequestError(error)) {
                setErrorMessage(error.message || fallbackMessage);
            } else {
                setErrorMessage(fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isReady) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm text-slate-600">Dang tai du lieu...</p>
                </section>
            </main>
        );
    }

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">Lien ket khong hop le</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Lien ket reset password thieu token hoac da het han.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-600"
                    >
                        Gui lai lien ket dat mat khau
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Dat lai mat khau</h1>

                <div className="mt-6 grid gap-3">
                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Mat khau moi (toi thieu 8 ky tu)"
                        className="h-11 border-slate-200"
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Nhap lai mat khau moi"
                        className="h-11 border-slate-200"
                    />

                    <Button
                        type="button"
                        className="h-11 bg-blue-600 text-white hover:bg-blue-500"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Dang cap nhat..." : "Xac nhan"}
                    </Button>

                    {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
                    {successMessage ? (
                        <p className="text-sm text-emerald-700">{successMessage}</p>
                    ) : null}
                </div>

                <p className="mt-5 text-sm text-slate-600">
                    <Link href="/login" className="font-medium text-blue-700 hover:text-blue-600">
                        Quay lai dang nhap
                    </Link>
                </p>
            </section>
        </main>
    );
}
