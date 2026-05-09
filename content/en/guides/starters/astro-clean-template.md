---
title: Astro Clean Template
description: Starter for static sites with Astro. Compiles components into predictable HTML/CSS/JS files — no extra dependencies, no client bundler magic.
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

> The main goal of this template is **clean, readable, handoff-ready** output. Handy for CMS work. No hashed class names, no unreadable script soup, no endless hashes in filenames.

## Setup

Scaffold with my [Stack](/docs/about/projects/stack) tool:

<code-group sync="pm">

```bash [npm]
npx @davidaganov/stack
```

```bash [yarn]
yarn dlx @davidaganov/stack
```

```bash [pnpm]
pnpm dlx @davidaganov/stack
```

```bash [bun]
bunx @davidaganov/stack
```

</code-group>

## The problem with classic builds

Often a frontend dev does not need a full SPA with heavy logic, but a well-built site (or pages) that will be handed off for CMS integration (Bitrix, WordPress, or custom).

If you reach for the usual stack (Vue/Nuxt/React/Next) for that job, you get a `dist` folder that is painful to work with:

- **Unpredictable hashes** in filenames: `main.abc12def.js`
- **Bundled styles** that are hard to split or override precisely
- **JSX/SFC components** you cannot open in the browser as plain HTML

The integrator opens the build and cannot find the right logic because everything is in one minified file. On the other hand, writing everything in raw HTML in 2026 or dragging Gulp into the project is its own kind of pain. You still want components, reusable layouts, and scoped styles.

## The solution

[Astro Clean Template](https://github.com/davidaganov/astro-clean-template) fixes that. Astro is used for **authoring** (comfortable components and layouts), but the build is wired so the output is a classic, “old school” file layout.

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
/* All styles roll into one predictable file */
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

## Under the hood

### One CSS file, no preprocessors

All styles are aggregated into `dist/assets/style/main.css`. Native CSS with `@import` and browser-native nesting.

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

Vite wants to bundle assets by default. This setup avoids that: scripts are not merged into one app bundle. The layout references the entry as usual:

```astro [src/layouts/Layout.astro]
<script is:inline type="module" src="/assets/script/main.js"></script>
```

In `build` mode, files from `src/assets/script/` are copied **as-is** into `dist/`. Module structure stays intact and the code stays easy to work with. No hashes, no minification.

## Build modes

| Command              | What happens                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build`      | **Handoff** build. CSS/JS are not minified, HTML is not compressed. Great for debugging and integration.                       |
| `npm run build:prod` | **Production** build. Everything is minified; `main.js` is bundled with `esbuild` into one compact file with resolved imports. |

## Bottom line

This template largely replaces the familiar “Gulp + PUG/EJS” combo: modern authoring (Astro, Vite) with a build output that stays as predictable and clean as possible.

If HTML/CSS/JS is the **final product**, not an intermediate artifact, this template will save a lot of time.
