---
title: Nuxt Modern Template
description: Nuxt 4 starter with TypeScript, ESLint + Prettier and a choice of architecture. Tailwind, Pinia, i18n, SEO, Content, and tests are toggles at generation time.
icon: i-simple-icons-nuxtdotjs
githubRepo: davidaganov/nuxt-modern-template
githubUrl: https://github.com/davidaganov/nuxt-modern-template
publishedAt: 2026-06-09
tags:
  - Nuxt
  - frontend
  - Tools
---

# Nuxt Modern Template

> A Nuxt 4 starter. The base is a lean project with TypeScript and linting; everything else is selected in the CLI during generation.

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

In the generation wizard — **Nuxt Modern Template**, then architecture and optional modules.

## Why

Nuxt ships a lot out of the box, but day one still means wiring TypeScript, ESLint and Prettier, deciding how to split code, plugging in i18n and/or SEO, and putting pages together. This template is for [@davidaganov/stack](https://www.npmjs.com/package/@davidaganov/stack): the CLI stacks layers in the right order, merges configs, and produces a ready project.

The template repo is **not** a runnable app — it is layer source for the generator. `npm run dev` runs in the generated project, not in this repository.

## Architecture

One of two layouts is chosen at generation time:

| Mode        | Description                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| **Flat**    | Single `app/` directory — simpler for small sites and MVPs                                               |
| **Layered** | Root `app/` + `layers/base` + `layers/ui` — suited to larger sites when domain and UI need a clear split |

The layered option is close to how larger Nuxt apps isolate features. More on the idea in [“Working with Layers in Nuxt 3”](/docs/guides/articles/nuxt-layers).

## What’s inside

Base stack: **Nuxt 4**, Vue 3, TypeScript, `@nuxt/eslint`, Prettier, favicon generation script.

Optional modules:

- **Tailwind CSS** — styling with `@tailwindcss/vite`
- **Pinia** — state via `@pinia/nuxt`
- **i18n** — `@nuxtjs/i18n` with typed locales and [Polyglot Keeper](/docs/about/projects/polyglot-keeper) to sync translations
- **SEO** — `@nuxtjs/seo`: meta, OG images, sitemap, robots
- **Content** — `@nuxt/content` with a sample blog and markdown content
- **Tests** — Vitest + `@nuxt/test-utils`

Generation modes match other Stack templates: `recommended` (all features + demo), `custom` (hand-pick modules), or `empty` (bare minimum).

Requirements: Node.js **>= 22.5**.

## Bottom line

A solid choice for bootstrapping Nuxt 4 without setup from scratch: flat or layered, optional modules — and a predictable project structure instead of a bare `nuxi init`.
