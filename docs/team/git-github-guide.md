# 🐙 HƯỚNG DẪN GIT & GITHUB WORKFLOW

_(Dành cho Team E-commerce)_

**Mục tiêu:** Lưu trữ code an toàn, không giẫm chân lên nhau, và đảm bảo nhánh chính (`main`) luôn trong trạng thái chạy được 100%.

## ⛔ QUY TẮC TỐI THƯỢNG (Lệnh cấm)

1. **Tuyệt đối KHÔNG code trực tiếp trên nhánh `main`.** Nhánh `main` là "vùng đất thiêng", chỉ chứa code đã hoàn chỉnh.
2. **Tuyệt đối KHÔNG tự ý bấm nút "Merge Pull Request".** Mọi đoạn code phải được đẩy lên để Tech Lead (Anh Khai) review và duyệt.
3. **Tuyệt đối KHÔNG dùng AI để tự động sửa lỗi "Merge Conflict" (Đụng code).** AI rất hay xóa nhầm code của người khác. Gặp lỗi đỏ lòm khi Push/Pull -> Dừng lại và gọi Tech Lead.

---

## 🏷 1. QUY TẮC ĐẶT TÊN NHÁNH (Branch Naming)

Để dễ quản lý, khi bắt đầu làm một giao diện mới, bạn phải tạo một nhánh mới theo cú pháp:
`[tên-app]/[tên-tính-năng]`

- **Ví dụ đúng:** \* `web/trang-chu`
    - `admin/bang-quan-ly-user`
    - `seller/form-tao-san-pham`
- **Ví dụ sai:** `nhanh-cua-em`, `update-code`, `test`

---

## 🔄 2. LUỒNG LÀM VIỆC HÀNG NGÀY (Daily Workflow)

Mỗi ngày bật máy lên làm việc, hãy gõ đúng thứ tự các lệnh sau (có thể dùng giao diện của VS Code/Cursor thay thế nếu đã quen):

### Bước 1: Lấy code mới nhất từ hệ thống về máy

_Luôn làm việc này trước khi bắt đầu code để không bị lỗi thời._

```bash
git checkout main
git pull origin main
```

### Bước 2: Tạo nhánh riêng để làm việc

Ví dụ hôm nay bạn làm Header cho trang Admin:

```bash
git checkout -b admin/header-ui
```

### Bước 3: Dùng AI code và Lưu lại (Commit)

Sau khi AI sinh code xong, giao diện lên hình đẹp, bạn cần "lưu game":

```bash
git add .
git commit -m "ui: hoàn thiện giao diện header trang admin"
```

_(Lưu ý: Thêm tiền tố `ui:` cho code giao diện, `fix:` nếu sửa lỗi)._

### Bước 4: Đẩy code lên GitHub

```bash
git push origin admin/header-ui
```

### Bước 5: Tạo Pull Request (PR)

1. Lên trang GitHub của dự án.
2. Bạn sẽ thấy nút xanh lá cây **"Compare & pull request"** hiện lên -> Bấm vào đó.
3. Ở ô nội dung, ghi rõ: _"Em đã làm xong giao diện Header, dùng component local từ `@/components/ui`."_
4. Gắn thẻ (Assign) Tech Lead vào để review.
5. Chuyển sang làm task khác (quay lại Bước 1) trong lúc chờ duyệt.

---

## ⚠️ 3. LUẬT "VÙNG CẤM" (Không sửa ngoài app đang làm)

Cấu trúc dự án hiện tại dùng `packages/shared-types` là dùng chung, còn UI thuộc quyền sở hữu của từng frontend app.

- Nếu bạn đang code `apps/web`, chỉ sửa UI trong phạm vi `apps/web/src/components/ui` và import bằng `@/components/ui`.
- Nếu thiếu component (ví dụ `DatePicker`), hãy thêm bằng shadcn CLI trong chính app đó, không chỉnh UI của app khác.
