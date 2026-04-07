import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { CustomerComplaintRecord } from "../data/customer-service-local-database";
import type { CustomerProfile } from "../data/customer-service-mock-data";

type CustomerInsightPanelProps = {
  profile: CustomerProfile;
  selectedRecord?: CustomerComplaintRecord;
};

function formatElapsedTime(createdAt?: string): string {
  if (!createdAt) {
    return "-";
  }

  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffInMinutes = Math.max(0, Math.floor((now - created) / (1000 * 60)));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

function getDisplayEmail(fullName: string): string {
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join(".");

  return `${normalized}@email.com`;
}

export function CustomerInsightPanel({ profile, selectedRecord }: CustomerInsightPanelProps) {
  const displayName = selectedRecord?.customerFullName ?? profile.fullName;
  const displayEmail = getDisplayEmail(displayName);
  const latestComplaintTime = formatElapsedTime(selectedRecord?.createdAt);
  const complaintStatusLabel = selectedRecord?.complaintStatus === "ĐANG_XỬ_LÝ" ? "ĐANG XỬ LÝ" : "ĐANG CHỜ";

  return (
    <div className="grid min-w-0 gap-4">
      <Card className="border-slate-200 bg-white">
        <CardHeader className="min-w-0 justify-items-center pb-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600">MH</div>
          <CardTitle className="truncate text-lg text-slate-900">{displayName}</CardTitle>
          <CardDescription className="w-full truncate">{displayEmail}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3">
          <div className="grid grid-cols-1 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Tổng đơn hàng</p>
              <p className="mt-1.5 text-xl font-semibold text-slate-900">{profile.totalOrders}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Chi tiêu</p>
              <p className="mt-1.5 text-xl font-semibold text-blue-600">{profile.totalSpend}</p>
            </div>
          </div>

          <div className="grid gap-2 text-sm text-slate-600">
            <p className="flex flex-col items-start gap-0.5">
              <span className="text-slate-500">Tham gia từ</span>
              <span className="truncate font-semibold text-slate-900">{profile.memberSince}</span>
            </p>
            <p className="flex flex-col items-start gap-0.5">
              <span className="text-slate-500">Khu vực</span>
              <span className="truncate font-semibold text-slate-900">{profile.location}</span>
            </p>
            <p className="flex flex-col items-start gap-0.5">
              <span className="text-slate-500">Mua gần nhất</span>
              <span className="truncate font-semibold text-slate-900">{profile.lastPurchase}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-4">
          <CardDescription className="text-xs font-semibold uppercase tracking-widest text-slate-500">Khiếu nại gần nhất</CardDescription>
          <CardTitle className="truncate text-lg text-slate-900">{selectedRecord?.complaintProductId ?? "-"}</CardTitle>
          <p className="w-fit rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{complaintStatusLabel}</p>
        </CardHeader>

        <CardContent className="grid gap-3">
          <div className="flex flex-col items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="size-12 rounded-lg border border-slate-200 bg-linear-to-br from-slate-200 to-slate-100" />
            <div className="grid min-w-0 gap-1.5">
              <p className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-slate-500">Mã hàng khiếu nại</span>
                <span className="truncate text-sm font-semibold text-slate-900">{selectedRecord?.complaintProductId ?? "-"}</span>
              </p>
              <p className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-slate-500">Mã sản phẩm</span>
                <span className="truncate text-sm font-semibold text-slate-900">{selectedRecord?.complaintProductId ?? "-"}</span>
              </p>
              <p className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-slate-500">Người bán</span>
                <span className="truncate text-sm font-semibold text-slate-900">{selectedRecord?.sellerFullName ?? "-"}</span>
              </p>
              <p className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-slate-500">Tạo khiếu nại</span>
                <span className="truncate text-sm font-semibold text-blue-600">{latestComplaintTime}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              Từ chối khiếu nại
            </Button>
            <Button type="button" variant="default" className="h-10 rounded-lg bg-rose-500 text-sm font-semibold text-white hover:bg-rose-500/90">
              Hoàn tiền ngay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
