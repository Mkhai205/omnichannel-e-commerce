# Seed Data Guide

## Scope

Current seed implementation supports 2 modes:

- `full`: clean database then seed full core fixtures
- `catalog`: append category/product/variant data for load-testing without cleaning existing core fixtures

Core seed data includes:

- users
- shops
- categories
- products
- product variants
- inventory logs
- addresses
- carts
- cart items
- orders
- order items

Product catalog behavior:

- 6 fixed baseline products (used by carts/orders fixtures) in `full` mode
- generated products for each seeded category (configurable)
- configurable variant range per generated product
- Home-aligned category coverage (fashion, shoes, beauty, electronics, kitchen/home, pets, sports, toys, books, vouchers...)

It intentionally does **not** seed payment/webhook/finance settlement records in this phase.

## File Structure

Seed logic is split by responsibility under [packages/database/src/seed](packages/database/src/seed):

- [packages/database/src/seed/core.ts](packages/database/src/seed/core.ts): orchestrates seeding flow
- [packages/database/src/seed/cleanup.ts](packages/database/src/seed/cleanup.ts): clean phase
- [packages/database/src/seed/modules](packages/database/src/seed/modules): domain modules
- [packages/database/src/seed/utils.ts](packages/database/src/seed/utils.ts): money/slug/helpers
- [packages/database/src/seed/constants.ts](packages/database/src/seed/constants.ts): deterministic IDs and seed constants

## Commands

From repository root:

```bash
pnpm db:seed
pnpm db:seed:catalog
pnpm db:seed:catalog:heavy
```

Directly in database package:

```bash
pnpm --filter @repo/database db:seed
pnpm --filter @repo/database db:seed:catalog
pnpm --filter @repo/database db:seed:catalog:heavy
```

CLI options (available for both root and package-level command):

```bash
pnpm --filter @repo/database db:seed -- --mode catalog --products-per-category 80 --variants-min 2 --variants-max 4 --active-ratio 0.9 --seed-value 20270001
```

- `--mode`: `full` (default) or `catalog`
- `--seed-value`: deterministic faker seed value
- `--products-per-category`: generated products per category
- `--variants-min`: min variants per generated product
- `--variants-max`: max variants per generated product
- `--active-ratio`: active product ratio in range `0..1`

## Safety Guard

The local-only guard exists and can be enabled in the seed entrypoint.

When enabled, seed stops if `DATABASE_URL` host is not one of:

- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- `postgres`
- `db`
- `host.docker.internal`

This prevents accidental writes to non-local databases.

## Deterministic Fake Data

Seed uses `@faker-js/faker` with a deterministic seed value.

- Default seed value: `20260401`
- Override via env: `SEED_RANDOM_SEED=<number>`
- Override via CLI: `--seed-value <number>`

Example:

```bash
SEED_RANDOM_SEED=20270001 pnpm db:seed
```

## Data Reset Strategy

- `full` mode uses **Clean Then Seed**:

1. delete domain data in FK-safe order
2. insert seeded fixtures in dependency order

- `catalog` mode uses **Append Seed**:

1. upsert categories by slug
2. append generated products and variants with unique SKU pattern

Use `catalog` mode when you need larger product volume quickly without resetting users/orders/carts.

## Notes

- Demo account raw password is defined in [packages/database/src/seed/constants.ts](packages/database/src/seed/constants.ts) and bcrypt hash is generated at seed runtime.
- Order money fields are calculated via cents-based helpers to keep decimal precision stable.
- Category seeding is idempotent (upsert by slug), safe for repeated catalog append runs.
