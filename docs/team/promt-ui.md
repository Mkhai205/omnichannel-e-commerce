# 🎨 HƯỚNG DẪN DÙNG AI ĐỂ CODE UI THEO DESIGN MẪU

_(Dành cho Frontend Operators)_

**Mục tiêu:** Nhìn bản thiết kế, dùng AI sinh ra chính xác code giao diện Next.js, sử dụng đúng thư viện TailwindCSS và `shadcn/ui` của dự án mà không làm vỡ layout.

## BƯỚC 1: NGUYÊN TẮC "CẮT LỚP" DESIGN (Chia để trị)

Sai lầm lớn nhất khi dùng AI là quăng nguyên một trang web phức tạp và bảo: _"Code cho tao trang này"_. AI sẽ sinh ra một mớ code rác, thiếu logic và không thể bảo trì.

**Cách làm đúng:** Mở bản thiết kế ra và chia nó thành các khối nhỏ (Components).

1. Làm cái **Header** (Thanh điều hướng) trước.
2. Làm cái **Sidebar** (Menu bên trái).
3. Làm từng cái **Card** (Thẻ hiển thị sản phẩm/số liệu).
4. Cuối cùng, tạo một file **Page** (Trang chính) để ghép các cục kia lại với nhau.

---

## BƯỚC 2: SỬ DỤNG AI VISION (Tính năng nhìn ảnh)

Nếu bạn dùng ChatGPT Plus, Claude 3.5 Sonnet, hoặc Cursor IDE, hãy tận dụng tính năng đính kèm hình ảnh. Cắt (Snipping tool) đúng cái phần giao diện bạn muốn code và đính kèm vào khung chat kèm theo "Câu Thần Chú" dưới đây.

**Mẫu Prompt số 1 (Dành cho Component nhỏ - Có đính kèm ảnh):**

> "Đóng vai là Chuyên gia Frontend Next.js. Hãy nhìn vào bức ảnh thiết kế tôi đính kèm và code một Functional Component tên là `[Tên Component, vd: StatCard]`.
>
> **Yêu cầu kỹ thuật:**
>
> - Sử dụng TailwindCSS để căn chỉnh (Flexbox/Grid), màu sắc, khoảng cách sao cho giống ảnh nhất có thể.
> - Tuyệt đối KHÔNG viết CSS thuần, chỉ dùng class của Tailwind.
>
> **Dữ liệu hiển thị (Props):**
>
> - Giao diện này không gọi API. Hãy định nghĩa một `interface` cho Props để truyền dữ liệu từ ngoài vào (vd: tiêu đề, con số, icon).
> - Cung cấp sẵn một biến `mockData` chứa dữ liệu giả để tôi test giao diện luôn.
>
> **Ràng buộc Thư viện UI (BẮT BUỘC):**
>
> - Chúng ta đang dùng `shadcn/ui` tại thư mục `@repo/ui`.
> - Nếu trong ảnh có Nút bấm, Ô input, hay Thẻ (Card), hãy import chúng từ thư viện chung. (Ví dụ: `import { Card, CardContent } from '@repo/ui'`). Không tự code thẻ `<button>` hay `<div>` bo góc thô."

---

## BƯỚC 3: DỰNG CÁC LAYOUT PHỨC TẠP (Không có ảnh)

Khi bạn cần dựng một trang lớn như Bảng danh sách đơn hàng hoặc Form nhập liệu phức tạp, bạn cần mô tả chi tiết bằng chữ cho AI.

**Mẫu Prompt số 2 (Dành cho Layout/Page):**

> "Tôi cần dựng một trang giao diện tên là `[Tên trang, vd: Seller Dashboard]`. Trang này chỉ chứa giao diện tĩnh (Dumb Component), không chứa logic fetch data.
>
> **Cấu trúc Layout (Dùng Tailwind):**
>
> - Chia màn hình làm 2 cột. Cột trái (Sidebar) chiếm 20% width, cố định (fixed). Cột phải (Nội dung) chiếm 80% width, có thể cuộn.
> - Nền cột trái màu xám nhạt (`bg-slate-50`), nền cột phải màu trắng.
>
> **Thành phần bên trong:**
>
> - Góc trên cùng cột phải là một thanh Header có ô Input tìm kiếm và Avatar người dùng.
> - Bên dưới Header là một lưới Grid hiển thị 4 cái Thẻ thống kê (Dùng Component `StatCard` tôi đã có sẵn).
> - Dưới cùng là một Table hiển thị 5 đơn hàng mới nhất.
>
> **Hành động:**
> Viết code cho trang này. Nhớ sử dụng các component của `shadcn/ui` (Input, Table, Avatar) import từ `@repo/ui`."

---

## BƯỚC 4: QUY TRÌNH "NẮN" AI KHI CODE BỊ LỖI

AI rất hay code lệch thiết kế (chữ to quá, màu sai, căn lề méo). Khi đó, **tuyệt đối không tự mò mẫm đổi class Tailwind nếu bạn không rành.** Hãy làm theo 3 bước:

1. **Nếu code chạy lên bị lỗi báo đỏ ở Terminal:** Copy toàn bộ dòng báo lỗi đó dán lại cho AI và bảo: _"Code bị lỗi này, giải thích tại sao và đưa ra code đã sửa."_
2. **Nếu code chạy được nhưng nhìn xấu/không giống thiết kế:** Chụp ảnh màn hình cái giao diện bị lỗi đó, gửi lại cho AI và bảo: _"Phần tiêu đề đang bị dính sát vào cái ảnh quá, hãy thêm khoảng trống (padding/margin). Và đổi nút bấm thành màu đỏ chủ đạo (`bg-primary`)."_
3. **Nếu AI "bịa" ra component không tồn tại:** Nhắc nhở nó: _"Trong `@repo/ui` của tôi không có component `DatePicker`, hãy dùng thẻ `<input type="date">` của Tailwind thay thế, hoặc hướng dẫn tôi bảo Tech Lead cài thêm."_

---

## ⛔ 3 ĐIỀU CẤM KỴ DÀNH CHO FRONTEND TEAM

1. **CẤM viết logic gọi API:** Không dùng `axios`, `fetch`, `useEffect`, `useState` rắc rối. Nhiệm vụ của các bạn là làm giao diện đẹp. Việc đổ dữ liệu thật (API) cứ để trống hoặc dùng Mock Data, Tech Lead (Khaidz) sẽ lo phần đó.
2. **CẤM tự thêm thư viện:** Không dùng lệnh `npm install` hay `pnpm add` bất cứ gói nào (như slider, chart) nếu chưa được Tech Lead duyệt.
3. **CẤM tự nghĩ ra mã màu bừa bãi:** Tuân thủ mã màu trong thiết kế. Sử dụng các class biến màu đã được Tech Lead cài sẵn (vd: `text-primary`, `bg-seller-500`).
