---
title: "05.22.2026 — Resume, PDF, and RSS"
description: "A dedicated resume page with PDF export, an RSS subscription page, and XML feeds for articles, projects, and templates."
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

A subscription page at **`/feed`** (ru) and **`/en/feed`** (en): how RSS works, feed URL with copy, Feedly/Inoreader shortcuts, recent posts, and category filter.

XML feeds at **`/feed.xml`** (ru) and **`/en/feed.xml`** (en) include published items from **Projects**, **Articles**, and **Templates** — title, description, date, category, and preview image (OG).

Subscribe from the footer, docs sidebar, or directly:

→ [RSS page (ru)](/feed) · [RSS page (en)](/en/feed)  
→ [RSS XML (ru)](/feed.xml) · [RSS XML (en)](/en/feed.xml)
