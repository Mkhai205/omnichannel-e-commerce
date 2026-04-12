import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

const quickStats = [
    { label: "Total users", value: "--", hint: "API source will be wired in phase 3" },
    { label: "Total shops", value: "--", hint: "API source will be wired in phase 3" },
    { label: "Total products", value: "--", hint: "API source will be wired in phase 3" },
    { label: "Payments success rate", value: "--", hint: "API source will be wired in phase 3" },
];

const quickLinks = [
    { label: "Manage users", href: "/users" },
    { label: "Review shops", href: "/shops" },
    { label: "Moderate products", href: "/products" },
    { label: "Track orders", href: "/orders" },
    { label: "Review payments", href: "/payments" },
];

export default function DashboardPage() {
    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-slate-900">Operations dashboard</h1>
                <p className="text-sm text-slate-600">
                    Week-1 baseline is ready. KPI cards below are placeholders until dashboard API
                    is added.
                </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickStats.map((item) => (
                    <Card key={item.label} className="border-slate-200 bg-white">
                        <CardHeader className="pb-2">
                            <CardDescription>{item.label}</CardDescription>
                            <CardTitle className="text-3xl">{item.value}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500">{item.hint}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Quick actions</CardTitle>
                    <CardDescription>Go to week-1 admin modules</CardDescription>
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
        </section>
    );
}
