import Image from "next/image";
import { BrandLogo } from "@/components/layout/brand-logo";

const FOOTER_COLUMNS = [
    {
        title: "Tài khoản",
        links: ["Thông tin tài khoản", "Lịch sử đơn hàng", "Giỏ hàng", "Yêu thích"],
    },
    {
        title: "Hỗ trợ",
        links: ["Liên hệ", "Câu hỏi thường gặp", "Điều khoản", "Chính sách bảo mật"],
    },
    {
        title: "Khám phá",
        links: ["Giới thiệu", "Cửa hàng", "Sản phẩm", "Tra cứu đơn hàng"],
    },
    {
        title: "Danh mục",
        links: [
            "Thiết bị điện tử",
            "Máy tính & Laptop",
            "Thời trang",
            "Làm đẹp & Sức khỏe",
            "Nhà sách Online",
        ],
    },
];

const PAYMENT_METHODS = [
    { name: "Apple Pay", src: "/ApplePay.svg", width: 33, height: 14 },
    { name: "Visa", src: "/visa-logo.svg", width: 32, height: 11 },
    { name: "Discover", src: "/discover.svg", width: 40, height: 19 },
    { name: "Mastercard", src: "/mastercard.svg", width: 30, height: 18 },
] as const;

export function SiteFooter() {
    return (
        <footer className="bg-gray-900">
            <div className="mx-auto grid w-full max-w-425 gap-10 px-4 py-14 md:grid-cols-[1.2fr_2fr] md:px-6">
                <div>
                    <BrandLogo dark />
                    <p className="mt-4 max-w-sm text-sm text-gray-500">
                        Nền tảng thương mại điện tử đa kênh giúp bạn quản lý đơn hàng, sản phẩm và
                        trải nghiệm mua sắm hiệu quả.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-4 text-sm">
                        <span className="border-b border-success pb-1 text-white">
                            (+84) 123 456 789
                        </span>
                        <span className="text-gray-600">hoặc</span>
                        <span className="border-b border-success pb-1 text-white">
                            khaidz@gmail.com
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    {FOOTER_COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h4 className="text-base font-medium text-white">{column.title}</h4>
                            <ul className="mt-4 space-y-2.5 text-sm text-gray-500">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-white">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="mx-auto flex w-full max-w-425 flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 sm:flex-row md:px-6">
                    <p>Ecommerce © 2026. All Rights Reserved.</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                        {PAYMENT_METHODS.map((method) => (
                            <span
                                key={method.name}
                                className="inline-flex h-8 min-w-12 items-center justify-center rounded border border-gray-700 bg-gray-800/40 px-2"
                                aria-label={method.name}
                            >
                                <Image
                                    src={method.src}
                                    alt={method.name}
                                    width={method.width}
                                    height={method.height}
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
