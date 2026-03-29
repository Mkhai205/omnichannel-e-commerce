# Auth Flow (API)

Tài liệu này tóm tắt các luồng chính trong module auth theo code hiện tại:

1. Register
2. Verify Email
3. Login bằng Email + Password
4. Login bằng Google OAuth
5. Forgot Password
6. Reset Password

## 1) Register

Endpoint: `POST /auth/register`

Input:

- `email`
- `password`
- `fullName`
- `phone` (optional)
- `role` (optional, chỉ cho phép `CUSTOMER` hoặc `SELLER`)

Luồng xử lý:

1. Normalize email về lowercase.
2. Check email đã tồn tại chưa, nếu có trả lỗi `Email already exists`.
3. Hash password bằng bcrypt.
4. Tạo user local với trạng thái ban đầu: `UNVERIFIED`.
5. Cấp access token + refresh token.
6. Lưu hash refresh token vào DB để phục vụ revoke/rotation.
7. Gửi email verify (best-effort, nếu gửi lỗi thì chỉ log warning, không fail register).
8. Trả session data và set HTTP-only cookies access/refresh.

Kết quả:

- User đăng ký xong nhưng chưa verify email sẽ không login bằng email/password được.

## 2) Verify Email

Endpoint: `POST /auth/verify-email`

Input:

- `token` (JWT loại `email_verify`)

Luồng gửi email verify (ở bước register):

1. Phát hành token verify có `tokenType = email_verify`.
2. Build URL verify từ env `FRONTEND_VERIFY_EMAIL_REDIRECT` + query `token`.
3. Render template email verify từ mail infrastructure và gửi mail.

Luồng xác thực token:

1. Verify JWT bằng access secret.
2. Validate `tokenType` phải là `email_verify`.
3. Tìm user theo email + đối chiếu `sub` trong token.
4. Nếu user đã `ACTIVE` thì return success (idempotent).
5. Nếu chưa active thì update status từ `UNVERIFIED` sang `ACTIVE`.
6. Gửi welcome email (best-effort).

Kết quả:

- Tài khoản được kích hoạt để login bằng email/password.

## 3) Login bằng Email + Password

Endpoint: `POST /auth/login`

Input:

- `email`
- `password`

Luồng xử lý:

1. Tìm user theo email lowercase.
2. So khớp password bằng bcrypt.
3. Kiểm tra trạng thái user:
    - `UNVERIFIED` -> từ chối login (`Please verify your email before login`).
    - `BANNED` -> từ chối login.
4. Nếu hợp lệ, cấp access token + refresh token.
5. Lưu hash refresh token vào DB.
6. Set HTTP-only cookies và trả session data.

## 4) Login bằng Google OAuth

### 4.1 Bắt đầu OAuth

Endpoint: `GET /auth/google/login`

Luồng:

1. Backend sinh `state`.
2. Set cookie state (tên cookie lấy từ env auth cookie config).
3. Redirect sang Google authorize URL.

### 4.2 Callback từ Google

Endpoint: `GET /auth/google/callback?code=...&state=...`

Luồng:

1. Validate `state` query với cookie state.
2. Exchange authorization code để lấy thông tin user Google.
3. Tìm user theo `providerUserId`, nếu chưa có thì fallback theo email.
4. Nếu chưa có user thì tạo user Google mới (trạng thái `ACTIVE`).
5. Nếu đã có user nhưng chưa link OAuth account thì tạo liên kết OAuth.
6. Kiểm tra trạng thái user (`BANNED` thì reject).
7. Cấp access/refresh token, set auth cookies.
8. Redirect về frontend:
    - Success: `FRONTEND_LOGIN_SUCCESS_REDIRECT`
    - Failure: `FRONTEND_LOGIN_FAILURE_REDIRECT?message=...`

## 5) Forgot Password

Endpoint: `POST /auth/forgot-password`

Input:

- `email`

Luồng xử lý:

1. Tìm user theo email lowercase.
2. Nếu user không tồn tại hoặc không có password local thì return success ngay (không tiết lộ tồn tại tài khoản).
3. Nếu hợp lệ, phát hành token reset (`tokenType = password_reset`).
4. Build reset URL từ env `FRONTEND_RESET_PASSWORD_REDIRECT` + query `token`.
5. Render template reset password và gửi email (best-effort).
6. API luôn trả thông điệp generic: `If the email exists, a reset link has been sent`.

Kết quả:

- Đảm bảo không bị email enumeration.

## 6) Reset Password

Endpoint: `POST /auth/reset-password`

Input:

- `token`
- `newPassword`

Luồng xử lý:

1. Verify token reset bằng access secret.
2. Validate `tokenType` phải là `password_reset`.
3. Tìm user theo `sub` trong token.
4. Nếu user không hợp lệ thì trả `Invalid reset password token`.
5. Hash `newPassword` bằng bcrypt.
6. Update password hash mới.
7. Revoke toàn bộ refresh tokens đang active của user.

Kết quả:

- Password được đổi thành công.
- Tất cả phiên đăng nhập cũ bị logout ở lần refresh tiếp theo.

## Ghi chú thêm

- Template email dùng chung trong mail infrastructure (`welcome-email`, `verify-email`, `reset-password`).
- Auth cookies/access/refresh đều dùng HTTP-only cookie và tên cookie lấy từ env config.
- Refresh token flow (rotation) và logout flow vẫn hoạt động độc lập với các luồng trên.
