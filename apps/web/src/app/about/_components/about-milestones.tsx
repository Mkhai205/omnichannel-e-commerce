const MILESTONES = [
    {
        year: "2019",
        title: "Bắt đầu hành trình",
        description: "Ra mắt phiên bản đầu tiên cho nhóm nhà bán lẻ quy mô vừa tại Việt Nam.",
    },
    {
        year: "2021",
        title: "Mở rộng đa kênh",
        description:
            "Tích hợp vận hành online và offline trong cùng một bộ quy trình xử lý đơn hàng.",
    },
    {
        year: "2024",
        title: "Tăng trưởng hệ sinh thái",
        description:
            "Hỗ trợ thêm nhiều ngành hàng mới và nâng cao năng lực báo cáo vận hành theo thời gian thực.",
    },
    {
        year: "2026",
        title: "Tập trung brand trust",
        description: "Đầu tư mạnh vào trải nghiệm sau mua và tự động hóa chăm sóc khách hàng.",
    },
] as const;

export function AboutMilestones() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">Các mốc phát triển</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Lộ trình tăng trưởng của chúng tôi được định hình bởi nhu cầu thực tế từ nhà bán lẻ
                và kỳ vọng ngày càng cao của người mua hàng.
            </p>

            <ol className="mt-6 grid gap-4 md:grid-cols-2">
                {MILESTONES.map((milestone) => (
                    <li key={milestone.year} className="rounded-xl border border-gray-200 p-5">
                        <p className="text-sm font-semibold text-success-dark">{milestone.year}</p>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                            {milestone.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            {milestone.description}
                        </p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
