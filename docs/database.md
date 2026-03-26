### 1. Quản lý Người dùng & Cửa hàng (Users & Shops)

| Tên Bảng          | Các Trường Chính (Columns)                                                                                          | Mô tả Nghiệp vụ                                                  |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------- |
| **`users`**       | `id` (PK), `email`, `password_hash`, `full_name`, `phone`, `role` (CUSTOMER, SELLER, ADMIN), `status`, `created_at` | Quản lý tài khoản chung cho mọi đối tượng trên nền tảng.         |
| **`shops`**       | `id` (PK), `user_id` (FK), `shop_name`, `description`, `address`, `business_license`, `status`, `created_at`        | Thông tin chi tiết về gian hàng của người bán.                   |
| **`permissions`** | `id` (PK), `role_id` (FK), `permission_name`, `module`                                                              | Phân quyền chi tiết (RBAC) cho Admin và nhân sự nội bộ của shop. |

---

### 2. Quản lý Sản phẩm & Kho hàng (Catalog & Inventory)

| Tên Bảng               | Các Trường Chính (Columns)                                                                                        | Mô tả Nghiệp vụ                                                        |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **`categories`**       | `id` (PK), `parent_id` (FK), `name`, `slug`                                                                       | Phân loại danh mục sản phẩm (hỗ trợ cấu trúc cây đệ quy).              |
| **`products`**         | `id` (PK), `shop_id` (FK), `category_id` (FK), `name`, `description`, `omnichannel_sync_status` (JSONB), `status` | Thông tin cốt lõi của sản phẩm và trạng thái đồng bộ đa kênh.          |
| **`product_variants`** | `id` (PK), `product_id` (FK), `sku`, `price`, `stock_quantity`                                                    | Các biến thể của sản phẩm (VD: Size M, Màu Đỏ) để tính giá và tồn kho. |
| **`inventory_logs`**   | `id` (PK), `shop_id` (FK), `variant_id` (FK), `type` (IMPORT, EXPORT, CHECK, RETURN), `quantity_changed`, `note`  | Lưu vết toàn bộ lịch sử biến động kho (nhập, xuất, kiểm kê).           |

---

### 3. Giỏ hàng & Đơn hàng (Cart & Orders)

| Tên Bảng          | Các Trường Chính (Columns)                                                                                             | Mô tả Nghiệp vụ                                                         |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **`carts`**       | `id` (PK), `user_id` (FK), `created_at`, `updated_at`                                                                  | Quản lý phiên giỏ hàng của người dùng.                                  |
| **`cart_items`**  | `id` (PK), `cart_id` (FK), `variant_id` (FK), `quantity`                                                               | Danh sách sản phẩm tạm thời trong giỏ hàng.                             |
| **`orders`**      | `id` (PK), `user_id` (FK), `shop_id` (FK), `total_amount`, `discount_amount`, `shipping_fee`, `final_amount`, `status` | Đơn hàng gốc, được tách riêng theo từng `shop_id` khi khách thanh toán. |
| **`order_items`** | `id` (PK), `order_id` (FK), `variant_id` (FK), `price_at_purchase`, `quantity`                                         | Lưu lại giá và số lượng chính xác tại thời điểm khách đặt mua.          |

---

### 4. Vận chuyển (Shipping)

| Tên Bảng        | Các Trường Chính (Columns)                                                                                                   | Mô tả Nghiệp vụ                                                 |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **`shipments`** | `id` (PK), `order_id` (FK), `provider_code` (VD: GHTK, GHN), `tracking_number`, `shipping_status`, `estimated_delivery_date` | Theo dõi hành trình đơn hàng qua các đối tác vận chuyển thứ ba. |

---

### 5. Thanh toán & Đối soát tài chính (Payments & Reconciliations)

| Tên Bảng                   | Các Trường Chính (Columns)                                                                                              | Mô tả Nghiệp vụ                                                              |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **`payments`**             | `id` (PK), `order_id` (FK), `amount`, `payment_method` (VNPAY, ZALOPAY, COD), `transaction_ref`, `status`               | Ghi nhận trạng thái giao dịch từ các cổng thanh toán.                        |
| **`shop_reconciliations`** | `id` (PK), `shop_id` (FK), `period_start`, `period_end`, `total_sales`, `platform_fee_deducted`, `net_payout`, `status` | Bảng đối soát: tính toán doanh thu, trừ phí sàn và thanh toán cho người bán. |

---

### 6. Marketing & Khuyến mãi (Marketing & Promotions)

| Tên Bảng               | Các Trường Chính (Columns)                                                                                                                                 | Mô tả Nghiệp vụ                                                        |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **`vouchers`**         | `id` (PK), `shop_id` (FK - Null nếu là voucher sàn), `code`, `discount_type`, `discount_value`, `min_order_value`, `start_time`, `end_time`, `usage_limit` | Quản lý mã giảm giá do hệ thống hoặc do từng người bán tự tạo.         |
| **`flash_sales`**      | `id` (PK), `shop_id` (FK), `start_time`, `end_time`, `status`                                                                                              | Quản lý các khung giờ diễn ra chương trình Flash Sale.                 |
| **`flash_sale_items`** | `id` (PK), `flash_sale_id` (FK), `product_id` (FK), `promotional_price`, `quantity_limit`                                                                  | Sản phẩm cụ thể tham gia Flash Sale cùng mức giá và giới hạn số lượng. |

---

### 7. Tương tác & CSKH (Interactions & Customer Care)

| Tên Bảng         | Các Trường Chính (Columns)                                                                               | Mô tả Nghiệp vụ                                            |
| :--------------- | :------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **`reviews`**    | `id` (PK), `product_id` (FK), `order_id` (FK), `user_id` (FK), `rating`, `comment`, `reply_from_shop`    | Lưu trữ đánh giá sản phẩm và phản hồi từ phía cửa hàng.    |
| **`complaints`** | `id` (PK), `order_id` (FK), `user_id` (FK), `reason`, `evidence_images` (Mảng URL từ MinIO/S3), `status` | Tiếp nhận và xử lý khiếu nại, yêu cầu hoàn hàng/hoàn tiền. |
