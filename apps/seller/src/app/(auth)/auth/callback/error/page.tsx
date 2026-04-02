"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthCallbackErrorPage() {
    const [message, setMessage] = useState("Google login that bai");

    useEffect(() => {
        const queryMessage = new URLSearchParams(window.location.search).get("message");

        if (queryMessage) {
            setMessage(queryMessage);
        }
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Dang nhap Google that bai</h1>
                <p className="mt-3 text-sm text-rose-600">{message}</p>
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-blue-700 hover:text-blue-600"
                    >
                        Quay lai dang nhap
                    </Link>
                </div>
            </section>
        </main>
    );
}
