export type TrangThaiKenh = "DANG_HOAT_DONG" | "CAN_XAC_THUC_LAI";

export type VaiTroThanhVien = "Toan quyen" | "Chi xu ly don" | "Chi xem";

export interface HoSoCuaHangHero {
  tenCuaHang: string;
  maDinhDanhNguoiBan: string;
  anhDaiDienUrl: string;
  anhBiaUrl: string;
  nutChinhSuaBanner: string;
}

export interface NhanDienThuongHieu {
  maMauChuDao: string;
  tenMauChuDao: string;
  giongDieuThuongHieu: string[];
}

export interface ThongTinDoanhNghiep {
  tenPhapNhan: string;
  maSoThue: string;
  diaChiDangKy: string;
  nguoiLienHe: string;
  emailDoanhNghiep: string;
}

export interface KenhBanHang {
  id: string;
  tenKenh: string;
  trangThai: TrangThaiKenh;
  thongDiepPhu: string;
}

export interface ThanhVienNhom {
  id: string;
  hoTen: string;
  vaiTro: string;
  quyenTruyCap: VaiTroThanhVien;
  avatarKyTu: string;
}

export interface TuyChonThongBao {
  id: string;
  tieuDe: string;
  moTa: string;
  dangBat: boolean;
}

export interface HanhDongChanTrang {
  nutHuy: string;
  nutLuu: string;
}

export interface DuLieuTrangHoSo {
  hero: HoSoCuaHangHero;
  nhanDienThuongHieu: NhanDienThuongHieu;
  thongTinDoanhNghiep: ThongTinDoanhNghiep;
  kenhBanHang: KenhBanHang[];
  thanhVienNhom: ThanhVienNhom[];
  tuyChonThongBao: TuyChonThongBao[];
  hanhDongChanTrang: HanhDongChanTrang;
}
