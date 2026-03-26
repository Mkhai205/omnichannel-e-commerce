### 📋 Bảng Kế Hoạch Triển Khai Monorepo E-commerce

#### Phase 1: Khởi tạo Hạ tầng & Cấu hình lõi (Sprint 1)

Mục tiêu: Đảm bảo toàn bộ team có môi trường code chuẩn nhất, chạy được `turbo run dev` trơn tru.

| Mã         | Hạng mục công việc (Task)               | Phân hệ  | Đầu ra kỳ vọng (DoD)                                              |
| :--------- | :-------------------------------------- | :------- | :---------------------------------------------------------------- |
| **INF-01** | Khởi tạo Monorepo & Pnpm Workspaces     | Root     | Thư mục `apps` và `packages` được link với nhau.                  |
| **INF-02** | Viết file cấu hình `turbo.json`         | Root     | Định nghĩa luồng build, lint, test theo dependency graph.         |
| **INF-03** | Thiết lập `docker-compose.yml`          | Infra    | Chạy 1 lệnh lên được PostgreSQL, Redis và MinIO cục bộ.           |
| **PKG-01** | Setup `packages/database` (Prisma)      | Packages | Schema Prisma hoàn chỉnh, chạy được lệnh generate & push.         |
| **PKG-02** | Setup `packages/shared-types`           | Packages | Định nghĩa xong các DTO cơ bản (User, Shop, Product).             |
| **PKG-03** | Setup `packages/ui` (Shared Components) | Packages | Tích hợp TailwindCSS, tạo sẵn component Button, Input dùng chung. |

#### Phase 2: Phát triển Backend API Core (Sprint 2 & 3)

Mục tiêu: Xây dựng các nghiệp vụ nền tảng. Backend phải đi trước một bước để Frontend có API tích hợp.

| Mã        | Hạng mục công việc (Task)             | Phân hệ    | Đầu ra kỳ vọng (DoD)                                        |
| :-------- | :------------------------------------ | :--------- | :---------------------------------------------------------- |
| **BE-01** | Module Authentication & Authorization | `apps/api` | Đăng nhập/Đăng ký (JWT), Phân quyền Role (Guard NestJS).    |
| **BE-02** | Module Quản lý User & Cửa hàng        | `apps/api` | API đăng ký mở Shop, duyệt Shop (Admin), cập nhật Profile.  |
| **BE-03** | Module Quản lý Danh mục & Sản phẩm    | `apps/api` | API tạo Category (cây đệ quy), tạo Product & Variant (SKU). |
| **BE-04** | Tích hợp Storage upload ảnh (MinIO)   | `apps/api` | API upload ảnh sản phẩm, avatar, evidence khiếu nại.        |

#### Phase 3: Nghiệp vụ Đơn hàng, Thanh toán & Tồn kho (Sprint 4 & 5)

Mục tiêu: Xử lý thành công luồng tiền và luồng hàng - "trái tim" của hệ thống E-commerce.

| Mã        | Hạng mục công việc (Task)        | Phân hệ    | Đầu ra kỳ vọng (DoD)                                                |
| :-------- | :------------------------------- | :--------- | :------------------------------------------------------------------ |
| **BE-05** | Luồng Giỏ hàng (Cart)            | `apps/api` | Thêm/Sửa/Xóa item, tính toán tạm tính (tích hợp Redis).             |
| **BE-06** | Checkout & Split Orders          | `apps/api` | Tách giỏ hàng thành nhiều đơn theo Shop, trừ tồn kho (Transaction). |
| **BE-07** | Tích hợp cổng thanh toán         | `apps/api` | Tích hợp VNPAY/ZaloPay, xử lý Webhook trả về trạng thái giao dịch.  |
| **BE-08** | Module Đối soát (Reconciliation) | `apps/api` | Job tự động (Cronjob) tính doanh thu và phí sàn định kỳ cho Shop.   |

#### Phase 4: Phát triển Frontend (Sprint 3 đến Sprint 6)

Mục tiêu: Giao diện người dùng cho cả 3 đối tượng (áp dụng SSR/RSC của Next.js).

| Mã        | Hạng mục công việc (Task)        | Phân hệ       | Đầu ra kỳ vọng (DoD)                                               |
| :-------- | :------------------------------- | :------------ | :----------------------------------------------------------------- |
| **FE-01** | Trang Web Khách Hàng (Customer)  | `apps/web`    | Home, Danh sách sản phẩm, Chi tiết sản phẩm, Giỏ hàng, Checkout.   |
| **FE-02** | Kênh Người Bán (Seller Center)   | `apps/seller` | Dashboard doanh thu, Đăng sản phẩm, Quản lý đơn, Cấu hình Voucher. |
| **FE-03** | Trang Quản Trị (Admin Dashboard) | `apps/admin`  | Duyệt Shop, Quản lý User, Báo cáo tổng doanh thu sàn.              |

#### Phase 5: Testing, Tối ưu & CI/CD (Sprint 7)

Mục tiêu: Đưa dự án lên môi trường staging, sẵn sàng self-host hoặc deploy lên production.

| Mã         | Hạng mục công việc (Task)             | Phân hệ    | Đầu ra kỳ vọng (DoD)                                                   |
| :--------- | :------------------------------------ | :--------- | :--------------------------------------------------------------------- |
| **QA-01**  | Viết Unit Test cho nghiệp vụ Đơn hàng | `apps/api` | Cover 100% case tính sai tiền, trừ âm tồn kho (Jest).                  |
| **OPS-01** | Đóng gói Docker Images                | Root       | Build thành công image cho API và 3 app Web.                           |
| **OPS-02** | Deploy VPS & Cấu hình Nginx           | Infra      | Cấu hình SSL (HTTPS), Proxy pass port, thiết lập Load Balancer cơ bản. |

---

### Quản lý Rủi ro (Risk Management)

Là PM, tôi lưu ý 3 điểm rủi ro lớn nhất bạn cần kiểm soát chặt:

1. **Lỗi trừ âm tồn kho (Over-selling):** Xảy ra khi nhiều người cùng đặt mua 1 món hàng tại 1 thời điểm. (Giải pháp: Dùng cơ chế khóa dòng - Row-level locking trong Postgres hoặc Redlock với Redis).
2. **Sai lệch kiểu dữ liệu:** Đã được kiểm soát bằng quy trình Monorepo Type Management mà chúng ta đã thống nhất.
3. **Thất thoát dữ liệu thanh toán:** Xảy ra khi cổng thanh toán gọi Webhook về nhưng server sập. (Giải pháp: Cần thiết kế bảng lưu log giao dịch riêng và có cơ chế retry tự động).
