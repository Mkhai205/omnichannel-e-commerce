import { LineChart, Store, Truck } from "lucide-react";

const REGISTER_BENEFITS = [
  {
    id: "channel",
    title: "Quản lý đa kênh tập trung",
    description: "Hợp nhất tất cả cửa hàng Amazon, Shopify, Lazada vào một trang quản trị duy nhất.",
    icon: Store,
  },
  {
    id: "insight",
    title: "Báo cáo AI thông minh",
    description: "Phân tích xu hướng tiêu dùng và dự báo tồn kho bằng thuật toán máy học tiên tiến.",
    icon: LineChart,
  },
  {
    id: "shipping",
    title: "Tối ưu vận chuyển",
    description: "Kết nối mạng lưới logistics toàn cầu với chi phí tối ưu nhất cho người bán.",
    icon: Truck,
  },
] as const;

export function RegisterHeroPanel() {
  return (
    <section className="flex flex-col gap-6 px-5 pb-8 pt-4 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Đối tác chiến lược</p>
        <h1 className="max-w-xl text-balance text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
          Mở khóa tiềm năng <span className="text-blue-700">thương mại số.</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-600 lg:text-lg">
          Tham gia cùng hàng nghìn doanh nghiệp đang định nghĩa lại cách thức vận hành và tăng trưởng toàn cầu.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {REGISTER_BENEFITS.map(({ id, title, description, icon: Icon }) => (
          <article key={id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-700">
              <Icon className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-slate-900 lg:text-lg">{title}</h3>
              <p className="text-xs leading-relaxed text-slate-600 lg:text-sm">{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
