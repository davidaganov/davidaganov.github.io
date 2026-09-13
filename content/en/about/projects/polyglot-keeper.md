---
title: Polyglot Keeper
description: AI-powered i18n toolkit — locale file synchronization (JSON/Markdown) via CLI and a universal Runtime API for on-the-fly translation in web applications (Vue, React, Nuxt, Node.js).
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

[Polyglot Keeper](https://github.com/davidaganov/polyglot-keeper) is a full-featured AI-powered internationalization (i18n) toolkit uniting three workflows:

1. **CLI / Build‑time** — automated synchronization and translation of locale files (JSON and Markdown), mirroring the base locale structure.
2. **Runtime API** — on-the-fly dynamic translation of strings, arrays, and nested structures directly inside application code (Vue, React, Nuxt, Astro, Node.js).
3. **Visual Editor** — local browser SPA (`npx polyglot-keeper serve`) for managing locale files, AI translation, and reviewing drafts.

Works with any web framework and any i18n library (vue-i18n, next-intl, i18next) without vendor lock-in or proprietary CMS dependencies.

## The Problem

In multilingual applications, teams inevitably encounter two challenges:

- **Static interfaces**: new keys are added only to the primary locale (`en.json`), while other languages (`ru.json`, `de.json`) fall behind, file structures diverge, and obsolete keys clutter the codebase.
- **Dynamic content**: tags, categories, CMS descriptions, or user input need to be translated at runtime. Exposing AI provider API keys in browser bundles is unacceptable due to security risks.

## The Solution

Polyglot Keeper solves both problems with a single package.

### 1. CLI Locale Synchronization

Uses the base locale as the **source of truth** and aligns all targets:

- **AI translation** — fills missing keys using Gemini, OpenAI, or Anthropic.
- **Change tracking** — monitors edits in source values (`off`, `on`, interactive `carefully`).
- **Structure mirroring** — keeps keys, order, and nesting identical to the source file.
- **Cleanup** — automatically purges obsolete keys that were deleted from the source locale.
- **Markdown support** — translates `.md` docs and articles while preserving frontmatter and markdown syntax.
- **Lockfile** — protects manually reviewed keys from accidental overwrite via `.polyglot-lock.json`.

### 2. Universal Runtime API

Provides programmatic translation directly from application code with two architectural modes:

- **Direct Mode** — for Node.js backends, SSR (Astro, Nuxt server), and scripts using the server-side API key.
- **Proxy Mode** — safe execution in browsers (Vue, React, SPA). The client invokes `polyglot.t()` or `polyglot.translate()` through a lightweight backend bridge created with `createTranslateHandler`. **The API key stays strictly on the server.**
- **Built-in LRU cache** — repeated phrases are served in 0ms without hitting the AI provider or consuming tokens.
- **Type safety** — recursively translates string values in complex objects while preserving types, numbers, booleans, and nested structures.

### 3. AI Agent Skill

Includes a pre-packaged **Skill** (`skills/polyglot-keeper`) for modern coding assistants (Google Antigravity IDE, Cursor, Claude Code, GitHub Copilot). The skill instructs AI assistants on the library's architectural patterns: selecting Direct vs Proxy Mode, scaffolding backend handlers, and avoiding API key leakage.

---

## Quick Start

### Installation

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

## Workflow 1: CLI Locale Synchronization

```bash
# Interactive setup wizard (creates polyglot.config.json and .env)
npx polyglot-keeper init

# Sync JSON locale files
npx polyglot-keeper sync

# Sync Markdown documentation
npx polyglot-keeper sync --md

# Force re-translation of all existing keys
npx polyglot-keeper sync --force
```

### Configuration (`polyglot.config.json`)

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

## Workflow 2: Runtime API in Web Applications

### Direct Mode (Node.js / Server / SSR)

```ts
import { API_PROVIDER, polyglot } from "polyglot-keeper/runtime"

polyglot.init({
  provider: API_PROVIDER.GEMINI,
  apiKey: process.env.GEMINI_API_KEY!,
  defaultTargetLocale: "ru"
})

// Single string
const greeting = await polyglot.t("Hello, world!")

// Type-safe nested object
const product = await polyglot.translate(
  {
    title: "Mechanical Keyboard",
    specs: { switches: "Linear Red", wireless: true }
  },
  { to: "ru" }
)
```

### Proxy Mode (Browser / Vue / React)

Keep your API key private on the server:

#### 1. Server Handler (Nuxt 3: `server/api/translate.post.ts`)

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

#### 2. Client Component (Vue 3)

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

## Workflow 3: Visual Locale Editor (Web UI)

Launch a local web interface for visual locale file editing and AI translation without external SaaS dependencies:

```bash
npx polyglot-keeper serve
```

Opens `http://localhost:3636` automatically.

- **Translation Cards** — side-by-side source preview, inline key drafting, and status badges (`MISSING`, `DRAFT`, `SAVED`).
- **Filter & Search** — filter by `All`, `Missing`, or `Drafts` (unsaved changes), with instant search.
- **Batch AI Translation** — translate single keys or all missing keys at once.
- **Locale & Key Management** — add/delete locales and keys with confirmation modals, and switch the primary source locale (`Set as Source`).
- **Save** — writes changes back to your JSON files on disk (<kbd>Ctrl+S</kbd> / <kbd>Cmd+S</kbd>).

---

## AI Agent Skill

Polyglot Keeper includes a ready-to-use AI Skill in `.agents/skills/polyglot-keeper/`:

- **Autonomous Code Generation**: Your AI assistant knows method signatures, clean import paths (`polyglot-keeper/runtime`), and configuration shapes out of the box.
- **Architectural Safety**: Prevents exposing secrets in client bundles and automatically scaffolds server-side proxy handlers.
- **IDE Support**: Native discovery in Google Antigravity IDE, and can be copied into `.agents/skills/polyglot-keeper/` for any project using Cursor or Claude Code.
