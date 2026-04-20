# Hướng Dẫn Seed Dữ Liệu

## Mục tiêu

Seed được chuẩn hóa về **một lệnh duy nhất**:

- Mỗi lần chạy sẽ **clean toàn bộ dữ liệu nghiệp vụ** rồi seed lại.
- Dữ liệu được tạo deterministic theo `seed-value`.
- Không còn profile/mode seed phụ.

## Lệnh sử dụng

Chạy từ root monorepo:

```bash
pnpm db:seed
```

Tùy chọn (không bắt buộc):

- `--seed-value <number>`: khóa random seed để tái lập dataset.
- `--dry-run`: chỉ preview cleanup, không xóa/tạo dữ liệu.

Ví dụ:

```bash
pnpm --filter @repo/database db:seed -- --seed-value 20260416
pnpm --filter @repo/database db:seed -- --dry-run
```

## Dataset mặc định

### Người dùng

- 1 `ADMIN` (`ACTIVE`)
- 2 `SELLER` (`ACTIVE`)
- 3 `CUSTOMER` (`ACTIVE`)

### Danh mục và catalog

- Category giữ nguyên taxonomy hiện tại (upsert theo slug).
- Mỗi category có `20` products.
- Mỗi product có `3` variants.
- Mỗi product có `3` reviews.
- Giá variant là bội số `1000` VND, lưu dạng decimal `.00`.

### Dữ liệu nghiệp vụ khác

- Cart, order, payment, webhook, wallet, ledger, settlement được seed ở mức cân đối để test flow end-to-end.
- Dữ liệu payment/settlement liên kết theo order seeded, không để orphan records.

## Quy tắc an toàn

- Local-only guard bật mặc định.
- Seed sẽ bị chặn nếu `DATABASE_URL` không thuộc local allowlist.
- Có thể tắt guard khi thực sự cần:

```bash
SEED_LOCAL_ONLY=false pnpm db:seed
```

## Lưu ý

- Lệnh mặc định luôn clean trước khi seed, nên không dùng trên môi trường có dữ liệu cần giữ lại.
- Muốn tái lập cùng một bộ dữ liệu qua nhiều lần chạy, luôn dùng cùng `--seed-value`.
