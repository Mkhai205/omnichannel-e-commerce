"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "@repo/ui";
import { forgotPassword } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const canSubmit = email.trim().length > 0 && !isSubmitting;

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await forgotPassword(email.trim().toLowerCase());
            setSuccessMessage("Neu email ton tai, lien ket dat lai mat khau da duoc gui.");
        } catch (error) {
            const fallbackMessage = "Khong the gui yeu cau luc nay. Vui long thu lai.";
            if (isApiRequestError(error)) {
                setErrorMessage(error.message || fallbackMessage);
            } else {
                setErrorMessage(fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Quen mat khau</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Nhap email de nhan lien ket dat lai mat khau.
                </p>

                <div className="mt-6 grid gap-3">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seller@example.com"
                        className="h-11 border-slate-200"
                    />
                    <Button
                        type="button"
                        className="h-11 bg-blue-600 text-white hover:bg-blue-500"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Dang xu ly..." : "Gui yeu cau"}
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
