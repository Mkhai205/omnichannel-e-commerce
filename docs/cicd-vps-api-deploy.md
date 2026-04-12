# Thiết Lập CI/CD: Triển Khai Full Stack Lên VPS Qua Docker Hub

Tài liệu này hướng dẫn triển khai tự động toàn bộ ứng dụng (`api`, `web`, `admin`, `seller`) từ GitHub Actions lên VPS.

## 1. Các Tệp Đã Thêm/Cập Nhật

- `apps/api/Dockerfile`: Docker build cho API NestJS.
- `apps/web/Dockerfile`: Docker build cho Next.js web app.
- `apps/admin/Dockerfile`: Docker build cho Next.js admin app.
- `apps/seller/Dockerfile`: Docker build cho Next.js seller app.
- `docker-compose.yml`: Stack chạy trên VPS (`postgres`, `minio`, `api`, `web`, `admin`, `seller`).
- `.github/workflows/deploy.yml`: Workflow CI/CD build, push, deploy, health check và rollback tự động.

## 2. Secrets Trong GitHub Repository

Tạo các secrets sau tại **GitHub > Settings > Secrets and variables > Actions**:

- `DOCKERHUB_USERNAME`: Tên người dùng Docker Hub.
- `DOCKERHUB_TOKEN`: Access token Docker Hub.
- `VPS_IP`: IP public của VPS.
- `VPS_SSH_PORT`: Cổng SSH của VPS (ví dụ `8900`).
- `VPS_USER`: User SSH trên VPS.
- `SSH_PRIVATE_KEY`: Private key dùng để truy cập VPS.

## 3. Chuẩn Bị VPS

Cài Docker và Docker Compose plugin, sau đó clone repository vào:

- `~/omnichannel-e-commerce`

Nếu bạn dùng đường dẫn khác, cập nhật `APP_DIR` trong `.github/workflows/deploy.yml`.

## 4. Tạo Tệp `.env.prod` Trên VPS

Tại thư mục gốc project (cùng cấp với `docker-compose.yml`), tạo file `.env.prod`.

Các biến quan trọng cần đúng theo production:

```env
NODE_ENV=production
CORS_ORIGIN=["https://omnichannel-ecommerce.kakadev.xyz","https://seller-omnichannel-ecommerce.kakadev.xyz","https://admin-omnichannel-ecommerce.kakadev.xyz"]

# API public URL cho Next build (được set trong workflow build args)
NEXT_PUBLIC_API_URL=https://api-omnichannel-ecommerce.kakadev.xyz
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

Lưu ý:

- Dùng tên service nội bộ (`postgres`, `minio`) trong `DATABASE_URL`, `MINIO_ENDPOINT` nếu chạy nội bộ Docker network.
- Không commit secrets thật lên git. Lưu trên VPS hoặc Secrets Manager.

## 5. Mapping Port Và Domain

Stack đang map:

- API: host `8000` -> container `8000`
- Web: host `3000` -> container `3000`
- Admin: host `3001` -> container `3000`
- Seller: host `3002` -> container `3000`

Nginx reverse proxy tương ứng:

- `api-omnichannel-ecommerce.kakadev.xyz` -> `http://localhost:8000`
- `omnichannel-ecommerce.kakadev.xyz` -> `http://localhost:3000`
- `admin-omnichannel-ecommerce.kakadev.xyz` -> `http://localhost:3001`
- `seller-omnichannel-ecommerce.kakadev.xyz` -> `http://localhost:3002`

## 6. Luồng Triển Khai Tự Động

Khi push vào `main`:

1. Build và push image API với 2 tag:
    - `${DOCKERHUB_USERNAME}/ecommerce-api:latest`
    - `${DOCKERHUB_USERNAME}/ecommerce-api:<commit-sha>`
2. Build và push image frontend (`web`, `admin`, `seller`) với 2 tag tương tự.
3. SSH vào VPS, pull toàn bộ image theo tag commit.
4. Deploy theo tag commit (`IMAGE_TAG=<sha>`), chỉ restart app services.
5. Health check qua 4 domain public.
6. Nếu health check fail, tự rollback về tag trước đó.

## 7. Khởi Chạy Lần Đầu Trên VPS

```bash
cd ~/omnichannel-e-commerce
docker compose --env-file .env.prod up -d postgres minio
docker compose --env-file .env.prod up -d api web admin seller
```

## 8. Kiểm Tra Sau Deploy

```bash
cd ~/omnichannel-e-commerce
docker compose --env-file .env.prod ps
docker compose --env-file .env.prod logs -f api
docker compose --env-file .env.prod logs -f web
docker compose --env-file .env.prod logs -f admin
docker compose --env-file .env.prod logs -f seller
```

Kiểm tra endpoint nhanh:

```bash
curl -I https://api-omnichannel-ecommerce.kakadev.xyz/api/v1
curl -I https://omnichannel-ecommerce.kakadev.xyz
curl -I https://admin-omnichannel-ecommerce.kakadev.xyz
curl -I https://seller-omnichannel-ecommerce.kakadev.xyz
```

## 9. Rollback Thủ Công (Khi Cần)

Workflow tự lưu tag đã deploy thành công trong file `.image-tag` trên VPS.

Rollback thủ công:

```bash
cd ~/omnichannel-e-commerce
export DOCKERHUB_USERNAME=<your_dockerhub_username>
export IMAGE_TAG=<old_commit_sha>
docker compose --env-file .env.prod up -d --no-deps api web admin seller
```
