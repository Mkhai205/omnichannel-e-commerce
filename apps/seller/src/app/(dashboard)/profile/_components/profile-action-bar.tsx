import { Button } from "@/components/ui";
import type { HanhDongChanTrang } from "../types";

type ProfileActionBarProps = {
  data: HanhDongChanTrang;
};

export function ProfileActionBar({ data }: ProfileActionBarProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
      <Button
        type="button"
        variant="outline"
        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
      >
        {data.nutHuy}
      </Button>
      <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700">
        {data.nutLuu}
      </Button>
    </div>
  );
}
