---
title: Astro Clean Template
description: An Astro starter for static sites. Bundles components into predictable HTML/CSS/JS files — no bloat, no client-side bundler, no magic.
icon: i-simple-icons-astro
githubRepo: davidaganov/astro-clean-template
githubUrl: https://github.com/davidaganov/astro-clean-template
publishedAt: 2026-03-24
tags:
  - Astro
  - Frontend
  - Tools
---

# Astro Clean Template

> The main goal of this template is to output **clean, readable, and handoff-ready** code. No obfuscated class names, messy bundled scripts, or endless file hashes.

## The Problem with Classic Bundlers

Often, a frontend developer doesn't need to build a full-fledged SPA with complex logic. They just need to create high-quality HTML/CSS layouts that will be handed off to backend developers for CMS integration (like WordPress, Bitrix, or custom platforms).

If you use a typical stack with a bundler (Vite, Webpack, Nuxt/Next) for this task, you'll end up with a `dist` folder that is painful to work with:

- **Unpredictable hashes** in filenames: `main.abc12def.js`
- **Concatenated styles** that are difficult to separate or override selectively
- **JSX/SFC components** that cannot be simply opened in a browser for preview

The backend developer opens the result and struggles to find the logic they need because everything is bundled together in one minified block. On the other hand, writing raw HTML in 2026 or dragging Gulp into your project feels like pure masochism. You still want components, reusable layouts, and Scoped styles.

## The Solution

[Astro Clean Template](https://github.com/davidaganov/astro-clean-template) solves this problem. I chose Astro as the ideal **authoring** tool (so you can comfortably write components and layouts), but I rewrote the build process. The output returns to a classic, "old-school" file structure.

::code-tree{defaultValue="dist/index.html"}

```html [dist/index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="/assets/style/main.css"
    />
  </head>
  <body>
    ...
    <script
      is:inline
      type="module"
      src="/assets/script/main.js"
    ></script>
  </body>
</html>
```

```css [dist/assets/style/main.css]
/* All styles are combined into a single predictable file */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

```js [dist/assets/script/main.js]
import { initSlider } from "./modules/slider.js"

document.addEventListener("DOMContentLoaded", () => {
  initSlider()
})
```

::

## How it works under the hood

### One CSS file without preprocessors

All styles are aggregated into a single `dist/assets/style/main.css`. It uses native CSS with `@import` and native browser nesting. No more SASS or PostCSS in the project.

```css [src/assets/styles/main.css]
@import "./reset.css";
@import "./variables.css";

.container {
  margin-inline: auto;
  max-width: var(--max-width);

  @media (max-width: 640px) {
    padding-inline: 16px;
  }
}
```

### Stable script paths

Vite tries to bundle all assets by default. I bypassed this: scripts are no longer packaged into a single bundle. The layout references the file as usual:

```astro [src/layouts/Layout.astro]
<script is:inline type="module" src="/assets/script/main.js"></script>
```

In `build` mode, the files from `src/assets/script/` are copied "as-is" to `dist/`. This preserves the module structure, keeping the code easy to work with later. No hashes, no surprises.

## Build Modes

| Command              | What happens                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run build`      | Build **for handoff**. CSS/JS files are not minified, and HTML is uncompressed. Perfect for debugging and integration. |
| `npm run build:prod` | Build **for production**. Everything is minified, and `main.js` is bundled via `esbuild` into a single compact file.   |

## Template Management (CLI)

To avoid manually deleting demo content every time you start a new project, the template comes with built-in commands to switch between repository states:

<code-group sync="cmd">

```bash [config:template]
npm run config:template
# Loads the full demo version: hero, features, components, pages
```

```bash [config:clean]
npm run config:clean
# Leaves a minimal version: just the base layout and an empty index.astro
```

```bash [config:empty]
npm run config:empty
# Completely clears the src/ folder — to start from absolute scratch
```

</code-group>

## Quick Start

<code-group sync="pm">

```bash [npm]
git clone https://github.com/davidaganov/astro-clean-template.git my-project
cd my-project
npm install
npm run dev
```

```bash [yarn]
git clone https://github.com/davidaganov/astro-clean-template.git my-project
cd my-project
yarn
yarn dev
```

```bash [pnpm]
git clone https://github.com/davidaganov/astro-clean-template.git my-project
cd my-project
pnpm install
pnpm dev
```

```bash [bun]
git clone https://github.com/davidaganov/astro-clean-template.git my-project
cd my-project
bun install
bun dev
```

</code-group>

## Summary

This starter largely replaces the once famous "Gulp + PUG/EJS" stack by combining modern authoring technologies (Astro, Vite) with the most predictable and clean build output possible.

If HTML/CSS/JS is the **final product** of your project, rather than an intermediate artifact, this template will save you a ton of time.
