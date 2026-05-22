---
title: Vue PWA Template
description: Progressive Web App template with Vue 3 + Vite. Offline mode out of the box, Tailwind, TypeScript — and little cruft in the base build.
icon: i-simple-icons-pwa
githubRepo: davidaganov/vue-pwa-template
githubUrl: https://github.com/davidaganov/vue-pwa-template
publishedAt: 2026-05-09
tags:
  - Vue
  - PWA
  - Frontend
  - Tools
---

# Vue PWA Template

> Template for SPAs with PWA support: installable on devices, works offline, updates in the background.

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

A PWA is a web app you can install on phone or desktop so it behaves more like native: opens outside the browser chrome, works offline, can receive push notifications. Technically that is a service worker plus a Web App Manifest.

Wiring all of that from scratch is tedious. Here it is already done with `vite-plugin-pwa`: the service worker is generated automatically, caching strategy is set, manifest is hooked up.

## What’s inside

Base stack: Vue 3, Vite, TypeScript, Vue Router, ESLint + Prettier.

Optional features you pick at generation time:

- **Pinia** — state store
- **i18n** — vue-i18n with typed locales and [Polyglot Keeper](/docs/about/projects/polyglot-keeper) to sync translations
- **Tests** — Vitest + Vue Test Utils

## Bottom line

If you need an SPA with offline support and installability, start here. PWA plumbing is ready; everything else is optional.
