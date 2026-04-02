"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { verifyEmail } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function VerifyEmailPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const queryEmail = query.get("email");
        const queryToken = query.get("token");

        setEmail(queryEmail);
        setToken(queryToken);
        setStatus(queryToken ? "loading" : "idle");
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }

        let isMounted = true;

        const verify = async () => {
            try {
                await verifyEmail(token);
                if (isMounted) {
                    setStatus("success");
                }
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setStatus("error");
                const fallbackMessage = "Xac minh email that bai hoac token da het han.";
                if (isApiRequestError(error)) {
                    setErrorMessage(error.message || fallbackMessage);
                } else {
                    setErrorMessage(fallbackMessage);
                }
            }
        };

        void verify();

        return () => {
            isMounted = false;
        };
    }, [token]);

    const title = useMemo(() => {
        if (status === "loading") {
            return "Dang xac minh email...";
        }

        if (status === "success") {
            return "Email da duoc xac minh";
        }

        if (status === "error") {
            return "Khong the xac minh email";
        }

        return "Xac minh email";
    }, [status]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

                {status === "idle" ? (
                    <p className="mt-3 text-sm text-slate-600">
                        Chung toi da gui email xac minh{email ? ` den ${email}` : ""}. Vui long mo
                        hop thu va bam vao lien ket xac minh.
                    </p>
                ) : null}

                {status === "loading" ? (
                    <p className="mt-3 text-sm text-slate-600">
                        He thong dang xu ly lien ket xac minh cua ban.
                    </p>
                ) : null}

                {status === "success" ? (
                    <p className="mt-3 text-sm text-emerald-700">
                        Ban co the dang nhap de tiep tuc onboarding seller.
                    </p>
                ) : null}

                {status === "error" ? (
                    <p className="mt-3 text-sm text-rose-600">
                        {errorMessage ?? "Lien ket khong hop le hoac da het han."}
                    </p>
                ) : null}

                <div className="mt-6">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-blue-700 hover:text-blue-600"
                    >
                        Di den trang dang nhap
                    </Link>
                </div>
            </section>
        </main>
    );
}
