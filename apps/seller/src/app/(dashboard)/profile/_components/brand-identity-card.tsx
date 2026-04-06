import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { NhanDienThuongHieu } from "../types";

type BrandIdentityCardProps = {
  data: NhanDienThuongHieu;
};

export function BrandIdentityCard({ data }: BrandIdentityCardProps) {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-slate-800">Nhận diện thương hiệu</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Màu thương hiệu chính</p>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="size-12 rounded-xl" style={{ backgroundColor: data.maMauChuDao }} />
            <div>
              <p className="text-2xl font-semibold text-slate-800">{data.maMauChuDao}</p>
              <p className="text-sm text-slate-500">{data.tenMauChuDao}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-base font-semibold uppercase leading-snug text-slate-500">
            Thời trang tối giản, sang trọng cho mọi phong cách
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
