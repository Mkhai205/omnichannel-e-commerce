# Tóm tắt kiến trúc hệ thống: 3 Frontend + API + Hạ tầng

## 1. Mô hình tổng thể

Hệ thống được tổ chức theo mô hình **monorepo** (Turborepo + pnpm workspaces), triển khai theo kiến trúc **đa ứng dụng frontend + 1 backend API trung tâm**:

- `apps/web`: Client cho khách hàng (storefront)
- `apps/admin`: Client cho quản trị hệ thống
- `apps/seller`: Client cho nhà bán hàng
- `apps/api`: Backend API (NestJS), cung cấp nghiệp vụ chung cho cả 3 frontend

Các frontend giao tiếp với backend qua HTTP REST (`/api/v1`), dùng chung contract type từ `packages/shared-types`.

## 2. Mô hình client 3 web frontend

### 2.1 Web (Customer)

- Vai trò: trang bán hàng cho người mua
- Chức năng chính: duyệt catalog, xem sản phẩm, giỏ hàng, checkout, theo dõi đơn
- Runtime container: cổng nội bộ `3000`, map host `3000`

### 2.2 Admin

- Vai trò: vận hành nền tảng
- Chức năng chính: quản trị user/shop, catalog, đơn hàng, tài chính
- Runtime container: cổng nội bộ `3000`, map host `3001`

### 2.3 Seller

- Vai trò: cổng nhà bán hàng
- Chức năng chính: quản lý shop, sản phẩm, đơn bán, trạng thái vận chuyển, doanh thu/đối soát
- Runtime container: cổng nội bộ `3000`, map host `3002`

## 3. Backend API theo kiểu microservices (service theo domain)

Backend hiện là **modular monolith** trong NestJS, nhưng tổ chức rõ theo domain, có thể xem như các "microservice logic" nằm trong cùng một process/container.

### 3.1 Core domain services

- **Auth Service** (`AuthModule`)
    - Đăng ký/đăng nhập/refresh token/đăng xuất
    - OAuth Google
    - Quên mật khẩu, xác thực email
- **Users Service** (`UsersModule`)
    - Hồ sơ người dùng, địa chỉ
    - Quản trị user (role/status)
- **Shop Service** (`ShopModule`)
    - Quản lý shop cho seller
    - Quản trị duyệt shop, public shop listing
- **Catalog Service** (`CatalogModule`)
    - Danh mục, sản phẩm, biến thể, review
    - API theo nhóm quyền: public/seller/admin
- **Cart Service** (`CartModule`)
    - Giỏ hàng người mua
- **Orders Service** (`OrdersModule`)
    - Checkout, vòng đời đơn hàng
    - API cho customer/seller/admin
- **Payments Service** (`PaymentsModule`)
    - Tạo payment URL VNPay
    - Xử lý return/IPN, đồng bộ trạng thái thanh toán
- **Finance Service** (`FinanceModule`)
    - Ví seller, settlement/payout
    - API tài chính cho admin và seller
- **Shipping Service** (`ShippingModule`)
    - Trạng thái vận chuyển, nghiệp vụ shipping theo đơn

### 3.2 Shared infrastructure services trong API

- **Prisma Database Service** (`PrismaModule`): truy cập PostgreSQL
- **Mail Service** (`MailModule`): gửi mail và render template email
- **Storage Service** (`StorageModule`): lưu trữ object qua MinIO

## 4. Third-party API tích hợp

### 4.1 Google Auth

- Dùng OAuth2 với Google cho luồng social login
- Các endpoint Google được gọi từ `AuthGoogleService`:
    - `https://accounts.google.com/o/oauth2/v2/auth`
    - `https://oauth2.googleapis.com/token`
    - `https://openidconnect.googleapis.com/v1/userinfo`

### 4.2 Email (Gmail SMTP)

- Tích hợp SMTP của Gmail trong `MailModule`
- Có template email cho:
    - Welcome email
    - Verify email
    - Reset password

### 4.3 VNPay

- Tích hợp trong `PaymentsService`
- Chức năng:
    - Tạo URL thanh toán VNPay
    - Verify kết quả trả về (return)
    - Xử lý IPN webhook và idempotency

## 5. Database

- Engine: **PostgreSQL**
- ORM/Data access: **Prisma** (`packages/database`)
- Prisma schema là nguồn sự thật cho mô hình dữ liệu
- Thiết kế entity theo e-commerce domain: user, shop, product, variant, cart, order, payment, settlement...
- Primary key mặc định dùng UUID trong schema hiện tại

## 6. Storage

- Dùng **MinIO** cho object storage
- Dữ liệu lưu trữ điển hình:
    - Ảnh sản phẩm
    - Bằng chứng/biên nhận
    - Ảnh đại diện
- API backend tạo URL truy cập/public URL/presigned URL cho upload-download

## 7. Đóng gói và triển khai runtime

### 7.1 Đóng gói Docker

- Mỗi app có Dockerfile riêng (`apps/api`, `apps/web`, `apps/admin`, `apps/seller`)
- Build theo kiểu multi-stage:
    - Stage builder: cài deps bằng pnpm, build workspace cần thiết
    - Stage runner: chỉ giữ artifact runtime + `node_modules` production
- Dùng `pnpm deploy --prod` để tách runtime deps theo từng app

### 7.2 Orchestration với Docker Compose

`docker-compose.yml` vận hành full stack gồm:

- `postgres`
- `minio`
- `api`
- `web`
- `admin`
- `seller`

Trong mạng bridge nội bộ chung để các service gọi nhau theo service name.

## 8. CI/CD với GitHub Actions

Workflow: `.github/workflows/deploy.yml` (trigger khi push nhánh `main`).

### 8.1 Các job chính

- `build-api`
    - Build và push image `ecommerce-api`
    - Tag: `latest` và `${github.sha}`
- `build-frontends` (matrix: `web`, `admin`, `seller`)
    - Build và push từng image frontend
    - Tag: `latest` và `${github.sha}`
- `deploy`
    - SSH vào VPS
    - Pull image theo commit SHA
    - `docker compose up -d --no-deps` cho `api web admin seller`
    - Health check endpoint public
    - Nếu fail thì rollback về tag trước đó (`.image-tag`)

### 8.2 Chuỗi phát hành

1. Developer push code vào `main`
2. GitHub Actions build image và đẩy lên Docker Hub
3. VPS pull image mới và restart dịch vụ ứng dụng
4. Health check tự động
5. Thành công thì ghi tag mới; thất bại thì rollback

## 9. Kết luận ngắn

Kiến trúc hiện tại phù hợp giai đoạn scale theo domain: 3 frontend độc lập theo vai trò, backend tập trung nhưng tách module rõ ràng theo hướng microservices logic, tích hợp sẵn Google Auth + Gmail SMTP + VNPay, chạy trên PostgreSQL + MinIO, đóng gói Docker và triển khai tự động bằng GitHub Actions.
