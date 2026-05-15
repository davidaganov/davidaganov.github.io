---
title: Polyglot Keeper
description: AI-powered i18n synchronization tool that automatically translates missing keys and maintains perfect translation structure — in JSON and Markdown files.
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

Polyglot Keeper is a CLI tool for locale synchronization: it finds **missing keys**, translates them using AI, and aligns **all localization files to a single structure** (following the base locale) — including Markdown files. Works with any framework (React, Vue, Svelte, Angular) and any i18n library.

## The Problem

In real projects, i18n quickly starts to "fall apart":

- new keys are added only to `ru.json`, while `en.json`/`de.json` fall behind
- file structures differ (keys are in different orders, nesting levels vary)
- obsolete keys appear that are no longer used anywhere

## The Solution

Polyglot Keeper takes one clear step: it **uses the base locale as the source of truth** and synchronizes the rest.

What exactly happens:

- **AI translation** — translates missing keys using Gemini / OpenAI / Anthropic
- **Change tracking** — tracks changes in source values and updates translations (`off` / `on` / `carefully`)
- **Structure mirroring** — aligns the structure and order of keys
- **Cleanup** — removes keys that have disappeared from the base locale
- **Batch + retry** — processes large sets of keys with customizable pauses and retries
- **Interactive setup** — interactive CLI wizard for a quick start

## Quick Start

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

## CLI Commands

| Command                            | Description                                 |
| :--------------------------------- | :------------------------------------------ |
| `npx polyglot-keeper init`         | Launch interactive setup wizard             |
| `npx polyglot-keeper sync`         | Synchronize and translate JSON locale files |
| `npx polyglot-keeper sync --md`    | Synchronize and translate Markdown files    |
| `npx polyglot-keeper sync --force` | Force translate all existing keys           |

## Configuration

Configuration is stored in `polyglot.config.json` with separate sections for JSON and Markdown:

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

### Change Tracking Modes

By default, the tool translates only new keys. The `trackChanges` option controls how changes in the source files are handled:

- `"off"` — Default. Translate only new keys, ignore changes to existing ones.
- `"on"` — Automatically re-translate all target keys when the source changes.
- `"carefully"` — Interactive check. The CLI asks for a decision for each changed key: re-translate, skip, or freeze.

> **Note:** Enabling tracking creates a `.polyglot-lock.json` file. Freezing a key protects it from future translations. Use `sync --force` to reset frozen keys.
