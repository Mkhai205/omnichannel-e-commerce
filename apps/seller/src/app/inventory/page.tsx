import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";

export default function InventoryPage() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <Card className="min-h-[calc(100dvh-8.5rem)] border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Trang Inventory đang ở trạng thái giao diện tĩnh để triển khai nội dung chi tiết ở bước sau.</CardDescription>
        </CardHeader>
        <CardContent className="h-full" />
      </Card>
    </section>
  );
}
