import { createConfigForNuxt } from "@nuxt/eslint-config/flat"
import configPrettier from "eslint-config-prettier"
import pluginPrettier from "eslint-plugin-prettier"
import { globalIgnores } from "eslint/config"

export default createConfigForNuxt({
  features: {
    typescript: true
  },
  dirs: {
    src: ["./"],
    pages: ["app/pages", "layers/**/pages"],
    layouts: ["app/layouts", "layers/**/layouts"],
    components: ["app/components", "layers/**/components"],
    composables: [
      "app/composables",
      "app/utils",
      "layers/**/composables",
      "layers/**/utils",
      "layers/**/stores"
    ],
    plugins: ["app/plugins", "layers/**/plugins"],
    middleware: ["app/middleware", "layers/**/middleware"],
    modules: ["modules"],
    servers: ["server"],
    root: ["./"]
  }
})
  .append(
    globalIgnores([
      "**/dist/**",
      "**/dist-ssr/**",
      "**/coverage/**",
      "**/shims/**",
      ".nuxt/**",
      "node_modules/**",
      "eslint.config.*"
    ])
  )
  .append({
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      // Vue rules
      "vue/multi-word-component-names": "off",
      "vue/no-multiple-template-root": "off",
      "vue/valid-v-slot": ["error", { allowModifiers: true }],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-v-html": ["error", {
        "ignorePattern": "^html"
    }]
      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"]
        }
      ],
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "SLOT",
            "CONTENT",
            "OTHER_ATTR",
            "UNIQUE",
            "GLOBAL",
            "EVENTS"
          ],
          alphabetical: false
        }
      ],

      // Prettier rules
      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/unified-signatures": "off",
      "@typescript-eslint/consistent-type-imports": "off"
    }
  })
  .append(configPrettier)
