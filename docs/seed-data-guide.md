# Seed Data Guide

## Scope

Current seed implementation targets **Core domain data** only:

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

Product catalog is seeded with a larger dataset:

- 6 fixed baseline products (used by carts/orders fixtures)
- 30 additional generated products
- 2-3 variants per additional product

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
```

Directly in database package:

```bash
pnpm --filter @repo/database db:seed
```

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
- Override: `SEED_RANDOM_SEED=<number>`

Example:

```bash
SEED_RANDOM_SEED=20270001 pnpm db:seed
```

## Data Reset Strategy

The script uses **Clean Then Seed**:

1. delete domain data in FK-safe order
2. insert seeded fixtures in dependency order

Run this only when you accept replacing existing local data.

## Notes

- Demo account raw password is defined in [packages/database/src/seed/constants.ts](packages/database/src/seed/constants.ts) and bcrypt hash is generated at seed runtime.
- Order money fields are calculated via cents-based helpers to keep decimal precision stable.
