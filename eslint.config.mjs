import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // 指定 TypeScript 配置文件
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // 禁止使用 /* eslint-disable @typescript-eslint */ 注释
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Program > CommentBlock[value=/eslint-disable\\s+@typescript-eslint/]",
          message: "禁止使用 /* eslint-disable @typescript-eslint */ 注释。",
        },
      ],
      // 禁止使用 any 类型
      "@typescript-eslint/no-explicit-any": "off",
      // 禁止使用 unknown 类型
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
    },
  },
]);
