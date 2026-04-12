const TEAM_MEMBERS = [
    {
        name: "Lê Nhật Minh",
        role: "Head of Product",
        description: "Định hướng chiến lược sản phẩm và tối ưu hành trình khách hàng đa kênh.",
    },
    {
        name: "Trần Bảo Hân",
        role: "Customer Success Lead",
        description: "Đồng hành đối tác trong quá trình triển khai, đào tạo và vận hành thực tế.",
    },
    {
        name: "Phạm Đức Kiên",
        role: "Engineering Manager",
        description: "Đảm bảo nền tảng ổn định, mở rộng được và đáp ứng yêu cầu vận hành liên tục.",
    },
] as const;

export function AboutTeam() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">Đội ngũ đồng hành</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Chúng tôi kết hợp kinh nghiệm sản phẩm, vận hành bán lẻ và kỹ thuật để giải quyết
                bài toán tăng trưởng bền vững cho doanh nghiệp.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                {TEAM_MEMBERS.map((member) => (
                    <article key={member.name} className="rounded-xl border border-gray-200 p-5">
                        <div className="inline-flex size-10 items-center justify-center rounded-full bg-success/10 text-sm font-semibold text-success-dark">
                            {member.name
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part.charAt(0))
                                .join("")}
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-gray-900">
                            {member.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{member.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
