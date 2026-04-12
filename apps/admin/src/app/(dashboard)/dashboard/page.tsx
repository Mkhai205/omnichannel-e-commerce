"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AdminDashboardKpiResponse } from "@repo/shared-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import { getAdminDashboardKpi } from "@/services/finance-service";

const quickLinks = [
    { label: "Manage users", href: "/users" },
    { label: "Review shops", href: "/shops" },
    { label: "Moderate products", href: "/products" },
    { label: "Track orders", href: "/orders" },
    { label: "Review payments", href: "/payments" },
];

function formatCurrency(value: string): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "0d";
    }

    return `${amount.toLocaleString("vi-VN")}d`;
}

function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}

export default function DashboardPage() {
    const [kpi, setKpi] = useState<AdminDashboardKpiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchKpi = async () => {
            setIsLoading(true);

            try {
                const response = await getAdminDashboardKpi();
                if (!isMounted) {
                    return;
                }

                setKpi(response);
                setErrorMessage(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (isApiRequestError(error)) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Unable to load dashboard KPI");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchKpi();

        return () => {
            isMounted = false;
        };
    }, []);

    const maxTrendValue = useMemo(() => {
        if (!kpi || kpi.trend.length === 0) {
            return 1;
        }

        return Math.max(...kpi.trend.map((point) => point.gmv), 1);
    }, [kpi]);

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-slate-900">Operations dashboard</h1>
                <p className="text-sm text-slate-600">
                    Real-time snapshot for users, shops, orders, payments and settlements.
                </p>
            </header>

            {errorMessage ? (
                <Card className="border-rose-200 bg-rose-50">
                    <CardContent className="px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </CardContent>
                </Card>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total users</CardDescription>
                        <CardTitle className="text-3xl">
                            {isLoading || !kpi ? "..." : kpi.totalUsers.toLocaleString("vi-VN")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">
                            {isLoading || !kpi
                                ? "Loading..."
                                : `${kpi.totalShops.toLocaleString("vi-VN")} shops (${kpi.pendingShops} pending)`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total orders</CardDescription>
                        <CardTitle className="text-3xl">
                            {isLoading || !kpi ? "..." : kpi.totalOrders.toLocaleString("vi-VN")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">
                            {isLoading || !kpi
                                ? "Loading..."
                                : `${kpi.todayOrders.toLocaleString("vi-VN")} new orders today`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total GMV</CardDescription>
                        <CardTitle className="text-3xl">
                            {isLoading || !kpi ? "..." : formatCurrency(kpi.totalGmv)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">Paid and fulfilled order value</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Payment success rate</CardDescription>
                        <CardTitle className="text-3xl">
                            {isLoading || !kpi ? "..." : formatPercent(kpi.paymentSuccessRate)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">
                            {isLoading || !kpi
                                ? "Loading..."
                                : `${kpi.successfulPayments}/${kpi.totalPayments} successful`}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle>GMV trend (7 days)</CardTitle>
                        <CardDescription>
                            Daily completed GMV for operational monitoring
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading || !kpi ? (
                            <p className="text-sm text-slate-500">Loading trend...</p>
                        ) : kpi.trend.length === 0 ? (
                            <p className="text-sm text-slate-500">No trend data available</p>
                        ) : (
                            <div className="grid grid-cols-7 items-end gap-2">
                                {kpi.trend.map((point) => {
                                    const barHeight = Math.max(
                                        8,
                                        Math.round((point.gmv / maxTrendValue) * 120),
                                    );

                                    return (
                                        <div
                                            key={point.label}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div className="text-[11px] text-slate-500">
                                                {point.orderCount} orders
                                            </div>
                                            <div className="flex h-32 items-end">
                                                <div
                                                    className="w-9 rounded-t-md bg-slate-800"
                                                    style={{ height: `${barHeight}px` }}
                                                    title={`${point.label}: ${point.gmv.toLocaleString("vi-VN")}d`}
                                                />
                                            </div>
                                            <div className="text-xs font-medium text-slate-600">
                                                {point.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle>Finance alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-700">
                            <p>
                                Pending payments: {isLoading || !kpi ? "..." : kpi.pendingPayments}
                            </p>
                            <p>
                                Pending settlements:{" "}
                                {isLoading || !kpi ? "..." : kpi.pendingSettlements}
                            </p>
                            <p className="text-xs text-slate-500">
                                Last sync:{" "}
                                {isLoading || !kpi
                                    ? "..."
                                    : new Date(kpi.generatedAt).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle>Quick actions</CardTitle>
                            <CardDescription>Navigate to key admin modules</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </section>
    );
}
