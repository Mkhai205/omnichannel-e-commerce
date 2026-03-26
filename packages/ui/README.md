# @repo/ui

Shared UI package for apps/web, apps/seller, and apps/admin.

## Purpose

- Central place for reusable shadcn UI components.
- Shared design tokens in src/styles/tokens.css.
- Shared utility helpers like cn.

## Consumer Setup (Web, Seller, Admin)

1. Add dependency in each app package.json:

```json
{
    "dependencies": {
        "@repo/ui": "workspace:*"
    }
}
```

2. Ensure each Next app transpiles the workspace package:

```ts
const nextConfig = {
    transpilePackages: ["@repo/ui"],
};
```

3. Import shared tokens in app globals.css:

```css
@import "tailwindcss";
@import "@repo/ui/styles.css";
```

4. Apply app-specific token overrides when needed:

```css
:root {
    --primary: #1d4ed8;
}
```

## Standard Flow To Add Components (CLI)

Always add reusable components into packages/ui via shadcn CLI.

From repository root:

```bash
pnpm --filter @repo/ui add:ui button
pnpm --filter @repo/ui add:ui dialog dropdown-menu
```

`add:ui` now runs two steps automatically:

1. Run shadcn CLI add in packages/ui.
2. Rebuild explicit exports in src/index.ts.

Equivalent direct command:

```bash
pnpm dlx shadcn@latest add button --cwd packages/ui --yes
```

## Team Rules

- Source of truth for generated components is src/components/ui.
- Re-export components through src/index.ts only (auto-synced by script).
- Keep internal imports in exported UI source monorepo-safe.
- Do not generate reusable components directly inside app folders.
