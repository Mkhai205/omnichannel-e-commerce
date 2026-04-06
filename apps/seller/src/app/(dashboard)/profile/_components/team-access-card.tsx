import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { ThanhVienNhom } from "../types";

type TeamAccessCardProps = {
  members: ThanhVienNhom[];
};

export function TeamAccessCard({ members }: TeamAccessCardProps) {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-xl text-slate-800">Phân quyền nhân sự</CardTitle>
        <Button type="button" variant="secondary" size="sm" className="text-blue-700">
          + Mời nhân viên
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {member.avatarKyTu}
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-slate-800">{member.hoTen}</p>
              <p className="text-xs text-slate-500">
                {member.vaiTro} · {member.quyenTruyCap}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
