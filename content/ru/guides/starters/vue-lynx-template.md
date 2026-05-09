---
title: Vue Lynx Template
description: Шаблон для мобильных приложений на Vue 3 + Lynx. Привычный Vue 3, а на выходе — нативное Android-приложение.
icon: i-simple-icons-androidstudio
githubRepo: davidaganov/vue-lynx-template
githubUrl: https://github.com/davidaganov/vue-lynx-template
publishedAt: 2026-05-09
tags:
  - Vue
  - Mobile
  - Lynx
  - Frontend
  - Tools
---

# Vue Lynx Template

> [Lynx](https://github.com/Huxpro/vue-lynx) — это фреймворк от ByteDance для сборки нативных мобильных приложений. На данный момент Vue Lynx находится в Alpha версии - не советую брать его для коммерческого использования. Шаблон даёт готовую точку входа: Vue 3, Rspeedy, роутер и сборка под Android.

## Установка

Развернуть можно через мой инструмент [Stack](/docs/about/projects/stack):

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

## Зачем

Lynx позволяет писать приложения на привычном стеке (Vue, TypeScript, Tailwind) и собирать их в нативный APK. Это не WebView — рендеринг нативный, без браузерного движка внутри.

Настройка окружения для Lynx требует знания нескольких вещей: Rspeedy вместо Vite, Lynx Explorer для превью на устройстве, Android SDK для финальной сборки.

## Что внутри

Базовая сборка: Vue 3, Rspeedy, `vue-lynx`, Vue Router, TypeScript, ESLint + Prettier.

Опциональные фичи:

- **Pinia** — стор
- **i18n** — кастомный i18n-слой для Lynx + [Polyglot Keeper](/docs/about/projects/polyglot-keeper) для синхронизации переводов
- **Тесты** — Vitest + Vue Test Utils

## Как выглядит в разработке

Запускаешь `npm run dev` — Rspeedy поднимает dev-сервер и показывает QR-код. Открываешь [Lynx Explorer](https://github.com/lynx-family/lynx/releases) на телефоне и сканируешь — приложение появляется на устройстве.

Для финальной сборки нужны JDK 17 и Android SDK:

```bash
npm run build:android
```

На выходе — `.apk` в `android/app/build/outputs/apk/debug/`.

## Итог

Подходит, если хочется попробовать Lynx и написать мобильное приложение на Vue 3.
