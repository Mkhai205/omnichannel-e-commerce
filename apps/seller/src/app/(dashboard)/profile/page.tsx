import { BrandIdentityCard } from "./_components/brand-identity-card";
import { BusinessInformationCard } from "./_components/business-information-card";
import { ChannelConnectionsCard } from "./_components/channel-connections-card";
import { NotificationPreferencesCard } from "./_components/notification-preferences-card";
import { ProfileActionBar } from "./_components/profile-action-bar";
import { ProfileHeroCard } from "./_components/profile-hero-card";
import { TeamAccessCard } from "./_components/team-access-card";
import { duLieuTrangHoSo } from "./data/profile-mock-data";

export default function ProfilePage() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 pb-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileHeroCard data={duLieuTrangHoSo.hero} />
        </div>
        <BrandIdentityCard data={duLieuTrangHoSo.nhanDienThuongHieu} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BusinessInformationCard data={duLieuTrangHoSo.thongTinDoanhNghiep} />
        <ChannelConnectionsCard items={duLieuTrangHoSo.kenhBanHang} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamAccessCard members={duLieuTrangHoSo.thanhVienNhom} />
        <NotificationPreferencesCard items={duLieuTrangHoSo.tuyChonThongBao} />
      </div>

      <ProfileActionBar data={duLieuTrangHoSo.hanhDongChanTrang} />
    </section>
  );
}
