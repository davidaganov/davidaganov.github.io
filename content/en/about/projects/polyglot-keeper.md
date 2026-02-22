---
title: Polyglot Keeper
description: AI-powered i18n sync tool that translates missing keys and keeps all locale files perfectly consistent.
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

Polyglot Keeper is a CLI tool that keeps your i18n locale files in sync: it detects **missing keys**, translates them using AI, and enforces **the exact same structure and key order** across all locales.

## The problem

In real-world apps, i18n often drifts over time:

- new keys land in the primary locale, while other locales lag behind
- files diverge structurally (different nesting, random key order)
- obsolete keys remain and add noise
- manual translation workflows don’t scale and are error-prone

## The solution

Polyglot Keeper uses one simple rule: **your primary locale is the source of truth** and all other locales are synchronized to match it.

What it does:

- **AI translation** — fills missing keys via Gemini / OpenAI / Claude
- **Structure mirroring** — matches structure and key ordering
- **Cleanup** — removes keys that no longer exist in the base locale
- **Batch + retry** — handles large sets safely with delays and retries

## Quick start

```bash
npm i -D polyglot-keeper
npx polyglot-keeper init
# add your API key to .env
npx polyglot-keeper sync
```

## Config

```json
{
  "provider": "gemini",
  "localeFormat": "short",
  "locales": ["en", "ru"],
  "defaultLocale": "en",
  "localesDir": "src/i18n"
}
```
