---
title: Dock
description: Local multi-project hub — npm scripts, git, and a terminal in one window. No accounts or cloud; project list stays in sync via projects.json and Project Manager for VS Code / Cursor.
icon: i-lucide-folder-kanban
githubRepo: davidaganov/dock
githubUrl: https://github.com/davidaganov/dock
publishedAt: 2026-08-04
tags:
  - tools
  - node.js
  - dx
  - open source
---

# Dock

[Dock](https://github.com/davidaganov/dock) is a local hub for multiple projects — npm scripts, git, and a terminal in one window. No accounts or cloud; the project list stays in sync via `projects.json` and Project Manager in VS Code / Cursor.

**A project is any folder on disk.**

## Requirements

- [Node.js](https://nodejs.org/) 18+
- Git (optional, for pull / fetch / checkout)
- Windows tray: [.NET SDK](https://dotnet.microsoft.com/download) 10+

## The problem

With dozens of projects, the same chores repeat:

- hunt for the right folder in Explorer or the terminal;
- manually `cd` and `npm run dev` in every repo;
- check git status and branches one repo at a time.

## The solution

**Dock** brings this into one place: categories, filters, one-click script runs, and a terminal with live logs. Nothing goes to the cloud; no accounts.

What it does:

- **Project list** with the [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) extension in the IDE via `projects.json` — edits on either side are picked up automatically;
- **Categories** in the sidebar with drag-and-drop and optional numeric prefixes (`01. Work`, `02. Personal`);
- **Inspector panel** per project — **Scripts**, **ENV**, and **Packages** tabs:
  - run / stop / restart scripts, favorites, custom order;
  - `.env` with multiple value variants, copy active env, `.env.example` export;
  - dependency version presets in `package.json` with an install prompt after switching;
  - drag-and-drop order for scripts, variables, and packages (saved in Dock only);
- **Git** — branch picker, pull, fetch; status badges in the project list;
- **Integrated terminal** with session tabs and SSE logs;
- **Hide / show** projects without deleting them from `projects.json`;
- **Create** project folders or **clone** repositories;
- **Windows tray** — background server and quick UI open;
- **ru / en** interface;

[Polyglot Keeper](/docs/about/projects/polyglot-keeper) is used inside **Dock** for locale sync.

## Project Manager

The project list lives in `projects.json`, compatible with [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) for VS Code, Cursor, and other editors.

1. Install **Project Manager**.
2. Set **Project Manager: Projects Location** to the folder that contains `projects.json` (e.g. `D:/projects`).
3. Edit the list in **Dock** or in the IDE — changes stay in sync.

Categories in **Dock** map to Project Manager groups.

## Quick start

### Windows

Clone the repository and run:

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
start-win.bat
```

| Command                 | What it does                               |
| :---------------------- | :----------------------------------------- |
| `start-win.bat`         | System tray (builds `Dock.exe` if missing) |
| `start-win.bat console` | Visible server window + browser            |
| `start-win.bat server`  | Node only (used by the tray)               |

UI: `http://127.0.0.1:3848`

### macOS / Linux

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
chmod +x start.sh
./start.sh background
```

Or `npm start` after `npm install`.

### First launch

1. Choose a **workspace folder** (e.g. `~/projects` or `D:\projects`).
2. Point to **projects.json**.
3. Add existing folders or create / clone projects into categories.

## Configuration

Local `dock-config.json` stores paths, UI preferences, and per-project inspector state (script order, ENV / package order, package version presets). Example in the [repository](https://github.com/davidaganov/dock/blob/main/dock-config.example.json).

Changing display order in Dock does not rewrite `.env` or reorder keys in `package.json`. Active ENV values and selected package versions are written to project files when you edit or switch variants.

A project entry in `projects.json`:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "my-app",
  "rootPath": "D:\\projects\\my-app",
  "tags": ["personal"],
  "enabled": true
}
```

## Development

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
npm install
npm start
npm run format
npm run tray:build   # Windows tray
npm run translate    # polyglot-keeper
```
