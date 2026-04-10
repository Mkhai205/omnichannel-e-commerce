export type PopularCategoryItem = {
    name: string;
    slug: string;
    image: string;
};

export const POPULAR_CATEGORIES: PopularCategoryItem[] = [
    { name: "Thời trang nam", slug: "men-fashion", image: "/categories/men-fashion.webp" },
    { name: "Thời trang nữ", slug: "women-fashion", image: "/categories/woman-fashion.webp" },
    { name: "Giày dép nam", slug: "men-shoes", image: "/categories/men-shoes.webp" },
    { name: "Giày dép nữ", slug: "women-shoes", image: "/categories/woman-shoes.webp" },
    { name: "Làm đẹp & Sức khỏe", slug: "beauty-health", image: "/categories/beauty-health.webp" },
    { name: "Ô tô & xe máy", slug: "car-moto", image: "/categories/car-moto.webp" },
    { name: "Đồ điện tử", slug: "electronics", image: "/categories/electrical-equipment.webp" },
    {
        name: "Đồ gia dụng",
        slug: "household-appliances",
        image: "/categories/household-appliances.webp",
    },
    {
        name: "Trang sức",
        slug: "jewelry-accessories",
        image: "/categories/jewelry-accessories.webp",
    },
    { name: "Laptop", slug: "laptops", image: "/categories/laptop.webp" },
    { name: "Điện thoại", slug: "mobile-phones", image: "/categories/mobile.webp" },
    { name: "Thú cưng", slug: "pets", image: "/categories/pets.webp" },
    { name: "Thể thao", slug: "sports", image: "/categories/sports.webp" },
    { name: "Đồ chơi", slug: "toys", image: "/categories/toys.webp" },
    { name: "Nhà sách Online", slug: "books", image: "/categories/books.webp" },
    { name: "Voucher khuyến mại", slug: "vouchers", image: "/categories/voucher.webp" },
];

export const DEFAULT_POPULAR_CATEGORY_SLUG = POPULAR_CATEGORIES[0]?.slug ?? "electronics";
