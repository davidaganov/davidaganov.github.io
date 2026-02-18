---
title: Polyglot Keeper
description: AI‑инструмент синхронизации i18n, который автоматически переводит недостающие ключи и поддерживает идеальную структуру переводов.
icon: i-lucide-languages
npmPackage: polyglot-keeper
npmUrl: https://www.npmjs.com/package/polyglot-keeper
githubRepo: davidaganov/polyglot-keeper
githubUrl: https://github.com/davidaganov/polyglot-keeper
publishedAt: 2026-02-09
tags:
  - i18n
  - AI
---

# Polyglot Keeper

Polyglot Keeper — это CLI‑утилита для синхронизации локалей: она находит **недостающие ключи**, переводит их через AI и приводит **все файлы локализации к одной структуре** (как в базовой локали).

## Проблема

В реальных проектах i18n быстро начинает «рассыпаться»:

- новые ключи добавляются только в `ru.json`, а `en.json`/`de.json` отстают
- структура файлов различается (ключи в разном порядке, вложенности плавают)
- появляются устаревшие ключи, которые больше нигде не используются
- ручной перевод через таблицы/копипасту плохо масштабируется и часто даёт ошибки

## Решение

Polyglot Keeper делает один понятный шаг: **берёт базовую локаль как источник истины** и синхронизирует остальные.

Что именно происходит:

- **Translation** — переводит отсутствующие ключи через Gemini / OpenAI / Claude
- **Structure mirroring** — выравнивает структуру и порядок ключей
- **Cleanup** — удаляет ключи, которые исчезли из базовой локали
- **Batch + retry** — обрабатывает большие наборы ключей с паузами и повторными попытками

## Быстрый старт

```bash
npm i -D polyglot-keeper
npx polyglot-keeper init
# добавь API key в .env
npx polyglot-keeper sync
```

### Конфигурация

```json
{
  "provider": "gemini",
  "localeFormat": "short",
  "locales": ["en", "ru"],
  "defaultLocale": "ru",
  "localesDir": "src/i18n"
}
```
