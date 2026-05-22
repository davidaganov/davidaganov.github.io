---
title: "05.22.2026 — Resume, PDF, and RSS"
description: "A dedicated resume page with PDF export and an RSS feed for articles, projects, and templates."
publishedAt: 2026-05-22
meta:
  icon: i-lucide-briefcase
  order: 3
---

A resume page on the site, CV download as PDF from the browser, and an RSS feed to follow new content.

## Added

### Resume page

New route: **[Resume](/resume)** — summary, skills, work history, and contacts.

→ [Open resume](/resume)

### PDF download

The resume page has a **Download PDF** button. The document is built in the browser with pdfmake: the same sections as on screen (summary, skills, experience), respecting the current UI locale.

### RSS feed

Feeds are live at **`/feed.xml`** (ru) and **`/en/feed.xml`** (en). They include published items from **Projects**, **Articles**, and **Templates** — title, description, date, category, and preview image (OG).

Subscribe from the footer, docs sidebar, or directly:

→ [RSS (ru)](/feed.xml) · [RSS (en)](/en/feed.xml)
