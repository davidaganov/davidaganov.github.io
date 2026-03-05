---
title: Polyglot Keeper
description: AI‑инструмент синхронизации i18n, который автоматически переводит недостающие ключи и поддерживает идеальную структуру переводов — в JSON и Markdown файлах.
icon: i-lucide-languages
npmPackage: polyglot-keeper
npmUrl: https://www.npmjs.com/package/polyglot-keeper
githubRepo: davidaganov/polyglot-keeper
githubUrl: https://github.com/davidaganov/polyglot-keeper
publishedAt: 2025-12-15
tags:
  - CLI
  - i18n
  - AI
  - Node.js
---

# Polyglot Keeper

Polyglot Keeper — это CLI‑утилита для синхронизации локалей: она находит **недостающие ключи**, переводит их через AI и приводит **все файлы локализации к одной структуре** (как в базовой локали) — включая Markdown‑файлы. Работает с любым фреймворком (React, Vue, Svelte, Angular) и любой i18n‑библиотекой.

## Проблема

В реальных проектах i18n быстро начинает «рассыпаться»:

- новые ключи добавляются только в `ru.json`, а `en.json`/`de.json` отстают
- структура файлов различается (ключи в разном порядке, вложенности плавают)
- появляются устаревшие ключи, которые больше нигде не используются

## Решение

Polyglot Keeper делает один понятный шаг: **берёт базовую локаль как источник истины** и синхронизирует остальные.

Что именно происходит:

- **AI translation** — переводит отсутствующие ключи через Gemini / OpenAI / Anthropic
- **Change tracking** — отслеживает изменения в исходных значениях и обновляет переводы (`off` / `on` / `carefully`)
- **Structure mirroring** — выравнивает структуру и порядок ключей
- **Cleanup** — удаляет ключи, которые исчезли из базовой локали
- **Batch + retry** — обрабатывает большие наборы ключей с настраиваемыми паузами и повторными попытками
- **Interactive setup** — интерактивный CLI‑визард для быстрого старта

## Быстрый старт

<code-group sync="pm">

```bash [npm]
npm i -D polyglot-keeper
npx polyglot-keeper init
# добавь API key в .env
npx polyglot-keeper sync
```

```bash [yarn]
yarn add -D polyglot-keeper
yarn polyglot-keeper init
# добавь API key в .env
yarn polyglot-keeper sync
```

```bash [pnpm]
pnpm add -D polyglot-keeper
pnpm polyglot-keeper init
# добавь API key в .env
pnpm polyglot-keeper sync
```

```bash [bun]
bun add -d polyglot-keeper
bunx polyglot-keeper init
# добавь API key в .env
bunx polyglot-keeper sync
```

</code-group>

## CLI команды

| Команда                            | Описание                                        |
| :--------------------------------- | :---------------------------------------------- |
| `npx polyglot-keeper init`         | Запустить интерактивный визард настройки        |
| `npx polyglot-keeper sync`         | Синхронизировать и перевести JSON‑файлы локалей |
| `npx polyglot-keeper sync --md`    | Синхронизировать и перевести Markdown‑файлы     |
| `npx polyglot-keeper sync --force` | Принудительно перевести все существующие ключи  |

## Конфигурация

Настройка хранится в `polyglot.config.json` с отдельными секциями для JSON и Markdown:

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
    "trackChanges": "carefully",
    "exclude": ["drafts/**", "private/**"]
  }
}
```

### Режимы отслеживания изменений

По умолчанию инструмент переводит только новые ключи. Опция `trackChanges` управляет тем, как обрабатываются изменения в исходных файлах:

- `"off"` — По умолчанию. Переводить только новые ключи, игнорировать изменения существующих.
- `"on"` — Автоматически пере-переводить все целевые ключи при изменении исходного.
- `"carefully"` — Интерактивная проверка. CLI запрашивает решение по каждому изменённому ключу: перевести заново, пропустить или заморозить.

> **Примечание:** Включение отслеживания создаёт файл `.polyglot-lock.json`. Заморозка ключа защищает его от будущих переводов. Используй `sync --force` для сброса замороженных ключей.
