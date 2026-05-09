---
title: Vue Modern Template
description: A lean Vue 3 app template. TypeScript, Tailwind, and a stable architecture.
icon: i-simple-icons-vuedotjs
githubRepo: davidaganov/vue-modern-template
githubUrl: https://github.com/davidaganov/vue-modern-template
publishedAt: 2026-05-09
tags:
  - Vue
  - Frontend
  - Tools
---

# Vue Modern Template

> My default starter for new Vue 3 projects. No bloat; everything you need is a couple of toggles away at generation time.

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

## Why

After spinning up a bare Vue 3 project I kept copying configs, sketching architecture, wiring plugins, and so on. This template skips that loop and ships the essentials out of the box.

## What’s inside

Base stack: Vue 3, Vite, TypeScript, Vue Router, ESLint + Prettier.

Optional features:

- **Pinia** — state store
- **i18n** — vue-i18n with typed locales and [Polyglot Keeper](/docs/about/projects/polyglot-keeper) to sync translations
- **Tests** — Vitest + Vue Test Utils

## Bottom line

A solid pick when you need to bootstrap a Vue 3 project fast. Few extras, everything that matters.
