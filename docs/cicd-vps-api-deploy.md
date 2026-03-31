# Thiết Lập CI/CD: Triển Khai NestJS API Lên VPS Qua Docker Hub

Tài liệu này hướng dẫn cách triển khai tự động service API (`apps/api`) từ GitHub Actions lên VPS của bạn.

## 1. Các Tệp Đã Thêm/Cập Nhật

- `apps/api/Dockerfile`: Docker build nhiều giai đoạn (multi-stage) cho pnpm workspace.
- `docker-compose.yml`: Stack chạy trên VPS (`postgres`, `minio`, `api`).
- `.github/workflows/deploy.yml`: Workflow CI/CD để build, push và deploy.

## 2. Secrets Trong GitHub Repository

Tạo các secrets sau tại **GitHub > Settings > Secrets and variables > Actions**:

- `DOCKERHUB_USERNAME`: Tên người dùng Docker Hub.
- `DOCKERHUB_TOKEN`: Access token Docker Hub.
- `VPS_IP`: IP public của VPS.
- `VPS_USER`: User SSH trên VPS.
- `SSH_PRIVATE_KEY`: Nội dung private key dùng để truy cập VPS.

## 3. Chuẩn Bị VPS

Cài Docker và Docker Compose plugin, sau đó clone repository vào:

- `~/omnichannel-e-commerce`

Bước deploy trong workflow hiện đang dùng đường dẫn này. Nếu bạn dùng đường dẫn khác, hãy cập nhật `APP_DIR` trong `.github/workflows/deploy.yml`.

## 4. Tạo Tệp `.env` Trên VPS

Tại thư mục gốc project trên VPS (cùng cấp với `docker-compose.yml`), tạo file `.env` tối thiểu như sau:

```env
# Docker Hub
DOCKERHUB_USERNAME=your_dockerhub_username

# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=omnichannel_e_commerce_db

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin123456

# API runtime vars (mẫu)
APP_PORT=3000
DATABASE_URL=postgresql://postgres:postgres_password@postgres:5432/omnichannel_e_commerce_db?schema=public
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_SECURE=false
MINIO_PUBLIC_ENDPOINT=your_vps_public_ip:9000
```

Lưu ý:

- Dùng tên service `postgres` và `minio` trong các URL nội bộ giữa container.
- Bổ sung đầy đủ các biến môi trường API khác từ `apps/api/.env.example` khi cần.

## 5. Khởi Chạy Lần Đầu Trên VPS

Chạy một lần trên VPS sau khi chuẩn bị xong `.env`:

```bash
cd ~/omnichannel-e-commerce
docker compose up -d postgres minio
docker compose up -d api
```

Sau đó, mỗi lần push lên `main` sẽ chỉ cập nhật container API.

## 6. Luồng Triển Khai

Khi có push vào `main`:

1. GitHub Actions build image từ `apps/api/Dockerfile`.
2. Image được push lên Docker Hub với tag:
    - `${DOCKERHUB_USERNAME}/ecommerce-api:latest`
    - `${DOCKERHUB_USERNAME}/ecommerce-api:<commit-sha>`
3. Workflow kết nối VPS qua SSH.
4. VPS pull image mới nhất.
5. VPS chỉ tạo lại service API:
    - `docker-compose up -d --no-deps api`

Việc này giúp `postgres` và `minio` tiếp tục chạy, không bị restart.

## 7. Kiểm Tra Triển Khai

Trên VPS:

```bash
cd ~/omnichannel-e-commerce
docker compose ps
docker compose logs -f api
```

Nếu API có health endpoint, kiểm tra từ máy local:

```bash
curl http://<VPS_IP>:3000/health
```
