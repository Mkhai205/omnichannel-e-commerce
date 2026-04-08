**Comprehensive Rules Doc For Figma MCP Integration (apps/web)**

Scope analyzed:

- Workspace and monorepo config: [package.json](package.json), [turbo.json](turbo.json), [pnpm-workspace.yaml](pnpm-workspace.yaml)
- Web app config and source: [apps/web/package.json](apps/web/package.json), [apps/web/components.json](apps/web/components.json), [apps/web/tsconfig.json](apps/web/tsconfig.json), [apps/web/src/app/globals.css](apps/web/src/app/globals.css), [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx), [apps/web/src/components/ui/index.ts](apps/web/src/components/ui/index.ts), and all ui primitives in [apps/web/src/components/ui](apps/web/src/components/ui)
- Figma MCP context for nodes 460:40690 and 460:40661 in file key i6Vgfs3FQyQZRxnoxjmewx

Code Connect status:

- I attempted to read existing Code Connect mappings for both nodes.
- Access is blocked by Figma plan limits (Developer seat required), so rules below assume no available Code Connect mapping.

---

### 1. Token Definitions

Current state:

- Core design tokens are CSS custom properties in [apps/web/src/app/globals.css](apps/web/src/app/globals.css#L3).
- Tokens are transformed into Tailwind v4 theme tokens through @theme inline in [apps/web/src/app/globals.css](apps/web/src/app/globals.css#L26).
- Radius scale is tokenized and derived from --radius.
- Dark mode currently overrides only background and foreground in [apps/web/src/app/globals.css](apps/web/src/app/globals.css#L54).
- Font tokens map to Geist variables from [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx#L5).

Key pattern:
:root {
--background: #ffffff;
--foreground: #171717;
--primary: #1d4ed8;
--radius: 0.625rem;
}

    @theme inline {
      --color-background: var(--background);
      --color-primary: var(--primary);
      --radius-md: calc(var(--radius) - 2px);
    }

Rules for Figma MCP integration:

- Never keep raw Figma hex values directly in component class strings for final code.
- Convert Figma token names and hex into semantic CSS variables in globals.css first, then consume via Tailwind token classes.
- For the provided Shopery screens, add a green brand token set (success, success-dark, gray scale ramp) before building UI.
- If you need Poppins for fidelity, introduce it at layout level and expose as CSS variable similar to Geist, then map through @theme inline.
- Keep token naming semantic (background, foreground, primary, muted, border, etc.), not screen-specific names.

---

### 2. Component Library

Current state:

- UI primitives are app-local in [apps/web/src/components/ui](apps/web/src/components/ui), consistent with app-owned shadcn approach.
- Composition uses:
- Radix primitives via radix-ui
- CVA for variants
- data-slot attributes for structural targeting
- Utility merge helper cn from [apps/web/src/lib/utils.ts](apps/web/src/lib/utils.ts)
- Barrel export exists in [apps/web/src/components/ui/index.ts](apps/web/src/components/ui/index.ts).

Key pattern:
const buttonVariants = cva("...", {
variants: {
variant: { default: "...", outline: "...", destructive: "..." },
size: { default: "...", sm: "...", icon: "..." }
},
defaultVariants: { variant: "default", size: "default" }
})

    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} />

Rules for Figma MCP integration:

- Reuse existing primitives first: Button, Input, Label, Dialog, Select, Card, Table, Textarea.
- Build Figma screen sections as feature components that compose primitives, not giant one-file JSX exports from MCP.
- Preserve data-slot usage in new primitives/complex components for consistency.
- Keep variant-driven APIs (CVA) for reusable controls instead of one-off className blobs.
- If MCP output suggests missing primitives (example: checkbox), add them as app-local ui components in apps/web before page assembly.

Storybook/docs status:

- No Storybook or component docs detected in apps/web.

---

### 3. Frameworks and Libraries

Current state:

- UI framework: Next.js App Router + React 19 in [apps/web/package.json](apps/web/package.json#L17).
- Styling: Tailwind CSS v4 + @tailwindcss/postcss in [apps/web/package.json](apps/web/package.json#L29) and [apps/web/postcss.config.mjs](apps/web/postcss.config.mjs).
- Component infra: radix-ui, class-variance-authority, clsx, tailwind-merge, lucide-react in [apps/web/package.json](apps/web/package.json#L13).
- Bundling/dev: Turbopack enabled for dev/build scripts in [apps/web/package.json](apps/web/package.json#L6).
- Monorepo orchestration: Turborepo tasks in [turbo.json](turbo.json#L6) and root scripts in [package.json](package.json#L5).

Key pattern:
"dev": "next dev --turbopack --port 3000",
"build": "next build --turbopack"

Rules for Figma MCP integration:

- MCP-generated React+Tailwind is structurally compatible, but must be adapted to App Router component boundaries.
- Prefer Server Components for page/section containers; use client components only when interactivity/hooks are required.
- Keep imports alias-based with @/..., never cross-workspace relative imports.

---

### 4. Asset Management

Current state:

- Static assets live in [apps/web/public](apps/web/public) (currently default svg files).
- Current page has no image usage yet in [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx).
- No explicit CDN/image optimization config in [apps/web/next.config.ts](apps/web/next.config.ts).

MCP-specific observation:

- Figma MCP design-context output returns temporary remote asset URLs (figma.com/api/mcp/asset/...) that expire.

Rules for Figma MCP integration:

- Do not ship temporary Figma asset URLs in production code.
- During implementation, download required assets and store them in apps/web/public (or your long-term media pipeline).
- For content images, prefer Next image optimization path when project starts using image-heavy pages.
- Keep stable, deterministic asset paths and naming by feature (example: public/auth/login/hero-bg.webp).

---

### 5. Icon System

Current state:

- Icon library is lucide in [apps/web/components.json](apps/web/components.json#L13).
- Icons are imported from lucide-react directly in primitives (example select/dialog/dropdown files in [apps/web/src/components/ui](apps/web/src/components/ui)).
- Naming convention follows PascalCase with Icon suffix (example XIcon, CheckIcon, ChevronDownIcon).

Key pattern:
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

Rules for Figma MCP integration:

- First choice: map Figma icons to lucide equivalents.
- If no lucide match exists, add local svg assets and wrap them in small icon components with consistent API (size, className, aria-hidden).
- Keep naming in PascalCase and end with Icon for consistency.

---

### 6. Styling Approach

Current state:

- Utility-first Tailwind classes directly in TSX.
- Global base layer and token bridge in [apps/web/src/app/globals.css](apps/web/src/app/globals.css#L69).
- Responsive behavior mainly via breakpoint utilities inside primitives (example sm: in dialog/button, md: in input/textarea).
- Uses semantic classes tied to tokens: bg-background, text-foreground, border-input, ring-ring, etc.

Key pattern:
@layer base { \* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
}

Rules for Figma MCP integration:

- Replace MCP absolute positioning with semantic layout primitives (container, grid, flex, gap) and responsive breakpoints.
- Favor token-backed semantic classes over hard-coded colors.
- Build responsive behavior from mobile-first breakpoints; do not keep fixed 1920px assumptions from MCP raw export.
- Keep motion and states aligned with existing transition/focus patterns in current primitives.

---

### 7. Project Structure

Current state:

- Monorepo split:
- apps: runnable apps (web/admin/seller/api)
- packages: shared libs (database, shared-types, eslint-config, typescript-config)
- apps/web is currently a scaffold with global style + layout + empty home page:
- [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx)
- [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)
- [apps/web/src/components/ui](apps/web/src/components/ui)

Rules for Figma MCP integration:

- Keep UI runtime components local to apps/web.
- Organize by feature section once you start implementing Figma screens:
- app route files in src/app
- reusable feature blocks in src/components
- shared primitives in src/components/ui
- shared utilities in src/lib
- For API contracts in frontend, only use shared types package imports (type-only imports) when needed.

---

## MCP Workflow Rules For The Two Provided Figma Nodes

Nodes:

- 460:40690 (Sign In)
- 460:40661 (Create Account)

Recommended implementation flow:

1. Pull design context from node.
2. Extract reusable structure only (Auth card shell, form rows, footer/newsletter, breadcrumb shell).
3. Normalize design tokens into globals.css.
4. Compose page from existing ui primitives.
5. Introduce missing primitives locally (if needed).
6. Convert fixed px-heavy layout to responsive Tailwind layout.
7. Replace temporary figma asset URLs with stable local assets.
8. Validate desktop and mobile parity against screenshots.

Do not do:

- Do not paste MCP raw absolute-positioned JSX directly into production pages.
- Do not keep temporary figma asset URLs.
- Do not bypass app-local ui primitives with ad-hoc duplicate control markup.

---

## Practical Starter Mapping (for these two screens)

- Auth card container: use Card + custom section wrapper.
- Form controls: Input + Label + Button.
- Password visibility icon: lucide icon button + client component state.
- Terms/remember checkbox: add a Checkbox primitive locally if absent.
- Footer/newsletter: build as reusable sections, not embedded in route page directly.
- Breadcrumb/header strip: separate reusable top-band component.

If you want, I can generate a ready-to-commit markdown file at docs/figma-mcp-rules-apps-web.md with this exact content, then scaffold the first real page implementation for the two provided nodes in apps/web.
