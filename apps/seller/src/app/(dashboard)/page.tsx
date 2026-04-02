import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <Card className="min-h-[calc(100dvh-8.5rem)] border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Nội dung chính sẽ triển khai ở bước tiếp theo</CardTitle>
          <CardDescription>
            Header và Sidebar đã được dựng theo thiết kế. Khu vực này đang để trống theo đúng phạm vi hiện tại.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full" />
      </Card>
    </section>
  );
}
