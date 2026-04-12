FROM node:20-alpine AS builder

WORKDIR /workspace

RUN npm install -g pnpm@9

# Copy workspace manifests first for better layer caching.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

# Copy source code after dependencies are installed.
COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types
COPY packages/database ./packages/database
COPY packages/typescript-config ./packages/typescript-config

# Build workspace packages in dependency order.
RUN pnpm --filter ./packages/shared-types build
RUN pnpm --filter ./packages/database build
RUN pnpm --filter ./apps/api build

# Create a deployable, production-only folder for the API package.
RUN pnpm --filter ./apps/api deploy --prod ./deploy/api


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/apps/api/dist ./dist
COPY --from=builder /workspace/deploy/api/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/main"]
