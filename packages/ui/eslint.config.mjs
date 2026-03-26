import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
    ...config,
    {
        files: ["scripts/**/*.mjs"],
        languageOptions: {
            globals: {
                process: "readonly",
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "react/prop-types": "off",
        },
    },
];
