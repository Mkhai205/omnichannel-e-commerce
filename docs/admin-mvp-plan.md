# Ke hoach MVP Web Admin - Giam sat va Van hanh E-commerce

## 1. Muc tieu MVP

MVP Admin can dap ung 2 nhom nhu cau:

- Giam sat toan he thong: users, shops, products, orders, payments.
- Van hanh truc tiep: khoa/mo user, duyet shop, an/hien san pham.

Pham vi da chot:

- Users management (role/status)
- Shops moderation (approve/reject)
- Products moderation (active/hidden)
- Orders monitoring toan he thong
- Payments va doi soat co ban
- Dashboard KPI tong quan
- 1 vai tro noi bo duy nhat: ADMIN
- Timeline muc tieu: 3-4 tuan

## 2. Nguyen tac trien khai

- Tan dung toi da API admin da co san trong `apps/api` de ra MVP nhanh.
- Bo sung API con thieu cho orders/payments/dashboard thay vi lam lai toan bo.
- Giu dung boundary monorepo: frontend admin chi dung `@repo/shared-types`, khong dung Prisma/database truc tiep.
- Build theo tung module doc lap de co the release theo moc.

## 3. Hien trang ky thuat

### API da san sang cho Admin

- Users: `GET /admin/users`, `GET /admin/users/:id`, `PATCH /admin/users/:id/status`, `PATCH /admin/users/:id/role`
- Shops: `GET /admin/shops`, `GET /admin/shops/:id`, `PATCH /admin/shops/:id/status`
- Catalog: `GET /admin/catalog/products`, `PATCH /admin/catalog/products/:id/status`

### Phan con thieu can bo sung

- Chua co admin endpoints cho Orders toan he thong.
- Chua co admin endpoints cho Payments/Finance/Settlement toan he thong.
- Chua co endpoint tong hop KPI dashboard.
- `apps/admin` moi o muc scaffold, chua co auth guard, shell layout, service layer.

## 4. Lo trinh 3-4 tuan

## Tuan 1 - Nen tang Admin App + Ship nhanh module san co

Muc tieu:

- Dung khung app admin co bao ve truy cap ADMIN.
- Van hanh duoc 3 module da co API: Users, Shops, Products.

Viec can lam:

- Dung `admin shell` (sidebar + header + page frame) trong `apps/admin`.
- Them middleware/guard tren frontend de chan nguoi dung khong phai ADMIN.
- Tao HTTP client va service layer dung chung cho admin.
- Tao man hinh Users Management:
    - Danh sach + filter role/status
    - Doi role
    - Khoa/mo user
- Tao man hinh Shops Moderation:
    - Danh sach pending/approved/rejected
    - Approve/reject co ly do
- Tao man hinh Products Moderation:
    - Danh sach + filter trang thai
    - An/hien san pham

Deliverable cuoi tuan:

- Admin co the dang nhap, vao dashboard, thao tac Users/Shops/Products thanh cong.

## Tuan 2 - API Orders + Orders UI

Muc tieu:

- Co kha nang theo doi don hang toan he thong cho admin.

Viec can lam:

- Tao `AdminOrdersController` va service methods tuong ung.
- Endpoints toi thieu:
    - `GET /admin/orders` (pagination, filter by status/date/shop/customer)
    - `GET /admin/orders/:id` (chi tiet don)
- Mo rong shared types cho admin orders.
- Dung man hinh Orders trong admin app:
    - Bang danh sach
    - Bo filter
    - Trang chi tiet

Deliverable cuoi tuan:

- Admin xem va tra cuu don hang toan he thong theo bo loc co ban.

## Tuan 3 - API Payments/Finance + Dashboard KPI

Muc tieu:

- Giam sat giao dich va tinh hinh doi soat.
- Co dashboard KPI tong quan de van hanh.

Viec can lam:

- Tao admin endpoints cho payments/finance:
    - `GET /admin/payments`
    - `GET /admin/settlements`
- Tao endpoint KPI tong hop:
    - Tong users, shops, orders, GMV
    - Ti le thanh cong thanh toan
- Mo rong shared types cho payments va dashboard.
- Dung giao dien:
    - Payments/Settlement list + filter
    - Dashboard KPI cards + trend chart co ban

Deliverable cuoi tuan:

- Admin theo doi duoc doanh thu/giao dich/co ban doi soat va KPI he thong.

## Tuan 4 - Hardening va UAT

Muc tieu:

- On dinh, de van hanh that.

Viec can lam:

- Them audit log toi thieu cho thao tac nhay cam:
    - Doi role user
    - Khoa user
    - Duyet/reject shop
    - An/hien product
- Chuan hoa error messages va logging de de truy vet.
- Test nghiem thu theo kich ban van hanh.
- Tinh chinh UX (loading, empty state, permission state).

Deliverable cuoi tuan:

- Ban MVP san sang cho internal rollout.

## 5. Kien truc de xuat

### Frontend (`apps/admin`)

- Route group:
    - `/dashboard`
    - `/users`
    - `/shops`
    - `/products`
    - `/orders`
    - `/payments`
- Local UI ownership theo app-admin (shadcn trong chinh app).
- Service layer tach theo module:
    - `admin-users.service.ts`
    - `admin-shops.service.ts`
    - `admin-products.service.ts`
    - `admin-orders.service.ts`
    - `admin-payments.service.ts`

### Backend (`apps/api`)

- Tai su dung co che `@Roles('ADMIN')` + `RolesGuard`.
- Them controller/service moi cho orders va payments admin.
- Controller chi handle routing/validation, business logic dat trong service.

### Contracts (`packages/shared-types`)

- Bo sung contracts admin:
    - orders list/detail response
    - payments/settlement list response
    - dashboard summary response
- Frontend chi `import type` tu `@repo/shared-types`.

## 6. Tieu chi hoan thanh MVP (Definition of Done)

- Bao mat:
    - Tat ca route admin duoc bao ve, role khac ADMIN khong truy cap duoc.
- Chuc nang:
    - Users/Shops/Products thao tac duoc tren giao dien.
    - Orders/Payments xem duoc toan he thong va filter duoc.
    - Dashboard hien thi du KPI toi thieu.
- Ky thuat:
    - Type-check pass cho `@repo/shared-types`, `apps/api`, `apps/admin`.
    - Khong vi pham boundary import monorepo.
- Van hanh:
    - Co log toi thieu cho thao tac nhay cam.
    - UAT pass theo checklist nghiep vu admin.

## 7. Rui ro va giam thieu

- Rui ro: API orders/payments cho admin chua co, co the keo dai sprint.
    - Giam thieu: Ship theo phase, uu tien read + filter truoc, nang cao sau.
- Rui ro: Lech so lieu KPI voi bao cao giao dich.
    - Giam thieu: Chot cong thuc KPI va test doi soat voi du lieu raw truoc release.
- Rui ro: Admin app moi scaffold, cong viec frontend dau ky kha lon.
    - Giam thieu: Tai su dung pattern tu seller app (layout, middleware, http client).

## 8. Out of Scope cho MVP

- Tach nhieu vai tro noi bo (Ops, Finance, Support).
- Report nang cao va export phuc tap.
- He thong canh bao realtime day du.
- Audit trail day du cap doanh nghiep.
