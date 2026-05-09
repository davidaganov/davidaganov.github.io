---
title: Vue PWA Template
description: Шаблон для Progressive Web App на Vue 3 + Vite. Offline-режим из коробки, Tailwind, TypeScript — и минимум лишнего в базовой сборке.
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

> Шаблон для SPA-проектов с поддержкой PWA: приложение устанавливается на устройство, работает офлайн и обновляется в фоне.

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

PWA — это когда веб-приложение можно установить на телефон или десктоп, и оно работает как нативное: открывается без браузера, работает без интернета, получает push-уведомления. Технически это service worker + Web App Manifest.

Настраивать всё это с нуля — муторно. В шаблоне это уже сделано через `vite-plugin-pwa`: service worker генерируется автоматически, стратегия кеширования настроена, манифест подключён.

## Что внутри

Базовая сборка: Vue 3, Vite, TypeScript, Vue Router, ESLint + Prettier.

Опциональные фичи, которые выбираешь при генерации:

- **Pinia** — стор
- **i18n** — vue-i18n с типизированными локалями и [Polyglot Keeper](/docs/about/projects/polyglot-keeper) для синхронизации переводов
- **Тесты** — Vitest + Vue Test Utils

## Итог

Если нужно SPA с возможностью офлайн-работы и установки на устройство — это точка входа. Всё что связано с PWA уже настроено, остальное подключается по необходимости.
