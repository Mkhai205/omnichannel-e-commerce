import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import type { ThongTinDoanhNghiep } from "../types";

type BusinessInformationCardProps = {
  data: ThongTinDoanhNghiep;
};

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase text-slate-500">{children}</p>;
}

export function BusinessInformationCard({ data }: BusinessInformationCardProps) {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <CardTitle className="text-xl text-slate-800">Thông tin doanh nghiệp</CardTitle>
        <Button type="button" variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          Chỉnh sửa tất cả
        </Button>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Tên pháp nhân</Label>
          <p className="text-sm text-slate-700">{data.tenPhapNhan}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Mã số thuế</Label>
          <p className="text-sm text-slate-700">{data.maSoThue}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Địa chỉ đăng ký</Label>
          <p className="max-w-md text-sm text-slate-700">{data.diaChiDangKy}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Người liên hệ</Label>
            <p className="text-sm text-slate-700">{data.nguoiLienHe}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email doanh nghiệp</Label>
            <p className="text-sm text-slate-700">{data.emailDoanhNghiep}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
