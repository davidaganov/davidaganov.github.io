---
title: Polyglot Keeper
description: AI-инструмент для i18n — синхронизация файлов локалей (JSON/Markdown) через CLI и универсальный Runtime API для динамического перевода на лету в веб-приложениях (Vue, React, Nuxt, Node.js).
icon: i-lucide-languages
npmPackage: polyglot-keeper
npmUrl: https://www.npmjs.com/package/polyglot-keeper
githubRepo: davidaganov/polyglot-keeper
githubUrl: https://github.com/davidaganov/polyglot-keeper
publishedAt: 2025-12-15
tags:
  - cli
  - runtime
  - i18n
  - ai
  - typescript
  - node.js
---

# Polyglot Keeper

[Polyglot Keeper](https://github.com/davidaganov/polyglot-keeper) — комплексный AI‑инструмент для интернационализации (i18n), объединяющий два ключевых подхода:

1. **CLI / Build‑time** — автоматическая синхронизация и перевод файлов локализации (JSON и Markdown) с зеркалированием структуры исходной локали.
2. **Runtime API** — динамический перевод строк, массивов и сложных вложенных структур на лету прямо в коде приложения (Vue, React, Nuxt, Astro, Node.js).

Работает с любым фреймворком и любой i18n‑библиотекой (vue-i18n, next-intl, i18next) без привязки к конкретным провайдерам или CMS.

## Проблема

В мультиязычных веб-приложениях разработчики сталкиваются с двумя типами задач:

- **Статические интерфейсы**: новые ключи добавляются только в основную локаль (`ru.json`), а остальные файлы (`en.json`, `de.json`) отстают, порядок ключей нарушается, а неиспользуемые переводы годами висят в коде.
- **Динамический контент**: категории, теги, статьи или пользовательский ввод нужно переводить прямо в рантайме. При этом тащить AI API‑ключи в клиентский бандл строго запрещено из соображений безопасности.

## Решение

Polyglot Keeper закрывает обе проблемы одним пакетом.

### 1. CLI‑синхронизация локалей

Берёт базовую локаль как **источник истины** и автоматически подтягивает остальные:

- **AI translation** — перевод недостающих ключей через Gemini, OpenAI или Anthropic.
- **Change tracking** — отслеживание изменений в исходных значениях (`off`, `on`, интерактивный `carefully`).
- **Structure mirroring** — сохранение точной структуры, порядка ключей и вложенностей базовой локали.
- **Cleanup** — автоматическое удаление устаревших ключей, исчезнувших из базового файла.
- **Markdown support** — перевод `.md`‑документации и статей с сохранением структуры заголовков и фронтметтера.
- **Lock-файл** — защита вручную отредактированных ключей через `.polyglot-lock.json`.

### 2. Универсальный Runtime API

Позволяет вызывать перевод прямо из кода приложений с поддержкой двух архитектурных режимов:

- **Direct Mode** — прямой вызов из бэкенда, SSR (Astro, Nuxt server) или Node.js скриптов с использованием локального API‑ключа.
- **Proxy Mode** — безопасная работа в браузере (Vue, React, SPA). Клиент вызывает метод `polyglot.t()` или `polyglot.translate()`, направляя запрос через легковесный серверный мост `createTranslateHandler`. **API‑ключ остаётся только на сервере.**
- **Встроенный LRU‑кэш** — повторные переводы одинаковых фраз выполняются мгновенно за 0 мс без траты API‑токенов.
- **Сохранение TypeScript‑типов** — при переводе объектов глубоко обходятся все строковые свойства, сохраняя неизменными числа, флаги и интерфейс структуры.

### 3. AI Agent Skill

В репозиторий встроен специализированный **Skill** (`skills/polyglot-keeper`) для современных ИИ‑ассистентов (Google Antigravity IDE, Cursor, Claude Code, GitHub Copilot). Навык автоматически обучает агентов архитектурным стандартам библиотеки: выбору между Direct и Proxy режимами, созданию прокси-хэндлеров и защите секретов.

---

## Быстрый старт

### Установка

<code-group sync="pm">

```bash [npm]
npm i -D polyglot-keeper
```

```bash [yarn]
yarn add -D polyglot-keeper
```

```bash [pnpm]
pnpm add -D polyglot-keeper
```

```bash [bun]
bun add -d polyglot-keeper
```

</code-group>

---

## Режим 1: CLI-синхронизация

```bash
# Интерактивная первичная настройка (создаст polyglot.config.json и .env)
npx polyglot-keeper init

# Синхронизация JSON-файлов локалей
npx polyglot-keeper sync

# Синхронизация Markdown-документации
npx polyglot-keeper sync --md

# Принудительный переперевод всех ключей
npx polyglot-keeper sync --force
```

### Конфигурация (`polyglot.config.json`)

```json
{
  "envFile": ".env",
  "json": {
    "provider": "gemini",
    "model": "gemini-flash-latest",
    "localeFormat": "short",
    "locales": ["EN", "RU"],
    "defaultLocale": "EN",
    "localesDir": "src/i18n",
    "trackChanges": "carefully"
  },
  "markdown": {
    "provider": "gemini",
    "model": "gemini-flash-latest",
    "contentDir": "content",
    "defaultLocale": "en",
    "locales": ["en", "ru"],
    "trackChanges": "carefully"
  }
}
```

---

## Режим 2: Runtime API в веб-приложениях

### Direct Mode (Node.js / Сервер / SSR)

```ts
import { API_PROVIDER, polyglot } from "polyglot-keeper/runtime"

polyglot.init({
  provider: API_PROVIDER.GEMINI,
  apiKey: process.env.GEMINI_API_KEY!,
  defaultTargetLocale: "ru"
})

// Перевод одной строки
const greeting = await polyglot.t("Hello, world!")

// Типобезопасный перевод вложенного объекта
const product = await polyglot.translate(
  {
    title: "Mechanical Keyboard",
    specs: { switches: "Linear Red", wireless: true }
  },
  { to: "ru" }
)
```

### Proxy Mode (Браузер / Vue / React)

В браузерном окружении ключ не должен попадать в бандл:

#### 1. Серверный хэндлер (Nuxt 3: `server/api/translate.post.ts`)

```ts
import { API_PROVIDER, createTranslateHandler } from "polyglot-keeper/runtime"

const handler = createTranslateHandler({
  provider: API_PROVIDER.GEMINI,
  apiKey: process.env.GEMINI_API_KEY!
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return handler(body)
})
```

#### 2. Клиентский компонент (Vue 3)

```vue
<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { polyglot } from "polyglot-keeper/runtime"

polyglot.init({
  endpoint: "/api/translate",
  defaultTargetLocale: "ru"
})

const props = defineProps<{
  text: string
  locale?: string
}>()

const translated = ref(props.text)
const isLoading = ref(false)

const handleTranslate = async () => {
  isLoading.value = true
  try {
    translated.value = await polyglot.t(props.text, { to: props.locale })
  } finally {
    isLoading.value = false
  }
}

watchEffect(handleTranslate)
</script>

<template>
  <span :class="{ 'opacity-50': isLoading }">{{ translated }}</span>
</template>
```

---

## Workflow 3: Визуальный редактор (Web UI)

Локальный веб-интерфейс для визуального управления переводами и файлами локалей:

```bash
npx polyglot-keeper serve
```

Автоматически запускается на `http://localhost:3636`.

- **Карточки переводов** — предпросмотр исходного текста, черновики изменений и понятные бейджи статуса (`MISSING`, `DRAFT`, `SAVED`).
- **Фильтрация и поиск** — быстрый поиск и фильтры: `All`, `Missing` (только непереведённые), `Drafts` (несохранённые изменения).
- **Пакетный перевод ИИ** — перевод отдельного ключа или всех недостающих значений.
- **Управление структурой** — добавление/удаление локалей и ключей с подтверждением, смена основного языка (`Set as Source`).
- **Сохранение** — прямая запись изменений в JSON-файлы на диске (<kbd>Ctrl+S</kbd> / <kbd>Cmd+S</kbd>).

---

## AI Agent Skill

Библиотека содержит готовый набор инструкций для ИИ-ассистентов в директории `.agents/skills/polyglot-keeper/`:

- **Автономная генерация**: AI-ассистент сразу знает сигнатуры методов, правильные точки импорта (`polyglot-keeper/runtime`) и форматы конфигураций.
- **Архитектурная безопасность**: подсказывает разработчику не публиковать API-ключи на клиенте и сразу генерирует серверный прокси-хэндлер.
- **Поддержка IDE**: нативная поддержка в Google Antigravity IDE, а также возможность скопировать папку `.agents/skills/polyglot-keeper/` в любой проект для работы с Cursor или Claude Code.
