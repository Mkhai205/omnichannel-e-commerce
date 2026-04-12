import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default function OrdersPage() {
    return (
        <section className="mx-auto w-full max-w-7xl pb-10">
            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Orders monitoring</CardTitle>
                    <CardDescription>
                        Week-1 scope focuses on setup and 3 existing modules. Orders API integration
                        is planned in the next sprint.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600">
                        Placeholder page is ready for routing and navigation.
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
