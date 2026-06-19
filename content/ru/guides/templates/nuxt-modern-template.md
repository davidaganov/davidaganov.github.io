---
title: Nuxt Modern Template
description: Шаблон для Nuxt 4 — TypeScript, ESLint + Prettier и с выбором архитектуры. Tailwind, Pinia, i18n, SEO, Content и тесты подключаются при генерации.
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

> Стартовый шаблон для Nuxt 4. База — чистый проект с TypeScript и линтингом; всё остальное выбирается в CLI при генерации.

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

Выбери **Nuxt Modern Template**, затем архитектуру и нужные модули.

## Зачем

Nuxt из коробки даёт много возможностей, но на старте всё равно остаётся рутина: настроить TypeScript, ESLint и Prettier, решить как раскладывать код, подключить i18n и/или SEO, собрать страницы. Этот шаблон для [@davidaganov/stack](https://www.npmjs.com/package/@davidaganov/stack): CLI складывает слои в нужном порядке, мержит конфиги и отдаёт готовый проект.

Репозиторий шаблона — **не** готовое приложение, а набор слоёв для генератора. Запускать `npm run dev` нужно уже в сгенерированном проекте.

## Архитектура

При генерации выбирается один из двух вариантов:

| Режим       | Описание                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| **Flat**    | Один каталог `app/` — проще для небольших сайтов и MVP                                                        |
| **Layered** | Корневой `app/` + `layers/base` + `layers/ui` — удобно, для большого сайта и когда нужно разделить домен и UI |

Layered-вариант близок к тому, как устроены крупные Nuxt-проекты с изолированными слоями. Подробнее про идею — в статье [«Работа со слоями в Nuxt 3»](/docs/guides/articles/nuxt-layers).

## Что внутри

Базовая сборка: **Nuxt 4**, Vue 3, TypeScript, `@nuxt/eslint`, Prettier, скрипт генерации favicon.

Опциональные модули:

- **Tailwind CSS** — стили и `@tailwindcss/vite`
- **Pinia** — стор с `@pinia/nuxt`
- **i18n** — `@nuxtjs/i18n` с типизированными локалями и [Polyglot Keeper](/docs/about/projects/polyglot-keeper) для синхронизации переводов
- **SEO** — `@nuxtjs/seo`: meta, OG-изображения, sitemap, robots
- **Content** — `@nuxt/content` с примером блога и markdown-контентом
- **Tests** — Vitest + `@nuxt/test-utils`

Режимы генерации те же, что у остальных шаблонов Stack: `recommended` (всё включено + демо), `custom` (выбор фич вручную) или `empty` (минимум).

Требования: Node.js **>= 22.5**.

## Итог

Хороший выбор для старта на Nuxt 4 без первичной настройки с нуля: flat или layered, нужные модули — и на выходе проект с предсказуемой структурой вместо пустого `nuxi init`.
