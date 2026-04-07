import Image from "next/image";
import { Button, Card, CardContent } from "@/components/ui";
import type { HoSoCuaHangHero } from "../types";

type ProfileHeroCardProps = {
  data: HoSoCuaHangHero;
};

export function ProfileHeroCard({ data }: ProfileHeroCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200">
      <CardContent className="p-0">
        <div className="relative min-h-64">
          <Image
            src={data.anhBiaUrl}
            alt="Ảnh bìa cửa hàng"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          <div className="absolute left-4 top-4 rounded-xl bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Cửa hàng
          </div>

          <div className="relative flex min-h-64 items-end justify-between gap-4 p-5 sm:p-6">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative size-24 overflow-hidden rounded-3xl border-4 border-white/80 bg-teal-700 shadow-sm">
                <Image
                  src={data.anhDaiDienUrl}
                  alt="Ảnh đại diện cửa hàng"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-1 text-white">
                <p className="text-[1.5rem] font-bold leading-tight md:text-[2rem]">{data.tenCuaHang}</p>
              </div>
            </div>

            <Button type="button" variant="secondary" className="bg-white text-slate-800 hover:bg-slate-100">
              {data.nutChinhSuaBanner}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
