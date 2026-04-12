export type BlogPostSection = {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
};

export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    publishedAt: string;
    readTimeMinutes: number;
    tags: string[];
    isFeatured?: boolean;
    sections: BlogPostSection[];
};

const BLOG_POSTS: BlogPost[] = [
    {
        slug: "xu-huong-mua-sam-da-kenh-2026",
        title: "Xu hướng mua sắm đa kênh 2026: Từ trải nghiệm đến niềm tin",
        excerpt:
            "Khách hàng không còn mua vì giá, họ mua vì sự thuận tiện và độ đáng tin cậy. Doanh nghiệp cần đồng bộ trải nghiệm trên web, social và cửa hàng.",
        category: "Chiến lược bán lẻ",
        author: "Omni Commerce Team",
        publishedAt: "2026-03-21",
        readTimeMinutes: 7,
        tags: ["omnichannel", "brand trust", "customer experience"],
        isFeatured: true,
        sections: [
            {
                heading: "Khách hàng kỳ vọng trải nghiệm thống nhất",
                paragraphs: [
                    "Nghiên cứu nội bộ cho thấy người mua thường bắt đầu hành trình trên social, so sánh trên website và kết thúc tại điểm bán. Nếu thông tin giá, tồn kho và chính sách giao hàng không đồng nhất, tỷ lệ rời bỏ sẽ tăng mạnh.",
                    "Doanh nghiệp cần xây dựng một nguồn sự thật dữ liệu duy nhất cho sản phẩm, giá bán và tồn kho để đảm bảo mọi điểm chạm đều thông suốt.",
                ],
            },
            {
                heading: "Niềm tin thương hiệu là lợi thế cạnh tranh dài hạn",
                paragraphs: [
                    "Tại thị trường cạnh tranh cao, thương hiệu có mức độ minh bạch và phản hồi nhanh sẽ giữ được khách hàng lâu hơn.",
                ],
                bullets: [
                    "Công khai chính sách đổi trả rõ ràng trên mọi kênh.",
                    "Thông báo trạng thái đơn hàng chủ động và đúng hẹn.",
                    "Đồng bộ thông tin khuyến mãi giữa online và offline.",
                ],
            },
        ],
    },
    {
        slug: "toi-uu-trang-san-pham-tang-chuyen-doi",
        title: "Tối ưu trang sản phẩm để tăng chuyển đổi mà không cần giảm giá",
        excerpt:
            "Một trang sản phẩm tốt giúp khách hàng ra quyết định nhanh hơn. Nội dung đúng, hình ảnh rõ và thông tin giao hàng minh bạch là ba trụ cột quan trọng.",
        category: "Vận hành website",
        author: "Lan Anh",
        publishedAt: "2026-03-08",
        readTimeMinutes: 6,
        tags: ["product page", "conversion", "ux"],
        sections: [
            {
                heading: "Nội dung cần tập trung vào lợi ích khách hàng",
                paragraphs: [
                    "Thay vì liệt kê thông số dài dòng, hãy bắt đầu bằng giá trị sử dụng thực tế. Khách hàng cần biết sản phẩm giải quyết vấn đề gì.",
                ],
            },
            {
                heading: "Thông tin giao hàng và đổi trả ảnh hưởng trực tiếp đến quyết định mua",
                paragraphs: [
                    "Nếu trang sản phẩm không cho biết thời gian giao dự kiến và chi phí vận chuyển, khách hàng thường bỏ giỏ ngay trước bước thanh toán.",
                ],
            },
        ],
    },
    {
        slug: "xay-dung-noi-dung-thuong-hieu-ben-vung",
        title: "Xây dựng nội dung thương hiệu bền vững cho doanh nghiệp bán lẻ",
        excerpt:
            "Nội dung không chỉ để bán hàng nhanh. Nội dung đúng chiến lược giúp thương hiệu được nhớ đến và tạo sự trung thành lâu dài.",
        category: "Thương hiệu",
        author: "Minh Khoa",
        publishedAt: "2026-02-19",
        readTimeMinutes: 8,
        tags: ["content", "branding", "storytelling"],
        sections: [
            {
                heading: "Ba lớp nội dung cần có",
                paragraphs: [
                    "Thương hiệu nên cân bằng giữa nội dung giáo dục, nội dung chứng minh năng lực và nội dung bán hàng. Mỗi lớp đóng vai trò riêng trong hành trình khách hàng.",
                ],
                bullets: [
                    "Nội dung giáo dục: hướng dẫn sử dụng, mẹo chọn mua.",
                    "Nội dung năng lực: case study, quy trình kiểm soát chất lượng.",
                    "Nội dung bán hàng: ưu đãi, bộ sưu tập mới, giới hạn thời gian.",
                ],
            },
        ],
    },
    {
        slug: "van-hanh-khuyen-mai-khong-gay-vo-ton-kho",
        title: "Vận hành khuyến mãi đa kênh mà không gây vỡ tồn kho",
        excerpt:
            "Khuyến mãi thành công cần bố trí tồn kho trước, trong và sau chiến dịch. Nếu không có quy trình, đơn hủy và hoàn tiền sẽ tăng cao.",
        category: "Quản lý tồn kho",
        author: "Phuong Linh",
        publishedAt: "2026-01-30",
        readTimeMinutes: 9,
        tags: ["inventory", "promotion", "operations"],
        sections: [
            {
                heading: "Lập kế hoạch tồn kho theo 3 mốc thời gian",
                paragraphs: [
                    "Trước chiến dịch, cần xác định ngưỡng cảnh báo theo từng nhóm sản phẩm. Trong chiến dịch, cần đồng bộ dữ liệu tồn kho gần như thời gian thực. Sau chiến dịch, cần đánh giá tốc độ quay vòng để điều chỉnh lần sau.",
                ],
            },
        ],
    },
    {
        slug: "5-chi-so-do-tin-cay-cua-website-ban-hang",
        title: "5 chỉ số độ tin cậy của một website bán hàng hiện đại",
        excerpt:
            "Độ tin cậy là yếu tố ảnh hưởng lớn đến conversion. Doanh nghiệp có thể đo lường nó qua những chỉ số vận hành cụ thể.",
        category: "Phân tích dữ liệu",
        author: "Hong Nhung",
        publishedAt: "2026-01-14",
        readTimeMinutes: 5,
        tags: ["trust", "analytics", "performance"],
        sections: [
            {
                heading: "Tin cậy cần được đo lường liên tục",
                paragraphs: [
                    "Khi conversion giảm, vấn đề có thể đến từ tốc độ tải trang, thông tin không đồng nhất hoặc quy trình chăm sóc sau mua chưa tốt.",
                ],
                bullets: [
                    "Tỷ lệ đơn hàng giao đúng hẹn.",
                    "Tỷ lệ đổi trả và lý do đổi trả.",
                    "Mức độ hài lòng sau mua (CSAT).",
                    "Tỷ lệ quay lại mua hàng trong 60 ngày.",
                    "Tỷ lệ bỏ giỏ hàng tại bước thanh toán.",
                ],
            },
        ],
    },
    {
        slug: "toi-uu-contact-point-de-tang-lead-chat-luong",
        title: "Tối ưu contact point để tăng lead chất lượng cho đội ngũ kinh doanh",
        excerpt:
            "Không phải lead nào cũng giống nhau. Một form liên hệ được thiết kế đúng cách sẽ giúp lọc nhu cầu và rút ngắn thời gian tư vấn.",
        category: "Lead generation",
        author: "Quốc Bảo",
        publishedAt: "2025-12-26",
        readTimeMinutes: 6,
        tags: ["contact", "lead", "crm"],
        sections: [
            {
                heading: "Đặt câu hỏi đúng tại đúng thời điểm",
                paragraphs: [
                    "Form liên hệ nên thu thập đủ thông tin để tư vấn nhanh, nhưng không quá dài để tránh rời bỏ. Ưu tiên các trường liên quan đến nhu cầu và timeline mua hàng.",
                ],
            },
        ],
    },
];

function toTimeValue(dateText: string): number {
    return new Date(dateText).getTime();
}

export function getAllBlogPosts(): BlogPost[] {
    return [...BLOG_POSTS].sort((a, b) => toTimeValue(b.publishedAt) - toTimeValue(a.publishedAt));
}

export function getFeaturedBlogPost(): BlogPost | undefined {
    return getAllBlogPosts().find((post) => post.isFeatured);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
    const targetPost = getBlogPostBySlug(slug);

    if (!targetPost) {
        return [];
    }

    return getAllBlogPosts()
        .filter((post) => post.slug !== slug)
        .sort((firstPost, secondPost) => {
            const firstScore = Number(firstPost.category === targetPost.category);
            const secondScore = Number(secondPost.category === targetPost.category);

            if (firstScore !== secondScore) {
                return secondScore - firstScore;
            }

            return toTimeValue(secondPost.publishedAt) - toTimeValue(firstPost.publishedAt);
        })
        .slice(0, limit);
}

export function getAllBlogCategories(): string[] {
    return [...new Set(BLOG_POSTS.map((post) => post.category))];
}

export function formatBlogDate(dateText: string): string {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(dateText));
}
