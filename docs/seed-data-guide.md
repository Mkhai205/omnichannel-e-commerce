# Hướng Dẫn Seed Dữ Liệu

## Mục tiêu

Tài liệu này giúp bạn chọn đúng lệnh seed theo mục đích, hiểu rõ option, và tránh thao tác rủi ro.

## Lệnh nào dùng để làm gì

Dùng các lệnh từ root monorepo:

| Lệnh                         | Mục đích                                               | Khi dùng                              |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------- |
| `pnpm db:seed`               | Alias mặc định (tương đương `core`)                    | Seed nhanh cho local dev              |
| `pnpm db:seed:core`          | Seed dữ liệu nền (user/shop/catalog/cart/order cơ bản) | Dev UI/API hằng ngày                  |
| `pnpm db:seed:qa`            | Seed `core` + payment/wallet/settlement                | Test nghiệp vụ order-payment-đối soát |
| `pnpm db:seed:catalog`       | Append catalog nhẹ, không clean                        | Bổ sung dữ liệu demo nhanh            |
| `pnpm db:seed:catalog:load`  | Seed catalog số lượng lớn                              | Benchmark listing/search/paging       |
| `pnpm db:seed:catalog:heavy` | Seed catalog cực lớn                                   | Stress test                           |
| `pnpm db:seed:dry-run`       | Chỉ preview cleanup, không ghi DB                      | Kiểm tra tác động trước khi chạy thật |

## Profile và mode

- `core`: dữ liệu nền cho dev, cleanup mặc định `reset-seed-only`.
- `qa`: `core` + dữ liệu tài chính.
- `catalog-load`: ưu tiên volume catalog lớn, cleanup mặc định `prune-catalog-generated`.

- `full`: seed đầy đủ luồng core (có thể kèm finance nếu bật).
- `catalog`: chỉ xử lý category/product/variant theo hướng append.

## Cách dùng option

Lệnh mẫu:

```bash
pnpm --filter @repo/database db:seed -- --profile qa --cleanup-mode reset-seed-only --seed-value 20270001
```

| Option                                                                       | Ý nghĩa                                       | Khi nên dùng                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `--profile <core, qa, catalog-load>`                                         | Chọn preset seed                              | Luôn đặt rõ profile để tránh chạy sai mục đích             |
| `--mode <full, catalog>`                                                     | Ghi đè mode của profile                       | Khi cần ép profile chạy theo mode khác mặc định            |
| `--cleanup-mode <none, reset-all, reset-seed-only, prune-catalog-generated>` | Chọn chiến lược dọn dữ liệu trước seed        | Khi DB có dữ liệu quan trọng cần kiểm soát phạm vi cleanup |
| `--dry-run`                                                                  | Chỉ in preview cleanup, không xóa/tạo dữ liệu | Nên chạy trước với cleanup mode mới                        |
| `--include-finance <true, false>`                                            | Bật/tắt seed payment-wallet trong mode `full` | Bật khi test tài chính; tắt để seed nhanh                  |
| `--seed-value <number>`                                                      | Cố định dữ liệu faker để tái lập              | QA, debug, bug reproduction                                |
| `--products-per-category <n>`                                                | Số product tạo thêm mỗi category              | Scale catalog theo nhu cầu test                            |
| `--variants-min <n>`                                                         | Số variant tối thiểu mỗi product              | Tăng độ đa dạng dữ liệu                                    |
| `--variants-max <n>`                                                         | Số variant tối đa mỗi product                 | Dùng cùng `variants-min`                                   |
| `--active-ratio <0..1>`                                                      | Tỉ lệ product `ACTIVE`                        | Test hành vi filter/listing theo status                    |

## Cleanup mode (chọn nhanh)

- `none`: không xóa gì trước seed.
- `reset-seed-only`: chỉ xóa dữ liệu có marker seed (an toàn nhất cho DB dev trộn dữ liệu).
- `prune-catalog-generated`: chỉ xóa catalog sinh tự động (`SEED-EXT-*`) và dữ liệu phụ thuộc.
- `reset-all`: xóa toàn bộ dữ liệu nghiệp vụ trong phạm vi cleanup, cần rất thận trọng.

## Quy tắc an toàn

- Local-only guard bật mặc định.
- Seed bị chặn nếu `DATABASE_URL` không thuộc host local allowlist.
- Chỉ tắt guard khi thực sự cần:

```bash
SEED_LOCAL_ONLY=false pnpm db:seed:core
```

## Kịch bản chạy nhanh

### 1) Setup local dev

```bash
pnpm db:seed:core
```

### 2) Test full flow đơn hàng + thanh toán

```bash
pnpm db:seed:qa -- --seed-value 20270001
```

### 3) Bơm lớn dữ liệu catalog

```bash
pnpm db:seed:catalog:load
```

### 4) Xem trước cleanup

```bash
pnpm db:seed:dry-run
```

## Lưu ý

- Category seed idempotent theo slug.
- Tiền được tính theo cents-based để tránh sai số dấu phẩy động.
- Muốn kết quả lặp lại giữa nhiều lần seed, luôn khóa `--seed-value`.
