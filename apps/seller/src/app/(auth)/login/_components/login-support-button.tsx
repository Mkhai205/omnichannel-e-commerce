import { Button } from "@/components/ui";
import { Headset } from "lucide-react";

export function LoginSupportButton() {
  return (
    <Button type="button" variant="outline" className="h-10 rounded-full border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm">
      <Headset aria-hidden="true" data-icon="inline-start" />
      Trung tâm hỗ trợ
    </Button>
  );
}
