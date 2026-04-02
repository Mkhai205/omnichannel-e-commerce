export type CustomerThread = {
  id: string;
  customerName: string;
  preview: string;
  waitingMinutes: number;
  isActive: boolean;
  isOnline: boolean;
};

export type ChatMessage = {
  id: string;
  author: "customer" | "seller";
  body: string;
  sentAt: string;
  imageBlocks?: string[];
};

export type CustomerProfile = {
  fullName: string;
  email: string;
  totalOrders: string;
  totalSpend: string;
  memberSince: string;
  location: string;
  lastPurchase: string;
};

export type ActiveOrder = {
  orderCode: string;
  status: string;
  productName: string;
  productVariant: string;
  productPrice: string;
  actionPrimary: string;
  actionSecondary: string;
};

export type ConversationTab = {
  id: string;
  label: string;
  count: number;
  isActive: boolean;
};

export const headerContent = {
  eyebrow: "HỆ THỐNG CHĂM SÓC KHÁCH HÀNG",
  title: "Trung tâm Khiếu nại & Tư vấn",
  actionHistory: "Lịch sử hồ sơ",
  actionCreate: "Tạo khiếu nại mới",
};

export const conversationTabs: ConversationTab[] = [
  { id: "open", label: "Đang chờ", count: 12, isActive: true },
  { id: "all", label: "Tất cả", count: 0, isActive: false },
];

export const customerThreads: CustomerThread[] = [
  {
    id: "c-01",
    customerName: "Minh Hằng",
    preview: "Chào shop, mình muốn hỏi về đơn #ORD-8829...",
    waitingMinutes: 2,
    isActive: true,
    isOnline: true,
  },
  {
    id: "c-02",
    customerName: "Trần Văn Tú",
    preview: "Hoàn tiền đơn lỗi",
    waitingMinutes: 15,
    isActive: false,
    isOnline: false,
  },
  {
    id: "c-03",
    customerName: "Lê Hoàng Nam",
    preview: "Sản phẩm không đúng mô tả",
    waitingMinutes: 42,
    isActive: false,
    isOnline: false,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m-01",
    author: "customer",
    body: "Chào shop, mình nhận được đơn #ORD-8829 sáng nay nhưng hộp bị móp méo và sản phẩm bên trong có vẻ bị vỡ.",
    sentAt: "10:42 AM",
  },
  {
    id: "m-02",
    author: "customer",
    body: "Gửi shop ảnh chụp lỗi sản phẩm ạ. Mong shop xử lý giúp mình sớm.",
    sentAt: "10:44 AM",
    imageBlocks: ["Ảnh lỗi 1", "Ảnh lỗi 2"],
  },
  {
    id: "m-03",
    author: "seller",
    body: "Chào chị Hằng, shop rất xin lỗi về trải nghiệm không tốt này. Em đã tiếp nhận hình ảnh và thông tin từ chị.",
    sentAt: "10:46 AM",
  },
];

export const customerProfile: CustomerProfile = {
  fullName: "Minh Hằng",
  email: "hang.minh.92@email.com",
  totalOrders: "24",
  totalSpend: "12.5M",
  memberSince: "Tháng 01/2023",
  location: "Quận 1, TP.HCM",
  lastPurchase: "2 ngày trước",
};

export const activeOrder: ActiveOrder = {
  orderCode: "#ORD-8829",
  status: "ĐÃ GIAO",
  productName: "Đồng hồ Classic White",
  productVariant: "Màu trắng - SL 01",
  productPrice: "1.200.000đ",
  actionPrimary: "Hoàn tiền ngay (1.2M)",
  actionSecondary: "Từ chối khiếu nại",
};
