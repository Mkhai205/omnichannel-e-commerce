### 1. Module Quản lý Người dùng & Cửa hàng

**Bảng `users` (Người dùng)**
Quản lý tài khoản đăng nhập của toàn bộ hệ thống.

| Tên Cột         | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                        |
| :-------------- | :------------------------ | :------------------------------- | :------------------------------------------- |
| `id`            | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                   |
| `email`         | `VARCHAR(255)`            | UNIQUE, NOT NULL                 | Tên đăng nhập                                |
| `password_hash` | `VARCHAR(255)`            | NOT NULL                         | Mật khẩu đã mã hóa (bcrypt/argon2)           |
| `full_name`     | `VARCHAR(255)`            | NOT NULL                         | Họ và tên                                    |
| `phone`         | `VARCHAR(20)`             | UNIQUE, NULL                     | Số điện thoại                                |
| `role`          | `VARCHAR(50)`             | NOT NULL, Default 'CUSTOMER'     | Vai trò: `CUSTOMER`, `SELLER`, `ADMIN`       |
| `status`        | `VARCHAR(50)`             | NOT NULL, Default 'ACTIVE'       | Trạng thái: `ACTIVE`, `BANNED`, `UNVERIFIED` |
| `created_at`    | `TIMESTAMPTZ`             | Default `NOW()`                  | Thời gian tạo tài khoản                      |
| `updated_at`    | `TIMESTAMPTZ`             | Default `NOW()`                  | Thời gian cập nhật gần nhất                  |

**Bảng `shops` (Cửa hàng)**
Lưu trữ thông tin gian hàng của người bán.

| Tên Cột            | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                         |
| :----------------- | :------------------------ | :------------------------------- | :-------------------------------------------- |
| `id`               | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                    |
| `user_id`          | `UUID`                    | FK (users.id), UNIQUE            | Chủ cửa hàng (Mỗi user 1 shop)                |
| `shop_name`        | `VARCHAR(255)`            | NOT NULL                         | Tên hiển thị của gian hàng                    |
| `slug`             | `VARCHAR(255)`            | UNIQUE, NOT NULL                 | Đường dẫn (VD: shopee.vn/`shop-name`)         |
| `description`      | `TEXT`                    | NULL                             | Giới thiệu gian hàng                          |
| `business_license` | `VARCHAR(255)`            | NULL                             | Link ảnh giấy phép kinh doanh (nếu có)        |
| `status`           | `VARCHAR(50)`             | NOT NULL, Default 'PENDING'      | Trạng thái: `PENDING`, `APPROVED`, `REJECTED` |
| `created_at`       | `TIMESTAMPTZ`             | Default `NOW()`                  | Thời gian đăng ký mở shop                     |

---

### 2. Module Sản phẩm & Kho hàng

**Bảng `categories` (Danh mục)**
Sử dụng mô hình Adjacency List (Danh sách kề) để tạo cây thư mục.

| Tên Cột     | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                  |
| :---------- | :------------------------ | :------------------------------- | :------------------------------------- |
| `id`        | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                             |
| `parent_id` | `UUID`                    | FK (categories.id), NULL         | Danh mục cha (NULL nếu là cấp 1)       |
| `name`      | `VARCHAR(255)`            | NOT NULL                         | Tên danh mục (VD: Điện thoại, Quần áo) |
| `slug`      | `VARCHAR(255)`            | UNIQUE, NOT NULL                 | URL thân thiện                         |

**Bảng `products` (Sản phẩm)**
Thông tin chung, không chứa giá và tồn kho (chuyển xuống Variant).

| Tên Cột                   | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                                                |
| :------------------------ | :------------------------ | :------------------------------- | :------------------------------------------------------------------- |
| `id`                      | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                                           |
| `shop_id`                 | `UUID`                    | FK (shops.id), NOT NULL          | Thuộc cửa hàng nào                                                   |
| `category_id`             | `UUID`                    | FK (categories.id), NOT NULL     | Thuộc danh mục nào                                                   |
| `name`                    | `VARCHAR(255)`            | NOT NULL                         | Tên sản phẩm                                                         |
| `description`             | `TEXT`                    | NULL                             | Mô tả chi tiết (HTML/Markdown)                                       |
| `omnichannel_sync_status` | `JSONB`                   | Default `{}`                     | Trạng thái đồng bộ (VD: `{"tiktok": "success", "lazada": "failed"}`) |
| `status`                  | `VARCHAR(50)`             | NOT NULL, Default 'DRAFT'        | `DRAFT`, `ACTIVE`, `HIDDEN`                                          |

**Bảng `product_variants` (Biến thể sản phẩm)**
Quản lý SKU, giá bán và số lượng tồn kho theo từng phân loại (VD: Áo màu Đỏ, size M).

| Tên Cột          | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                            |
| :--------------- | :------------------------ | :------------------------------- | :----------------------------------------------- |
| `id`             | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                       |
| `product_id`     | `UUID`                    | FK (products.id), NOT NULL       | Thuộc sản phẩm gốc nào                           |
| `sku`            | `VARCHAR(100)`            | UNIQUE, NOT NULL                 | Mã vạch/Mã định danh duy nhất                    |
| `attributes`     | `JSONB`                   | NOT NULL                         | Thuộc tính (VD: `{"color": "Red", "size": "M"}`) |
| `price`          | `DECIMAL(12,2)`           | NOT NULL                         | Giá bán hiện tại                                 |
| `stock_quantity` | `INT`                     | NOT NULL, Default 0              | Số lượng tồn kho                                 |

**Bảng `inventory_logs` (Lịch sử kho)**
Lưu vết mọi thay đổi của kho hàng để đối soát.

| Tên Cột            | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                              |
| :----------------- | :------------------------ | :------------------------------- | :------------------------------------------------- |
| `id`               | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                         |
| `variant_id`       | `UUID`                    | FK (product_variants.id)         | Biến thể nào bị thay đổi tồn kho                   |
| `type`             | `VARCHAR(50)`             | NOT NULL                         | `IMPORT`, `EXPORT`, `RETURN`, `ORDER_DEDUCT`       |
| `quantity_changed` | `INT`                     | NOT NULL                         | Số lượng (+ là nhập, - là xuất)                    |
| `note`             | `TEXT`                    | NULL                             | Lý do (VD: "Bán đơn hàng #123", "Kiểm kê định kỳ") |
| `created_at`       | `TIMESTAMPTZ`             | Default `NOW()`                  | Thời gian phát sinh                                |

---

### 3. Module Đơn hàng

**Bảng `orders` (Đơn hàng)**

| Tên Cột           | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                                        |
| :---------------- | :------------------------ | :------------------------------- | :----------------------------------------------------------- |
| `id`              | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                                   |
| `user_id`         | `UUID`                    | FK (users.id), NOT NULL          | Khách hàng mua                                               |
| `shop_id`         | `UUID`                    | FK (shops.id), NOT NULL          | Cửa hàng bán                                                 |
| `total_amount`    | `DECIMAL(12,2)`           | NOT NULL                         | Tổng tiền hàng (trước giảm giá)                              |
| `discount_amount` | `DECIMAL(12,2)`           | Default 0                        | Tổng tiền giảm qua voucher                                   |
| `shipping_fee`    | `DECIMAL(12,2)`           | Default 0                        | Phí vận chuyển                                               |
| `final_amount`    | `DECIMAL(12,2)`           | NOT NULL                         | Số tiền khách phải trả cuối cùng                             |
| `status`          | `VARCHAR(50)`             | NOT NULL                         | `PENDING`, `CONFIRMED`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| `created_at`      | `TIMESTAMPTZ`             | Default `NOW()`                  | Ngày đặt hàng                                                |

**Bảng `order_items` (Chi tiết đơn hàng)**

| Tên Cột             | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                         |
| :------------------ | :------------------------ | :------------------------------- | :-------------------------------------------- |
| `id`                | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                                    |
| `order_id`          | `UUID`                    | FK (orders.id), NOT NULL         | Thuộc đơn hàng nào                            |
| `variant_id`        | `UUID`                    | FK (product_variants.id)         | Mua biến thể sản phẩm nào                     |
| `quantity`          | `INT`                     | NOT NULL                         | Số lượng mua                                  |
| `price_at_purchase` | `DECIMAL(12,2)`           | NOT NULL                         | Giá _ngay tại thời điểm khách mua_ (Snapshot) |

---

### 4. Module Thanh toán & Đối soát

**Bảng `payments` (Thanh toán)**

| Tên Cột           | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                                   |
| :---------------- | :------------------------ | :------------------------------- | :-------------------------------------- |
| `id`              | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                              |
| `order_id`        | `UUID`                    | FK (orders.id), NOT NULL         | Thanh toán cho đơn nào                  |
| `amount`          | `DECIMAL(12,2)`           | NOT NULL                         | Số tiền thanh toán                      |
| `payment_method`  | `VARCHAR(50)`             | NOT NULL                         | `COD`, `VNPAY`, `ZALOPAY`               |
| `transaction_ref` | `VARCHAR(255)`            | NULL                             | Mã giao dịch từ đối tác cổng thanh toán |
| `status`          | `VARCHAR(50)`             | NOT NULL                         | `PENDING`, `SUCCESS`, `FAILED`          |

**Bảng `shop_reconciliations` (Đối soát tài chính)**

| Tên Cột        | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                              |
| :------------- | :------------------------ | :------------------------------- | :--------------------------------- |
| `id`           | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                         |
| `shop_id`      | `UUID`                    | FK (shops.id), NOT NULL          | Cửa hàng nhận đối soát             |
| `period_start` | `TIMESTAMPTZ`             | NOT NULL                         | Ngày bắt đầu kỳ đối soát           |
| `period_end`   | `TIMESTAMPTZ`             | NOT NULL                         | Ngày kết thúc kỳ đối soát          |
| `total_sales`  | `DECIMAL(12,2)`           | NOT NULL                         | Tổng doanh thu đơn hàng hoàn thành |
| `platform_fee` | `DECIMAL(12,2)`           | NOT NULL                         | Phí hoa hồng sàn thu lại           |
| `net_payout`   | `DECIMAL(12,2)`           | NOT NULL                         | Số tiền thực nhận chuyển cho Shop  |
| `status`       | `VARCHAR(50)`             | NOT NULL                         | `PENDING`, `PAID`                  |

---

### 5. Module Khuyến mãi & CSKH

**Bảng `vouchers` (Mã giảm giá)**

| Tên Cột           | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                               |
| :---------------- | :------------------------ | :------------------------------- | :---------------------------------- |
| `id`              | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính                          |
| `shop_id`         | `UUID`                    | FK (shops.id), NULL              | NULL nếu là voucher do hệ thống tạo |
| `code`            | `VARCHAR(50)`             | UNIQUE, NOT NULL                 | Mã nhập (VD: GIAM10K)               |
| `discount_type`   | `VARCHAR(50)`             | NOT NULL                         | `PERCENT` (%), `FIXED_AMOUNT` (VNĐ) |
| `discount_value`  | `DECIMAL(12,2)`           | NOT NULL                         | Mức giảm                            |
| `min_order_value` | `DECIMAL(12,2)`           | Default 0                        | Giá trị đơn tối thiểu để áp dụng    |
| `usage_limit`     | `INT`                     | NOT NULL                         | Tổng số lượt sử dụng tối đa         |
| `used_count`      | `INT`                     | Default 0                        | Số lượt đã dùng                     |

**Bảng `reviews` (Đánh giá)**

| Tên Cột           | Kiểu Dữ Liệu (PostgreSQL) | Ràng Buộc                        | Mô Tả                  |
| :---------------- | :------------------------ | :------------------------------- | :--------------------- |
| `id`              | `UUID`                    | PK, Default `uuid_generate_v4()` | Khóa chính             |
| `product_id`      | `UUID`                    | FK (products.id), NOT NULL       | Đánh giá sản phẩm nào  |
| `user_id`         | `UUID`                    | FK (users.id), NOT NULL          | Ai đánh giá            |
| `rating`          | `INT`                     | CHECK (rating 1-5)               | Số sao (1 đến 5)       |
| `comment`         | `TEXT`                    | NULL                             | Nội dung nhận xét      |
| `reply_from_shop` | `TEXT`                    | NULL                             | Phản hồi của người bán |
