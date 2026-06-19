---
title: Vue Lynx Template
description: Template for mobile apps with Vue 3 + Lynx. Familiar Vue 3 on the inside, a native Android app on the outside.
icon: i-simple-icons-androidstudio
githubRepo: davidaganov/vue-lynx-template
githubUrl: https://github.com/davidaganov/vue-lynx-template
publishedAt: 2026-05-09
tags:
  - Vue
  - Mobile
  - Lynx
  - frontend
  - Tools
---

# Vue Lynx Template

> [Lynx](https://github.com/Huxpro/vue-lynx) is ByteDance’s framework for building native mobile apps. Vue Lynx is still in alpha — I would not bet a commercial product on it yet. The template gives you a ready entry point: Vue 3, Rspeedy, a router, and an Android build.

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

Lynx lets you write apps on a familiar stack (Vue, TypeScript, Tailwind) and compile them to a native APK. This is not WebView — rendering is native, without an in-app browser engine.

Setting up Lynx means dealing with a few moving parts: Rspeedy instead of Vite, Lynx Explorer for on-device preview, and the Android SDK for final builds.

## What’s inside

Base stack: Vue 3, Rspeedy, `vue-lynx`, Vue Router, TypeScript, ESLint + Prettier.

Optional features:

- **Pinia** — state store
- **i18n** — custom i18n layer for Lynx + [Polyglot Keeper](/docs/about/projects/polyglot-keeper) to sync translations
- **Tests** — Vitest + Vue Test Utils

## Development flow

Run `npm run dev` — Rspeedy starts the dev server and shows a QR code. Open [Lynx Explorer](https://github.com/lynx-family/lynx/releases) on your phone, scan it, and the app appears on the device.

For a release build you need JDK 17 and the Android SDK:

```bash
npm run build:android
```

Output: `.apk` under `android/app/build/outputs/apk/debug/`.

## Bottom line

Use it if you want to try Lynx and ship a mobile app on Vue 3.
