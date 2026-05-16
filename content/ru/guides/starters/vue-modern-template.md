---
title: Vue Modern Template
description: Чистый шаблон для Vue 3 приложений. TypeScript, Tailwind и стабильная архитектура.
icon: i-simple-icons-vuedotjs
githubRepo: davidaganov/vue-modern-template
githubUrl: https://github.com/davidaganov/vue-modern-template
publishedAt: 2026-05-09
tags:
  - Vue
  - Frontend
---

# Vue Modern Template

> Это мой основной шаблон для новых Vue 3 проектов. Ничего лишнего, всё необходимое подключается в пару кликов при генерации.

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

Каждый раз после создания проекта на Vue 3 мне приходилось переносить в него множество конфигов, определять архитектуру, подключать плагины и т.д. Этот шаблон помогает избежать этих проблем и содержит всё необходимое для работы.

## Что внутри

Базовая сборка: Vue 3, Vite, TypeScript, Vue Router, ESLint + Prettier.

Опциональные фичи:

- **Pinia** — стор
- **i18n** — vue-i18n с типизированными локалями и [Polyglot Keeper](/docs/about/projects/polyglot-keeper) для синхронизации переводов
- **Тесты** — Vitest + Vue Test Utils

## Итог

Хороший выбор, когда нужно быстро стартовать Vue 3 проект. Минимум лишних фич, максимум необходимого.
