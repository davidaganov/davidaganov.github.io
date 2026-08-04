---
title: Dock
description: Локальный хаб для нескольких проектов — npm-скрипты, git и терминал в одном окне. Без аккаунтов и облака, с синхронизацией списка проектов через projects.json и Project Manager в VS Code / Cursor.
icon: i-lucide-folder-kanban
githubRepo: davidaganov/dock
githubUrl: https://github.com/davidaganov/dock
publishedAt: 2026-08-04
tags:
  - инструменты
  - node.js
  - dx
  - open source
---

# Dock

[Dock](https://github.com/davidaganov/dock) — локальный хаб для нескольких проектов — npm-скрипты, git и терминал в одном окне. Без аккаунтов и облака, с синхронизацией списка проектов через projects.json и Project Manager в VS Code / Cursor.

**Проект — это любая папка на диске.**

## Зависимости

- [Node.js](https://nodejs.org/) 18+
- Git (опционально, для pull / fetch / checkout)
- Windows tray: [.NET SDK](https://dotnet.microsoft.com/download) 10+

## Проблема

Когда проектов десятки, постоянно повторяется одно и то же:

- искать нужную папку в проводнике или терминале;
- вручную `cd` и `npm run dev` в каждом репо;
- следить за git-статусом и ветками по одному.

## Решение

**Dock** собирает это в одном месте: категории, фильтры, быстрый запуск скриптов и терминал с логами в реальном времени. Данные не уходят в облако, аккаунты не нужны.

Что умеет:

- **Список проектов** с расширением [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) в IDE через файл `projects.json` — правки с любой стороны подхватываются автоматически;
- **Категории** в сайдбаре с drag-and-drop и опциональными префиксами (`01. Work`, `02. Personal`);
- **One-click** npm / pnpm / yarn скрипты;
- **Встроенный терминал** с вкладками сессий и SSE-логами;
- **Создание** папок для проектов или **клонирование** репозиториев;
- **Windows tray** — сервер в фоне и быстрое открытие UI;

Для синхронизации переводов в самом **Dock** используется [Polyglot Keeper](/docs/about/projects/polyglot-keeper).

## Project Manager

Список проектов хранится в `projects.json` — в формате, совместимом с [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) для VS Code / Cursor и т.д.

1. Установить **Project Manager**.
2. В настройках указать **Project Manager: Projects Location** на папку с `projects.json` (например `D:/projects`).
3. Редактировать список в **Dock** или в IDE — изменения синхронизируются.

Категории в **Dock** соответствуют группам Project Manager.

## Быстрый старт

### Windows

Скачать репозиторий и запустить:

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
start-win.bat
```

| Команда                 | Что делает                                            |
| :---------------------- | :---------------------------------------------------- |
| `start-win.bat`         | Системный трей (соберёт `Dock.exe`, если его ещё нет) |
| `start-win.bat console` | Видимое окно сервера + браузер                        |
| `start-win.bat server`  | Только Node (используется tray)                       |

UI: `http://127.0.0.1:3848`

### macOS / Linux

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
chmod +x start.sh
./start.sh background
```

Или `npm start` после `npm install`.

### Первый запуск

1. Выбрать **рабочую папку** (например `~/projects` или `D:\projects`).
2. Указать путь к **projects.json**.
3. Добавить существующие папки или создать / склонировать проекты в категории.

## Конфигурация

Локальный файл `dock-config.json` хранит пути и настройки UI. Пример — в [репозитории](https://github.com/davidaganov/dock/blob/main/dock-config.example.json).

Запись проекта в `projects.json`:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "my-app",
  "rootPath": "D:\\projects\\my-app",
  "tags": ["personal"],
  "enabled": true
}
```

## Разработка

```bash
git clone https://github.com/davidaganov/dock.git
cd dock
npm install
npm start
npm run format
npm run tray:build   # Windows tray
npm run translate    # polyglot-keeper
```
