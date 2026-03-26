import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncExports } from "./sync-exports.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const uiComponentsDir = path.join(packageRoot, "src", "components", "ui");
const componentArgs = process.argv.slice(2);

function normalizeGeneratedImports() {
    const files = readdirSync(uiComponentsDir).filter((file) => file.endsWith(".tsx"));

    for (const file of files) {
        const filePath = path.join(uiComponentsDir, file);
        const original = readFileSync(filePath, "utf8");
        const next = original
            .replaceAll('from "@/lib/utils"', 'from "../../lib/utils"')
            .replaceAll("from '@/lib/utils'", "from '../../lib/utils'")
            .replaceAll('from "@/components/ui/', 'from "./')
            .replaceAll("from '@/components/ui/", "from './");

        if (next !== original) {
            writeFileSync(filePath, next, "utf8");
        }
    }
}

if (componentArgs.length === 0) {
    console.error("Usage: pnpm --filter @repo/ui add:ui <component...>");
    process.exit(1);
}

const result = spawnSync(
    "pnpm",
    ["dlx", "shadcn@latest", "add", "--cwd", ".", "--yes", ...componentArgs],
    {
        cwd: packageRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
    },
);

if (result.status !== 0) {
    process.exit(result.status ?? 1);
}

normalizeGeneratedImports();
syncExports();
