---
title: Stack
description: CLI для генерации проектов из моих шаблонов — выбираешь что нужно, получаешь чистый результат без лишнего.
icon: i-lucide-layers
npmPackage: "@davidaganov/stack"
npmUrl: https://www.npmjs.com/package/@davidaganov/stack
githubRepo: davidaganov/stack
githubUrl: https://github.com/davidaganov/stack
publishedAt: 2026-05-09
tags:
  - CLI
  - Инструменты
  - Фронтенд
  - DX
---

# Stack

`@davidaganov/stack` — интерактивный CLI для развёртывания проектов из настроенных шаблонов.

## Доступные шаблоны

- **Vue PWA** — [`vue-pwa-template`](https://github.com/davidaganov/vue-pwa-template)
- **Vue Modern** — [`vue-modern-template`](https://github.com/davidaganov/vue-modern-template)
- **Vue Lynx** — [`vue-lynx-template`](https://github.com/davidaganov/vue-lynx-template)
- **Nuxt Modern** — [`nuxt-modern-template`](https://github.com/davidaganov/nuxt-modern-template)
- **Astro Clean** — [`astro-clean-template`](https://github.com/davidaganov/astro-clean-template)

Подробнее про каждый — в разделе [Шаблоны](/docs/guides/templates).

## Как устроено

Каждый шаблон хранится в одном репозитории, но внутри разложен на **слои**:

- **пустое ядро** — минимально рабочий проект, без лишних зависимостей;
- **опциональные фичи** — отдельные слои для i18n, Pinia, тестов, Tailwind и т.д.;
- **демо** — страницы и компоненты, которые показывают как всё работает вместе.

При генерации CLI складывает нужные слои в правильном порядке, мержит конфиги, подставляет зависимости и убирает служебные маркеры — на выходе чистый проект с готовой архитектурой.

## Как выглядит в работе

Запускаешь одну команду и дальше интерактивный диалог:

1. **Шаблон** — выбираешь из списка доступных.
2. **Имя проекта** — по умолчанию подставляется имя шаблона, можно изменить.
3. **Режим сборки:**
   - `recommended` — включены все функции + архитектура;
   - `custom` — выбор фичей вручную: i18n, Pinia, unit-тесты, Tailwind и т.д;
   - `empty` — минимум для работоспособности, ничего лишнего.
4. **Установка зависимостей** — предложение запустить `install`, нужно только выбрать пакетный менеджер.

Через несколько секунд в директории появляется готовый для работы проект.

## Использование

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
