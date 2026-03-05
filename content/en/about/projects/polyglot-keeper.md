---
title: Polyglot Keeper
description: AI-powered i18n synchronization tool that automatically translates missing keys and maintains perfect structural consistency across all your locale and markdown files.
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

Polyglot Keeper is a CLI tool that keeps your i18n locale files in sync: it detects **missing keys**, translates them using AI, and enforces **the exact same structure and key order** across all locales and Markdown files. Works with any framework (React, Vue, Svelte, Angular) and any i18n library.

## The problem

In real-world apps, i18n often drifts over time:

- new keys land in the primary locale, while other locales lag behind
- files diverge structurally (different nesting, random key order)
- obsolete keys remain and add noise

## The solution

Polyglot Keeper uses one simple rule: **your primary locale is the source of truth** and all other locales are synchronized to match it.

What it does:

- **AI translation** — fills missing keys via Gemini / OpenAI / Anthropic
- **Change tracking** — detects when source values change and updates translations (`off` / `on` / `carefully`)
- **Structure mirroring** — matches structure and key ordering
- **Cleanup** — removes keys that no longer exist in the base locale
- **Batch + retry** — handles large sets safely with configurable delays and retries
- **Interactive setup** — guided CLI wizard to get you started in seconds

## Quick start

```bash
npm i -D polyglot-keeper
npx polyglot-keeper init
# add your API key to .env
npx polyglot-keeper sync
```

## CLI commands

| Command                            | Description                              |
| :--------------------------------- | :--------------------------------------- |
| `npx polyglot-keeper init`         | Start the interactive setup wizard       |
| `npx polyglot-keeper sync`         | Sync and translate JSON locale files     |
| `npx polyglot-keeper sync --md`    | Sync and translate Markdown files        |
| `npx polyglot-keeper sync --force` | Force retranslation of all existing keys |

## Config

The full setup is managed via `polyglot.config.json` with separate sections for JSON and Markdown:

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

### Change tracking modes

By default, the tool only translates missing keys. The `trackChanges` option controls how source file modifications are handled:

- `"off"` — Default. Only translate new keys, ignore changes to existing values.
- `"on"` — Automatically retranslate all target keys when the source key changes.
- `"carefully"` — Interactive review. The CLI prompts you for each changed key to retranslate, skip, or freeze it.

> **Note:** Enabling tracking creates a `.polyglot-lock.json` file. Freezing a key locks it from future retranslations. Use `sync --force` to clear frozen keys.
