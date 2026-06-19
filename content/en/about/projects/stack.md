---
title: Stack
description: CLI to generate projects from my templates — pick what you need, get a clean result without cruft.
icon: i-lucide-layers
npmPackage: "@davidaganov/stack"
npmUrl: https://www.npmjs.com/package/@davidaganov/stack
githubRepo: davidaganov/stack
githubUrl: https://github.com/davidaganov/stack
publishedAt: 2026-05-09
tags:
  - CLI
  - Tools
  - frontend
  - DX
---

# Stack

`@davidaganov/stack` is an interactive CLI for scaffolding projects from curated templates.

## Available templates

- **Vue PWA** — [`vue-pwa-template`](https://github.com/davidaganov/vue-pwa-template)
- **Vue Modern** — [`vue-modern-template`](https://github.com/davidaganov/vue-modern-template)
- **Vue Lynx** — [`vue-lynx-template`](https://github.com/davidaganov/vue-lynx-template)
- **Nuxt Modern** — [`nuxt-modern-template`](https://github.com/davidaganov/nuxt-modern-template)
- **Astro Clean** — [`astro-clean-template`](https://github.com/davidaganov/astro-clean-template)

More detail on each in [Templates](/docs/guides/templates).

## How it works

Each template lives in one repository but is split into **layers**:

- **empty core** — minimal working project, no unnecessary dependencies;
- **optional features** — separate layers for i18n, Pinia, tests, Tailwind, and so on;
- **demo** — pages and components that show how everything fits together.

During generation the CLI stacks the right layers in order, merges configs, fills in dependencies, and strips internal markers — you get a clean project with a ready architecture.

## What the flow looks like

Run one command, then an interactive wizard:

1. **Template** — pick from the list.
2. **Project name** — defaults to the template name; you can change it.
3. **Build mode:**
   - `recommended` — all features plus the full architecture;
   - `custom` — hand-pick features: i18n, Pinia, unit tests, Tailwind, etc.;
   - `empty` — bare minimum, nothing extra.
4. **Install dependencies** — optional `install` step; just choose a package manager.

A few seconds later you have a working project in the target directory.

## Usage

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
