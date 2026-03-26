import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const componentsDir = path.join(packageRoot, "src", "components", "ui");
const indexFilePath = path.join(packageRoot, "src", "index.ts");

function hasExportModifier(node) {
    return Boolean(
        node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
    );
}

function collectNamedExports(filePath) {
    const sourceText = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    const exportNames = new Set();

    for (const statement of sourceFile.statements) {
        if (ts.isExportDeclaration(statement)) {
            if (
                statement.exportClause &&
                ts.isNamedExports(statement.exportClause) &&
                !statement.moduleSpecifier
            ) {
                for (const specifier of statement.exportClause.elements) {
                    exportNames.add(specifier.name.getText(sourceFile));
                }
            }
            continue;
        }

        if (!hasExportModifier(statement)) {
            continue;
        }

        if (
            (ts.isFunctionDeclaration(statement) ||
                ts.isClassDeclaration(statement) ||
                ts.isInterfaceDeclaration(statement) ||
                ts.isTypeAliasDeclaration(statement)) &&
            statement.name
        ) {
            exportNames.add(statement.name.getText(sourceFile));
            continue;
        }

        if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                if (ts.isIdentifier(declaration.name)) {
                    exportNames.add(declaration.name.getText(sourceFile));
                }
            }
        }
    }

    return [...exportNames];
}

export function syncExports() {
    const componentFiles = fs
        .readdirSync(componentsDir)
        .filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".tsx"))
        .sort((a, b) => a.localeCompare(b));

    const blocks = ['export { cn } from "./lib/utils";', ""];

    for (const fileName of componentFiles) {
        const absoluteFilePath = path.join(componentsDir, fileName);
        const exportNames = collectNamedExports(absoluteFilePath);

        if (exportNames.length === 0) {
            continue;
        }

        const relativeModulePath = `./components/ui/${fileName.replace(/\.[^.]+$/, "")}`;

        blocks.push("export {");
        for (const name of exportNames) {
            blocks.push(`    ${name},`);
        }
        blocks.push(`} from "${relativeModulePath}";`);
        blocks.push("");
    }

    fs.writeFileSync(indexFilePath, `${blocks.join("\n").trimEnd()}\n`, "utf8");
    console.log(`Synced explicit exports to ${path.relative(packageRoot, indexFilePath)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    syncExports();
}
