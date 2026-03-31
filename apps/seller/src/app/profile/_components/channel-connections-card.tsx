import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import type { KenhBanHang } from "../types";

type ChannelConnectionsCardProps = {
  items: KenhBanHang[];
};

function TrangThaiKenhChip({ dangHoatDong }: { dangHoatDong: boolean }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        dangHoatDong ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700",
      ].join(" ")}
    >
      {dangHoatDong ? "Đang hoạt động" : "Cần xác thực"}
    </span>
  );
}

export function ChannelConnectionsCard({ items }: ChannelConnectionsCardProps) {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-slate-800">Kết nối kênh bán</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {items.map((item) => {
          const dangHoatDong = item.trangThai === "DANG_HOAT_DONG";

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-white text-xs font-bold uppercase text-slate-600">
                  {item.tenKenh.slice(0, 2)}
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-slate-800">{item.tenKenh}</p>
                  <p className="text-xs text-slate-500">{item.thongDiepPhu}</p>
                </div>
              </div>

              {dangHoatDong ? (
                <TrangThaiKenhChip dangHoatDong />
              ) : (
                <Button type="button" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Kết nối lại
                </Button>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full border-dashed border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-100"
        >
          + Kết nối kênh mới
        </Button>
      </CardContent>
    </Card>
  );
}
