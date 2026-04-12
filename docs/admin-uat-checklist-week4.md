# Admin UAT Checklist - Week 4 Hardening

## 1. Access Control

- [ ] Login with ADMIN account can access routes: /dashboard, /users, /shops, /products, /orders, /payments.
- [ ] Non-ADMIN account is blocked from admin routes by frontend middleware and backend role guard.
- [ ] Unauthenticated user is redirected to login for admin routes.

## 2. Sensitive Action Audit Logs

Check API logs for [ADMIN_AUDIT] entries after each action:

- [ ] Update user status (ACTIVE/BANNED).
- [ ] Update user role (CUSTOMER/SELLER/ADMIN).
- [ ] Update shop status (APPROVED/REJECTED + reason).
- [ ] Update product status (DRAFT/ACTIVE/HIDDEN).

Expected log format contains actor, target, and old/new values.

## 3. Week 3 Finance APIs

### Admin Payments

- [ ] GET /api/v1/admin/payments returns paginated data.
- [ ] Filters work: search, status, provider, createdFrom, createdTo.
- [ ] Invalid date range returns 400 with clear error message.

### Admin Settlements

- [ ] GET /api/v1/admin/settlements returns paginated data.
- [ ] Filters work: search, status, settledFrom, settledTo.
- [ ] Invalid date range returns 400 with clear error message.

### Dashboard KPI

- [ ] GET /api/v1/admin/dashboard/kpi returns users/shops/orders/GMV/payment success rate.
- [ ] Trend array returns 7 points in ascending day order.

## 4. Admin Frontend Validation

### Dashboard

- [ ] KPI cards render real values from API.
- [ ] GMV trend chart renders 7 bars without UI overflow on desktop/mobile.
- [ ] Finance alerts display pending payments and pending settlements.

### Payments Page

- [ ] Payments tab renders list + filters + pagination.
- [ ] Settlements tab renders list + filters + pagination.
- [ ] API errors are shown as user-friendly banners.

## 5. Technical Gate

- [ ] pnpm --filter @repo/shared-types check-types
- [ ] pnpm --filter @repo/api check-types
- [ ] pnpm --filter @repo/admin check-types
- [ ] pnpm --filter @repo/api lint
- [ ] pnpm --filter @repo/admin lint

## 6. Go/No-Go

Release ready when all checkboxes above are completed and no high-severity regression is found in admin auth, order visibility, or payment status rendering.
