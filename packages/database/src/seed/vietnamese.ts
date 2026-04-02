import { faker } from "./faker.js";

const FAMILY_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ"];

const MIDDLE_NAMES = ["Văn", "Thị", "Minh", "Đức", "Thành", "Ngọc", "Quốc", "Anh"];

const GIVEN_NAMES = [
    "An",
    "Bảo",
    "Bình",
    "Chi",
    "Dũng",
    "Giang",
    "Hạnh",
    "Hiếu",
    "Hoa",
    "Khánh",
    "Linh",
    "Long",
    "Mai",
    "Nam",
    "Nhi",
    "Phúc",
    "Phương",
    "Quang",
    "Sơn",
    "Thảo",
    "Trang",
    "Tuấn",
    "Vy",
    "Yến",
];

const STREET_NAMES = [
    "Nguyễn Trãi",
    "Lê Lợi",
    "Hai Bà Trưng",
    "Trần Hưng Đạo",
    "Võ Văn Kiệt",
    "Phạm Văn Đồng",
    "Nguyễn Văn Linh",
    "Hoàng Văn Thụ",
    "Lý Thường Kiệt",
    "Điện Biên Phủ",
];

const WARDS = [
    "Phường Bến Nghé",
    "Phường Bến Thành",
    "Phường Cầu Giấy",
    "Phường Dịch Vọng",
    "Phường An Hải",
    "Phường Hải Châu",
    "Phường Ninh Kiều",
    "Phường Tân An",
];

const CITY_STATE_LIST = [
    { city: "Hà Nội", state: "Hà Nội" },
    { city: "Hồ Chí Minh", state: "Hồ Chí Minh" },
    { city: "Đà Nẵng", state: "Đà Nẵng" },
    { city: "Cần Thơ", state: "Cần Thơ" },
    { city: "Hải Phòng", state: "Hải Phòng" },
    { city: "Nha Trang", state: "Khánh Hòa" },
    { city: "Huế", state: "Thừa Thiên Huế" },
    { city: "Đà Lạt", state: "Lâm Đồng" },
];

const SHOP_PREFIXES = [
    "Cửa Hàng",
    "Siêu Thị",
    "Trung Tâm",
    "Gian Hàng",
    "Nhà Phân Phối",
    "Kho Hàng",
];

const SHOP_SUFFIXES = [
    "Việt",
    "An Phát",
    "Phú Quý",
    "Minh Châu",
    "Thành Công",
    "Gia Đình",
    "Tín Nhiệm",
    "Bình Minh",
    "Sao Mai",
    "Kim Long",
];

const CATEGORY_NOUNS: Record<string, string[]> = {
    electronics: [
        "Thiết bị thông minh",
        "Phụ kiện điện tử",
        "Thiết bị âm thanh",
        "Đồ chơi công nghệ",
    ],
    smartphones: ["Điện thoại", "Smartphone", "Máy điện thoại", "Điện thoại camera"],
    laptops: ["Laptop", "Máy tính xách tay", "Ultrabook", "Laptop văn phòng"],
    menFashion: ["Áo khoác", "Áo sơ mi", "Quần jeans", "Áo thun"],
    kitchen: ["Máy xay", "Nồi chiên", "Ấm siêu tốc", "Bộ dụng cụ bếp"],
    homeLiving: ["Đèn bàn", "Kệ sách", "Ghế thư giãn", "Đồ gia dụng"],
};

const PRODUCT_ADJECTIVES = [
    "Cao cấp",
    "Tiện lợi",
    "Bền bỉ",
    "Sang trọng",
    "Tối ưu",
    "Hiện đại",
    "Thông minh",
    "Đa năng",
];

const MATERIALS = ["nhôm", "nhựa ABS", "thép không gỉ", "vải cao cấp", "gỗ công nghiệp"];

const COLORS = ["Đen", "Trắng", "Xanh dương", "Xanh lá", "Đỏ", "Bạc", "Vàng", "Hồng"];

const ORDER_NOTES = [
    "Giao giờ hành chính, vui lòng gọi trước.",
    "Khách cần kiểm tra ngoại quan trước khi nhận.",
    "Giao tận nơi, hỗ trợ đóng gói kỹ.",
    "Ưu tiên giao nhanh trong ngày.",
];

const PRODUCT_DESCRIPTIONS = [
    "Sản phẩm chính hãng, bảo hành đầy đủ, phù hợp nhu cầu sử dụng hằng ngày.",
    "Thiết kế hiện đại, chất liệu bền đẹp, tối ưu trải nghiệm người dùng.",
    "Cấu hình ổn định, dễ sử dụng và tiết kiệm chi phí vận hành.",
    "Phù hợp cả nhu cầu cá nhân và kinh doanh với độ bền cao.",
];

export function randomVietnameseFullName(): string {
    const family = faker.helpers.arrayElement(FAMILY_NAMES);
    const middle = faker.helpers.arrayElement(MIDDLE_NAMES);
    const given = faker.helpers.arrayElement(GIVEN_NAMES);

    return `${family} ${middle} ${given}`;
}

export function randomVietnameseAddress(): {
    streetAddress: string;
    wardDistrict: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
} {
    const cityState = faker.helpers.arrayElement(CITY_STATE_LIST);
    const streetNumber = faker.number.int({ min: 10, max: 999 });
    const streetName = faker.helpers.arrayElement(STREET_NAMES);

    return {
        streetAddress: `${streetNumber} ${streetName}`,
        wardDistrict: faker.helpers.arrayElement(WARDS),
        city: cityState.city,
        state: cityState.state,
        postalCode: String(faker.number.int({ min: 10000, max: 99999 })),
        country: "Việt Nam",
    };
}

export function randomVietnameseShopName(): string {
    const prefix = faker.helpers.arrayElement(SHOP_PREFIXES);
    const suffix = faker.helpers.arrayElement(SHOP_SUFFIXES);

    return `${prefix} ${suffix}`;
}

export function randomVietnameseShopDescription(): string {
    return faker.helpers.arrayElement([
        "Chuyên cung cấp sản phẩm chính hãng, giá minh bạch và dịch vụ tận tâm.",
        "Gian hàng uy tín với đa dạng ngành hàng và chính sách bảo hành rõ ràng.",
        "Tập trung trải nghiệm khách hàng và vận hành nhanh chóng trên đa kênh.",
    ]);
}

export function randomVietnameseColor(): string {
    return faker.helpers.arrayElement(COLORS);
}

export function randomVietnameseProductName(categoryKey: string): string {
    const nounPool = CATEGORY_NOUNS[categoryKey] ?? ["Sản phẩm"];
    const adjective = faker.helpers.arrayElement(PRODUCT_ADJECTIVES);
    const noun = faker.helpers.arrayElement(nounPool);

    return `${noun} ${adjective}`;
}

export function randomVietnameseProductDescription(): string {
    return faker.helpers.arrayElement(PRODUCT_DESCRIPTIONS);
}

export function randomVietnameseMaterial(): string {
    return faker.helpers.arrayElement(MATERIALS);
}

export function randomOrderNote(): string {
    return faker.helpers.arrayElement(ORDER_NOTES);
}
