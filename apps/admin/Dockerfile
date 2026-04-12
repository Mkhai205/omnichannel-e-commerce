FROM node:20-alpine AS builder

WORKDIR /workspace

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json

RUN pnpm install --frozen-lockfile

COPY apps/admin ./apps/admin
COPY packages/shared-types ./packages/shared-types
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE_PATH=/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_BASE_PATH=${NEXT_PUBLIC_API_BASE_PATH}

RUN test -n "$NEXT_PUBLIC_API_URL"
RUN pnpm --filter ./packages/shared-types build
RUN pnpm --filter ./apps/admin build
RUN pnpm --filter ./apps/admin deploy --prod ./deploy/admin

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /workspace/apps/admin/.next ./.next
COPY --from=builder /workspace/apps/admin/public ./public
COPY --from=builder /workspace/apps/admin/package.json ./package.json
COPY --from=builder /workspace/deploy/admin/node_modules ./node_modules

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-p", "3000"]
