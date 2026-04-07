type Category = {
    name: string;
    image: string;
};

type Product = {
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    badge?: { label: string; className: string };
    rating: number;
};

const categories: Category[] = [
    {
        name: "Công Nghệ",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgR1OsRdADR_X2q_9L_tgyXFgzM8GWviIn1CHYMNHHYTFllEL-IqhyC4ZkH8pm5mcrhLm1DK_sUKLnxYXzhXDL24ME3gv6jEzOEjn1HBG-qAUMOUS9JNcmXFAYzMXdu2drYuEdhoEWt-yn6Sj8nWnXUOChETYL9RU5ScLH4tPAsoGZp_nSoUz2Bz1pfJfbBs_ZbuSBeroRVgqiug0yJFjjSszOikmsxfgev6PZXXRibh4TXKAEvyVnq9OasoHteI1KBQIzJPz2bfE",
    },
    {
        name: "Thời Trang",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr82tl5tuN49gNP8NW3XeGsrFo19HDW5CO3uoWb9Vv60EgVS4IMYNO_It9MWg9o2aspCRMGHajW5O57GkK3WYD89lV9LhRsuaiccI-2Q6p9vAyymhYVSy4Hx08JFtMRTN6unWBXKv-iinu5VrQd2Vb2g17ZKgs4Dt-BvvwiBzRNzfXPxWvLBVWDOmNvnfvoj-cnTDbOU1L6J5DmlZSKsLcYEoYfJgMtJS6g_966IkwqOn6UZkPz3062D3CMPA3xVyuLteVObiINqs",
    },
    {
        name: "Gia Dụng",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvY25-GANYCk8_2mMcV1gwGh1UMU8VWpUHG0-8sglyETiVov9KwnbORg-PXuEIHQ3jUsMeHidDxKFm5qC-LhhJ_Gq1VWFDGId1_myb1EVAzpwpU-2lJAF3A_iCHYfzhx9atsXtngpqIvRbLZm01Z9wM_dr-gLQ7FRkuabAwh0TzrEIkLnhL4ScDVj3V9jSrizMiPWU15SgoX9NudoovC6_8KJk9NJNyNF7lB3MqNe9DKTvHikbl4UwRUJBOYfw4hhbS_xvI0kuVzU",
    },
    {
        name: "Làm Đẹp",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR70_caSPs-8Iq2G4logjX0R-H06k48uDbAi6uAXKpAqV3KOO4G1iytwPNTFCa6qo988XdGIpfKdwNWx5eb2_mJiJi8MQTuV3JL1z8w5DF1PEmjthau_L2vbAxiq24VmmdLSmuoVo8Vvc5Qiqi9rl0P2KOeuwc2M8db845DISmaxVYNzJLxgyFv7w8-O2Tv9Kq-wVCq4uk3I1N08d7xRrG8MVF8_jxkDmPtz6VJq6KM9zfHOVZ2T7OVo2o_m4AoeKHYD_LI8NtpL4",
    },
    {
        name: "Phụ Kiện",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNST4xjV9sXSbaqoVbWqKzMNp4-DZFfwBQ1BDizFP9yIsTeYps5Ron5NXM04cqW_kLpowExa3M7kxDPl5gmUxPk-wFYoF8nb0x_OiPxcfF9xcDax_Stq7-ii7nSlRSjbMNzq26CZS0cnyB2Sh7ePYkOQ-Xr_ozYRO2nqxjm_VUcOfU0Y-tLqnFHF9UXNgUYSJb8Dgu2vBOr_ZsFQDYr-Ho81_4nDTXXPXHIagNr0InRasqTKCJxmD0_Lg_hsj89HzU-UThrOzeqiY",
    },
    {
        name: "Thể Thao",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBosupwT6h4z2Su1lkbfbL-znQqC1dvka54nMwXBlhydFSbD-7T2n9b4SBrVJWypyqkMXtCvkbnScz6iIfisvxCL96i0xdRVZuizBp9x2-nZxDPOmVJlx8AtJmMsNCwp7ucD-Z3g-5ij1pkOfnvTv_xrts3KjNAvnydeQR-bdI10PB937ROysow_EbT4HSZhD9EkhOCv6AOsPEjLOcrhzOA6F7A0BZTuBkKaX7IaxQBoTXJf2_7AwL1OYCTrED58NuP4RsVXbO50",
    },
];

const products: Product[] = [
    {
        name: "Tai nghe không dây chống ồn Sony WH-1000XM5",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvvIGclM9ECs1XeRju54epeXmTntmhQUEgBMtgmQa94HWgd-SOK5vR56PILfZHyFDeIuZ5Gk7vCfWctCc98hPFI5trqPogCdRZgKYcSJsoReQAsRq-HR8YM1-XYYWOoa8snENJ0LwnGgosqTlvR74WtYh0vhCOuhWD9yvPUHHO0tCrb7gydqiMYndn_l2ug8Tjz3vu_s8FCtvFucPOTqaqxgoOkFPIJM9jOtQUtEYMwz5AMRvf-1reE8KVWu_c2uyDnhi4Mxk3hJQ",
        price: "8.490.000₫",
        oldPrice: "9.900.000₫",
        badge: { label: "-15%", className: "bg-primary" },
        rating: 4,
    },
    {
        name: "Đồng hồ thông minh Apple Watch Series 9 GPS 45mm",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHU-TqM4P4kI7kjmyUobvhyLgTlZeaS3TkET15V2u0xtSwCvmWNdm3f4mw998jtEAwuG8JvFW3aiq3RuvjpmUCQGFkzV7mQlvfUBwhLbrVz_qTrPw9t1B1xWcGWvK6ZTXxYtNy41s3PTv5jbt6azqtp94TIojH_F89WPtXgfEiEIn740jJOXJwnRwXyO8Wazf93iSxTdLElrVW2zp10gdEgbx57eKBTJcv1W0nmVOBXFoxqkc9hatvqZCuZqkoKkpsBbGG7E5V5M",
        price: "10.290.000₫",
        badge: { label: "Mới", className: "bg-[#219bf6]" },
        rating: 5,
    },
    {
        name: "Máy ảnh Fujifilm X-T5 Mirrorless (Body)",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfmrEiXLmlhPbp-pDM-_hzgbIeau40UE7whgoaBtzrH2bswWxuwmwL8PjrgyEz3ILTNROQSzQH8dOxesZ70fsbBQ1l1ssc7mEl_TXG6RjdS2D7eWDB7BzvC6pWR2txuG4NJeLAMEb5yp2MzBEte17Vkz1zPrMCDR1exHJWNyMnL7S6Qsu9znitKa8Ob5lbeWNGYY-_2LDC4zLAwy8TCYAe48VUxJ7eDsy0kj1EKHYIhDtimXVY9EmY5IzjQnK1qU_A-o2t2nxiN3M",
        price: "42.500.000₫",
        rating: 4,
    },
    {
        name: "Giày Sneaker Nam Nike Air Jordan 1 Low",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfwmYHVG1H8Yvna7sqjmpdGNSivqAMGgd2k-h28RwMTyKZSCdLNRfe9cpvpGEy4OFhOTzrAAgvpy8hkNrOe7i6TQ3qqPXxaKEpeFb17cfenq0jDJQHSna9z8rwG6K7B3QYOLa6uDwAhM9IR57CyKBMaOgE7sXoEIMh-wSFG0JEAcyhllAKpTNIG4jGgRKdsEUUqZBycN3YUXjHc8_OwZz70u6mVklpuKigVBtA9Miz8dJg3V2RSAj33HH4A97VM5mxAYpMq6kwCnw",
        price: "3.590.000₫",
        badge: { label: "Hot", className: "bg-red-500" },
        rating: 5,
    },
    {
        name: "Bàn phím cơ không dây Keychron K2 V2",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFKIFnyrmwwJRqcFvxslQlTIBRmh5tt0XUgPXWQpdXdnwTPT35PdvEumJSJyl9yrjxZW2w4mA2_2aBHT0cu4J6BpShM0o5usfcZCgds_1t1iAKWPWmtGZqRi7Iu0tSiSSPZTVevAqeFQYgCQbLoV9PSW3iI9a7J4gFyTlwsEd1oopxKS14IulNoEpxUt5PmUX5e0mq2yTOPHGmioDNGAbjPyi154NiXKwxH16aAPY7RLE3yqP8qJpFcK_LFUPDzZ-u94x0p8nf-F0",
        price: "1.850.000₫",
        oldPrice: "2.100.000₫",
        rating: 4,
    },
    {
        name: "Loa Bluetooth Marshall Emberton II",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYRnrQErH0R3g1RJLbhPWiQplNVTkxtEpGR9f6LscMsRye-Ao0I5Gh-xPBNU5KKzgK1kzgg_I3xj_bwjWb6vT6oOEqQvZTsaWWHnzs2qYvOnqWCNvNfSX8h2-pgibbmTHy-fIyitdRtfiafRRDaEKPr43lgNcA-3MB6ZFBjB_x6kEyGttRMVoLcowxT4NAu4_SWKBnY8bFm1gGNQ6NHqwEfmFSqBDe3UbiUpC8duZUz73Fb26euFYpssclXfA56lEJaKuVhgh9spA",
        price: "4.200.000₫",
        rating: 5,
    },
    {
        name: "Áo Hoodie Essentials Fear Of God",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXIcsZbmMSkIiOfsw6A47nL4q9Iwh8txsEL42buL6u19YUdG26YuYKq76U38xdkeCntoXoGI0siOpjqppsi_uK8zVNAYidd5BeeYKwlpNDGtwylXkDkUpuVCaZLi_a2Fw1iSNuAOwmJinJkBFVhlUpGS2ToBmEbwRy7e1OEFyWzKk_V7xHON5Act4X5-xsXgDhgU_uoxNvw_Zp16KWe1Iumlfij4zaU093rOf66HbY7_iPnp0fCCBVXMitdJ-7983E0dqC5tmamng",
        price: "2.800.000₫",
        badge: { label: "New", className: "bg-[#219bf6]" },
        rating: 4,
    },
    {
        name: "iPad Pro M2 11 inch Wi-Fi 128GB",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfE4v6MRwaxmWR4KHELIJD0qmTD3MMmSPPT_PFfsjNY8GlmIQU8DDHdBseTwuiJ6EJ2sP5SGYKCMIn0InAo1JLWihmbbAk7kjFKOJI0SIy5pNXG-OHlmV1NUX1Cx3orGbtOXvmGUxXxERc6vCmmMbmXRMjy0dXshQeCpepAgO4LtyCkHO8Rrgur5Q_rcF4t3vE7A14BVxfwewvtoOaurRADQhD4aCbfiACruv5YPqd2XLhv8veZJkXAtW5EpLICyLnqFXoOEgckPI",
        price: "20.490.000₫",
        rating: 5,
    },
];

const serviceHighlights = [
    { title: "Giao Hàng Miễn Phí", description: "Cho đơn hàng từ 1.000.000đ" },
    { title: "Thanh Toán Bảo Mật", description: "Cam kết an toàn tuyệt đối" },
    { title: "Đổi Trả 30 Ngày", description: "Thủ tục nhanh chóng, đơn giản" },
    { title: "Hỗ Trợ 24/7", description: "Giải đáp mọi thắc mắc của bạn" },
];

function Rating({ value }: { value: number }) {
    return (
        <div className="mb-2 flex items-center gap-0.5 text-sm">
            {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className={index < value ? "text-yellow-400" : "text-slate-300"}>
                    ★
                </span>
            ))}
            <span className="ml-1 text-[10px] text-slate-400">(120)</span>
        </div>
    );
}

export default function Home() {
    return (
        <main className="bg-white text-slate-900">
            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <a className="flex items-center gap-2 text-xl font-bold text-primary" href="#">
                            <span className="text-2xl">🛍️</span>
                            <span>OmniShop</span>
                        </a>
                        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
                            <a className="transition-colors hover:text-primary" href="#">
                                Home
                            </a>
                            <a className="transition-colors hover:text-primary" href="#">
                                Shop
                            </a>
                            <a className="transition-colors hover:text-primary" href="#">
                                Track Order
                            </a>
                            <a className="transition-colors hover:text-primary" href="#">
                                Support
                            </a>
                        </div>
                    </div>
                    <div className="mx-8 hidden max-w-md flex-1 lg:block">
                        <input
                            className="block w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Search products, brands..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-3 text-xl">
                        <button className="rounded-full p-2 transition-colors hover:bg-slate-100" type="button">
                            ♡
                        </button>
                        <button className="relative rounded-full p-2 transition-colors hover:bg-slate-100" type="button">
                            🛒
                            <span className="absolute right-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                                3
                            </span>
                        </button>
                        <img
                            alt="User Profile"
                            className="h-8 w-8 rounded-full border border-slate-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqOD0Uh0WolzyOsuCTzFDW9f6lvq6lAJdEJ7DZjD-X20kdfLSTxn9JFip7HUbgf52Gvsnw9veANs3WDjekGbl3Oov7XFPzDEEHeh3bMvqa6jINdwI__aRmsbbFDCBzq3o1GznurOhQ5uzopWKmZpm0MRhxjCFhpYamBrDQVxYb8OqIUSsxz4Zzt2UVs7XKyUOw-oRqQiJOjhTqDbd-ooMdErvWY7U9d-m0AYvh4_8E0CPrsKKk1H_zO4cHQxCWTQl4U3TguCOkxs0"
                        />
                    </div>
                </div>
            </nav>

            <section className="overflow-hidden bg-slate-50 pt-12 lg:pt-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid min-h-[600px] items-center gap-12 lg:grid-cols-2">
                        <div className="relative z-10">
                            <span className="mb-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                Bộ sưu tập mới 2024
                            </span>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight lg:text-7xl">
                                Nâng Tầm Phong Cách
                                <span className="mt-2 block text-primary">Công Nghệ Hiện Đại</span>
                            </h1>
                            <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-600">
                                Khám phá những sản phẩm đột phá nhất từ các thương hiệu hàng đầu thế
                                giới. Trải nghiệm mua sắm đa kênh không giới hạn ngay hôm nay.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    className="rounded-full bg-primary px-8 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30"
                                    type="button"
                                >
                                    Khám phá ngay
                                </button>
                                <button
                                    className="rounded-full border border-slate-200 bg-white px-8 py-4 font-semibold transition-all hover:bg-slate-50"
                                    type="button"
                                >
                                    Xem khuyến mãi
                                </button>
                            </div>
                            <div className="mt-12 flex gap-12 border-t border-slate-200 pt-8">
                                <div>
                                    <div className="text-3xl font-bold">15k+</div>
                                    <div className="text-sm text-slate-500">Khách hàng hài lòng</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">500+</div>
                                    <div className="text-sm text-slate-500">Thương hiệu quốc tế</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-end justify-center lg:h-[700px]">
                            <img
                                alt="Hero Lifestyle"
                                className="h-[90%] w-full rounded-t-3xl object-cover shadow-2xl"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7XdyCsFc2N6wTLKP6yk1uzOh9h4JFNlD5jxa67blsTCzeUEw-1eQTp7Vo57MM9QppQcWPc5YFC94AazUI-N0_nTRi1pOBpOAuj55qUqCBik5Rxc1R-5kEuCRQ_Z3eb_beCPQzFS6F65N60m7-0oKot8MlhhJVKKcuO5TcQLhxJ82yL9JDTupWIO2bX24GccGOpOHBlKsw5VeOTX_GQZATUcuDVC5pWTF7BwtXKd2WV38S3Y54mwdEtb5RgAH1gfQKls3V7m2XFgQ"
                            />
                            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl md:block">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-green-100 p-3 text-green-600">⚡</div>
                                    <div>
                                        <div className="font-bold">Giao hàng 2h</div>
                                        <div className="text-xs text-slate-500">Tại khu vực nội thành</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {serviceHighlights.map((feature) => (
                            <div
                                key={feature.title}
                                className="cursor-default rounded-2xl border border-transparent bg-slate-50 p-6 transition-all hover:border-primary/20"
                            >
                                <h3 className="text-sm font-semibold">{feature.title}</h3>
                                <p className="text-xs text-slate-500">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-3 text-3xl font-bold">Mua Theo Danh Mục</h2>
                    <p className="mx-auto mb-12 max-w-xl text-slate-500">
                        Duyệt qua những nhóm sản phẩm phổ biến nhất để tìm thấy thứ bạn cần một cách
                        nhanh chóng.
                    </p>
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => (
                            <a key={category.name} className="group" href="#">
                                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-slate-100 p-2 ring-2 ring-transparent transition-all group-hover:ring-primary">
                                    <img
                                        alt={category.name}
                                        className="h-full w-full rounded-full object-cover"
                                        src={category.image}
                                    />
                                </div>
                                <span className="text-sm font-medium">{category.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold">Sản Phẩm Đang Thịnh Hành</h2>
                            <p className="text-slate-500">
                                Những lựa chọn tốt nhất được nhiều người yêu thích trong tuần qua.
                            </p>
                        </div>
                        <a className="font-semibold text-primary hover:underline" href="#">
                            Xem tất cả sản phẩm
                        </a>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <article
                                key={product.name}
                                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:shadow-xl"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={product.image}
                                    />
                                    {product.badge ? (
                                        <span
                                            className={`absolute left-4 top-4 rounded px-2 py-1 text-[10px] font-bold text-white ${product.badge.className}`}
                                        >
                                            {product.badge.label}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="p-6">
                                    <Rating value={product.rating} />
                                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary">{product.price}</span>
                                        {product.oldPrice ? (
                                            <span className="text-xs text-slate-400 line-through">
                                                {product.oldPrice}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative min-h-[400px] overflow-hidden rounded-[2rem] bg-[#051C49]">
                        <div className="grid h-full lg:grid-cols-2">
                            <div className="flex flex-col justify-center p-12 lg:p-16">
                                <span className="mb-6 inline-block w-fit rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold text-white">
                                    Deal Sốc Trong Ngày
                                </span>
                                <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                                    Siêu Giảm Giá Tai Nghe Bose QuietComfort Ultra
                                </h2>
                                <div className="mb-8 flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-white">7.990.000₫</span>
                                    <span className="text-xl text-slate-400 line-through">10.500.000₫</span>
                                </div>
                                <div className="mb-10 flex gap-4">
                                    <div className="min-w-[70px] rounded-xl bg-white/10 p-3 text-center backdrop-blur-md">
                                        <div className="text-2xl font-bold text-white">08</div>
                                        <div className="text-[10px] uppercase tracking-wider text-slate-300">
                                            Giờ
                                        </div>
                                    </div>
                                    <div className="min-w-[70px] rounded-xl bg-white/10 p-3 text-center backdrop-blur-md">
                                        <div className="text-2xl font-bold text-white">45</div>
                                        <div className="text-[10px] uppercase tracking-wider text-slate-300">
                                            Phút
                                        </div>
                                    </div>
                                    <div className="min-w-[70px] rounded-xl bg-white/10 p-3 text-center backdrop-blur-md">
                                        <div className="text-2xl font-bold text-white">12</div>
                                        <div className="text-[10px] uppercase tracking-wider text-slate-300">
                                            Giây
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-fit rounded-full bg-white px-8 py-4 font-bold text-[#051C49] transition-all hover:bg-slate-100"
                                    type="button"
                                >
                                    Mua Ngay Để Nhận Ưu Đãi
                                </button>
                            </div>
                            <div className="relative hidden overflow-hidden lg:block">
                                <img
                                    alt="Bose Promo"
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjRbLrhopbdhAXxTNqy81PgGJ_uD1mkf582xmL8uoTpn89QDN1FJkP_dWAIwbhEiePP11dExX8OyuZLmZyhlhpKte6mmhjAuVIxHUJqTRYKM8X3AEfYFdcTlUFxEDlWzzNVn5xHSyRHIaPcCQYP6Jhn1Xv5TLuFzLvjoFu2r11II46HbN3IC_PSy9tIU8eN7FgIV7MOUKW-wjzaMGQycOjioQaJBgpkaPVNvoOiePEodM4F_WncTkqL_Hzka9CMGp2SAdoVEbkEYc"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#051C49] to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#219bf6] py-20">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-primary shadow-lg">
                        ⚡
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-white">Cập Nhật Xu Hướng & Ưu Đãi</h2>
                    <p className="mb-10 text-lg text-white/90">
                        Đăng ký nhận bản tin để không bỏ lỡ những bộ sưu tập mới nhất và voucher
                        giảm giá độc quyền dành riêng cho bạn.
                    </p>
                    <form className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
                        <input
                            className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                            placeholder="Nhập địa chỉ email của bạn..."
                            type="email"
                        />
                        <button
                            className="rounded-full bg-primary px-10 py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-[#1a8fe0]"
                            type="submit"
                        >
                            Đăng Ký
                        </button>
                    </form>
                    <p className="mt-6 text-xs text-white/80">
                        Chúng tôi cam kết bảo mật thông tin của bạn. Hủy đăng ký bất cứ lúc nào.
                    </p>
                </div>
            </section>

            <footer className="border-t border-slate-100 bg-white pb-10 pt-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <a className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary" href="#">
                                <span className="text-3xl">🛍️</span>
                                <span>OmniShop</span>
                            </a>
                            <p className="mb-8 text-sm leading-relaxed text-slate-500">
                                Your premium destination for multi-channel shopping. Quality products
                                delivered to your doorstep.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-6 font-bold">Shop</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        New Arrivals
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Best Sellers
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Deals & Promotions
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Store Locator
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-6 font-bold">Support</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Track Your Order
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Shipping & Returns
                                    </a>
                                </li>
                                <li>
                                    <a className="transition-colors hover:text-primary" href="#">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-6 font-bold">Newsletter</h4>
                            <p className="mb-6 text-sm text-slate-500">
                                Subscribe to receive updates and special offers.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                                    placeholder="Email address"
                                    type="email"
                                />
                                <button
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#219bf6]"
                                    type="button"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 md:flex-row">
                        <p className="text-xs text-slate-500">© 2024 OmniShop. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-slate-500">
                            <a className="hover:text-primary" href="#">
                                Privacy Policy
                            </a>
                            <a className="hover:text-primary" href="#">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <button
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-2xl transition-transform hover:scale-110"
                type="button"
            >
                💬
            </button>
        </main>
    );
}
