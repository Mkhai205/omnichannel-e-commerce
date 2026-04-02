export type ComplaintProcessStatus = "ĐANG_CHỜ" | "ĐANG_XỬ_LÝ";

export type CustomerComplaintRecord = {
  customerId: string;
  customerFullName: string;
  sellerId: string;
  sellerFullName: string;
  complaintProductId: string;
  complaintStatus: ComplaintProcessStatus;
  createdAt: string;
};

export type ComplaintChatMessage = {
  id: string;
  author: "customer" | "seller";
  body: string;
  sentAt: string;
  imageBlocks?: string[];
};

export const localSeller = {
  sellerId: "SEL-2001",
  sellerFullName: "Shop Đồng Hồ An Nhiên",
};

export const customerServiceLocalDatabase: CustomerComplaintRecord[] = [
  {
    customerId: "CUS-1001",
    customerFullName: "Minh Hằng",
    sellerId: localSeller.sellerId,
    sellerFullName: localSeller.sellerFullName,
    complaintProductId: "PRD-8829",
    complaintStatus: "ĐANG_CHỜ",
    createdAt: "2026-03-30T09:58:00+07:00",
  },
  {
    customerId: "CUS-1002",
    customerFullName: "Trần Văn Tú",
    sellerId: localSeller.sellerId,
    sellerFullName: localSeller.sellerFullName,
    complaintProductId: "PRD-7721",
    complaintStatus: "ĐANG_XỬ_LÝ",
    createdAt: "2026-03-30T09:45:00+07:00",
  },
  {
    customerId: "CUS-1003",
    customerFullName: "Lê Hoàng Nam",
    sellerId: localSeller.sellerId,
    sellerFullName: localSeller.sellerFullName,
    complaintProductId: "PRD-6604",
    complaintStatus: "ĐANG_XỬ_LÝ",
    createdAt: "2026-03-30T09:18:00+07:00",
  },
  {
    customerId: "CUS-1004",
    customerFullName: "Nguyễn Thu Trang",
    sellerId: localSeller.sellerId,
    sellerFullName: localSeller.sellerFullName,
    complaintProductId: "PRD-4450",
    complaintStatus: "ĐANG_CHỜ",
    createdAt: "2026-03-30T08:40:00+07:00",
  },
  {
    customerId: "CUS-1005",
    customerFullName: "Phạm Gia Bảo",
    sellerId: localSeller.sellerId,
    sellerFullName: localSeller.sellerFullName,
    complaintProductId: "PRD-9033",
    complaintStatus: "ĐANG_XỬ_LÝ",
    createdAt: "2026-03-30T07:30:00+07:00",
  },
];

const complaintChatLocalDatabase: Record<string, ComplaintChatMessage[]> = {
  "CUS-1001": [
    {
      id: "CUS-1001-01",
      author: "customer",
      body: "Shop ơi, đơn #ORD-8829 của mình bị móp hộp và có dấu hiệu nứt mặt kính.",
      sentAt: "10:42",
    },
    {
      id: "CUS-1001-02",
      author: "customer",
      body: "Mình gửi ảnh lỗi để shop kiểm tra giúp nhé.",
      sentAt: "10:44",
      imageBlocks: ["Ảnh lỗi 1", "Ảnh lỗi 2"],
    },
    {
      id: "CUS-1001-03",
      author: "seller",
      body: "Shop đã tiếp nhận và sẽ hỗ trợ hoàn tiền hoặc đổi mới trong hôm nay.",
      sentAt: "10:46",
    },
  ],
  "CUS-1002": [
    {
      id: "CUS-1002-01",
      author: "customer",
      body: "Mình cần hỗ trợ hoàn tiền cho sản phẩm bị sai mô tả.",
      sentAt: "09:58",
    },
    {
      id: "CUS-1002-02",
      author: "seller",
      body: "Shop đã chuyển bộ phận xử lý, dự kiến phản hồi trong 2 giờ.",
      sentAt: "10:06",
    },
  ],
  "CUS-1003": [
    {
      id: "CUS-1003-01",
      author: "customer",
      body: "Hàng nhận được không đúng màu mình đặt ban đầu.",
      sentAt: "09:25",
    },
    {
      id: "CUS-1003-02",
      author: "seller",
      body: "Shop đã ghi nhận, mình gửi giúp shop mã đơn và ảnh tem sản phẩm.",
      sentAt: "09:31",
    },
  ],
  "CUS-1004": [
    {
      id: "CUS-1004-01",
      author: "customer",
      body: "Sản phẩm bị thiếu phụ kiện, nhờ shop kiểm tra giúp mình.",
      sentAt: "08:45",
    },
  ],
  "CUS-1005": [
    {
      id: "CUS-1005-01",
      author: "customer",
      body: "Mình đã gửi yêu cầu khiếu nại từ sáng, shop hỗ trợ giúp.",
      sentAt: "07:36",
    },
    {
      id: "CUS-1005-02",
      author: "seller",
      body: "Shop đã tiếp nhận và sẽ cập nhật tiến độ xử lý vào chiều nay.",
      sentAt: "07:52",
    },
  ],
};

export function getComplaintMessagesByCustomerId(customerId: string): ComplaintChatMessage[] {
  return complaintChatLocalDatabase[customerId] ?? [];
}

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function appendComplaintMessageByCustomerId(
  customerId: string,
  body: string,
  author: "customer" | "seller" = "seller",
): ComplaintChatMessage | null {
  const normalizedBody = body.trim();
  if (!normalizedBody) {
    return null;
  }

  const existingMessages = complaintChatLocalDatabase[customerId] ?? [];
  const nextIndex = existingMessages.length + 1;
  const nextMessage: ComplaintChatMessage = {
    id: `${customerId}-${String(nextIndex).padStart(2, "0")}`,
    author,
    body: normalizedBody,
    sentAt: formatCurrentTime(),
  };

  complaintChatLocalDatabase[customerId] = [...existingMessages, nextMessage];
  return nextMessage;
}
