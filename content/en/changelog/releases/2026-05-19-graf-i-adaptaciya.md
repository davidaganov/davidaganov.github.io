---
title: "05.19.2026 — Graph, footer, and mobile"
description: "Interactive docs link graph, refreshed footer, and mobile-friendly tweaks."
publishedAt: 2026-05-19
meta:
  icon: i-lucide-git-fork
  order: 2
---

A link graph across documentation pages, a refreshed footer, and noticeable improvements on phones and tablets.

## Added

### Documentation link graph

New page: **[Link graph](/docs/graph)** — a force-directed graph of all docs pages and how they connect. Nodes are grouped by section; hover highlights neighbors; click opens the page.

A settings panel lets you tune simulation forces, node size, edge thickness, and label visibility. Label and node colors respect light and dark theme.

On **desktop**, the graph is available as an icon in the right side of the docs header. On **mobile**, as a **Graph** tab in the horizontal nav.

→ [Open the graph](/docs/graph)

## Improved

### Footer

Reworked the site footer: sections for docs navigation, projects, and contacts, with a unified visual style.

### Mobile

- **Graph:** full viewport below the header, settings panel at the bottom, pinch-zoom and pan gestures.
- **Home:** fixed hero hydration and loader behavior for the background animation.
- **Docs:** graph and changelog are easier to reach from the header on narrow screens. Small fixes for a smoother, more comfortable experience.
