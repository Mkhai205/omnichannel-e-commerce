# Omnichannel E-commerce Monorepo

Monorepo for a multi-vendor omnichannel e-commerce platform using Turborepo and pnpm workspaces.

## Tech Stack

- TypeScript (strict mode)
- Turborepo + pnpm workspaces
- NestJS API
- Next.js apps (`web`, `admin`, `seller`)
- PostgreSQL + Prisma
- MinIO object storage

## Workspace Structure

- `apps/api`: Backend API (NestJS)
- `apps/web`: Customer storefront
- `apps/admin`: Admin portal
- `apps/seller`: Seller center
- `packages/database`: Prisma schema/client
- `packages/shared-types`: Shared contracts/types
- `packages/ui`: Shared UI components

## Prerequisites

- Node.js >= 18
- pnpm 9
- Docker (optional, for local infra)

## Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Create environment file

```bash
# Git Bash
cp .env.example .env

# PowerShell
Copy-Item .env.example .env
```

3. Start local infrastructure (Postgres + MinIO)

```bash
docker compose up -d
```

4. Run all services in dev mode

```bash
pnpm dev
```

## Root Scripts

### Build / Validate

- `pnpm build`: Run build for all packages/apps
- `pnpm build:affected`: Build only changed graph
- `pnpm lint`: Run lint in all workspaces
- `pnpm lint:affected`: Lint only changed graph
- `pnpm check-types`: Run typecheck in all workspaces
- `pnpm check-types:affected`: Typecheck only changed graph
- `pnpm test`: Run tests across workspaces

### Dev

- `pnpm dev`: Start all dev tasks
- `pnpm dev:api`: Start API only
- `pnpm dev:web`: Start web app only
- `pnpm dev:admin`: Start admin app only
- `pnpm dev:seller`: Start seller app only

### Formatting

- `pnpm format`: Format `ts`, `tsx`, `md` files with Prettier

## Default Dev Ports

- API: `8000` (`apps/api`)
- Web: `3000` (`apps/web`)
- Admin: `3001` (`apps/admin`)
- Seller: `3002` (`apps/seller`)
- Postgres: `5432`
- MinIO API: `9000`
- MinIO Console: `9001`

## Notes

- Keep root scripts as Turbo delegations (`turbo run ...`).
- Define task implementations in each workspace package.
