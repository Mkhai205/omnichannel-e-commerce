import type { DuLieuTrangHoSo } from "../types";

export const duLieuTrangHoSo: DuLieuTrangHoSo = {
  hero: {
    tenCuaHang: "Nhà Aura Fashion",
    maDinhDanhNguoiBan: "MID-99120304",
    anhDaiDienUrl: "/products/avartar.png",
    anhBiaUrl: "/products/background.png",
    nutChinhSuaBanner: "Chỉnh sửa",
  },
  nhanDienThuongHieu: {
    maMauChuDao: "#2196F3",
    tenMauChuDao: "Xanh da trời",
    giongDieuThuongHieu: ["Tối giản", "Sang trọng", "Hiện đại"],
  },
  thongTinDoanhNghiep: {
    tenPhapNhan: "Công ty TNHH Aura Collective Group",
    maSoThue: "99-1234-567-X",
    diaChiDangKy: "88 Orchard Road, Suite 12-04, Orchard Gateway, Singapore 238851",
    nguoiLienHe: "Sarah Mitchell",
    emailDoanhNghiep: "hq@aurafashion.com",
  },
  kenhBanHang: [
    {
      id: "shopee",
      tenKenh: "Shopee Mall",
      trangThai: "DANG_HOAT_DONG",
      thongDiepPhu: "Đồng bộ lần cuối: 2 phút trước",
    },
    {
      id: "lazada",
      tenKenh: "Lazada Flagship",
      trangThai: "DANG_HOAT_DONG",
      thongDiepPhu: "Đã bật tự động đồng bộ",
    },
    {
      id: "tiktok",
      tenKenh: "TikTok Shop Global",
      trangThai: "CAN_XAC_THUC_LAI",
      thongDiepPhu: "Cần xác thực lại quyền kết nối",
    },
  ],
  thanhVienNhom: [
    {
      id: "member-1",
      hoTen: "Marcus Chen",
      vaiTro: "Quản lý cửa hàng",
      quyenTruyCap: "Toan quyen",
      avatarKyTu: "MC",
    },
    {
      id: "member-2",
      hoTen: "Elena Rodriguez",
      vaiTro: "Trưởng nhóm kho vận",
      quyenTruyCap: "Chi xu ly don",
      avatarKyTu: "ER",
    },
    {
      id: "member-3",
      hoTen: "James Roland",
      vaiTro: "Trợ lý marketing",
      quyenTruyCap: "Chi xem",
      avatarKyTu: "JR",
    },
  ],
  tuyChonThongBao: [
    {
      id: "order-alert",
      tieuDe: "Cảnh báo đơn hàng theo thời gian thực",
      moTa: "Nhận thông báo ngay khi có đơn mới trên tất cả thiết bị.",
      dangBat: true,
    },
    {
      id: "inventory-alert",
      tieuDe: "Cảnh báo tồn kho thấp",
      moTa: "Tổng hợp hằng ngày khi sản phẩm sắp hết dưới ngưỡng an toàn.",
      dangBat: true,
    },
    {
      id: "marketing-report",
      tieuDe: "Báo cáo hiệu quả marketing",
      moTa: "Nhận bản tổng hợp hằng tuần về hiệu suất chiến dịch và ROAS.",
      dangBat: false,
    },
  ],
  hanhDongChanTrang: {
    nutHuy: "Hủy thay đổi",
    nutLuu: "Lưu toàn bộ thay đổi",
  },
};
