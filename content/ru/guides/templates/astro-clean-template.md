---
title: Astro Clean Template
description: Шаблон для статических сайтов на Astro. Собирает компоненты в предсказуемые HTML/CSS/JS-файлы — без лишних зависимостей, без бандлера для клиентского кода, без магии.
icon: i-simple-icons-astro
githubRepo: davidaganov/astro-clean-template
githubUrl: https://github.com/davidaganov/astro-clean-template
publishedAt: 2026-03-24
tags:
  - Astro
  - frontend
  - Tools
---

# Astro Clean Template

> Главная цель этого шаблона — получить на выходе **чистый, читаемый и готовый к передаче** код. Полезно для работы с CMS. Без зашифрованных имён классов, склеенных в нечитаемое месиво скриптов и бесконечных хешей в названиях файлов.

## Установка

Развернуть можно через мой инструмент [Stack](/docs/about/projects/stack):

<code-group sync="pm">

```bash [npm]
npx @davidaganov/stack
```

```bash [yarn]
yarn dlx @davidaganov/stack
```

```bash [pnpm]
pnpm dlx @davidaganov/stack
```

```bash [bun]
bunx @davidaganov/stack
```

</code-group>

## Проблема классической сборки

Часто бывает так, что фронтендеру нужно сделать не полноценное SPA со сложной логикой, а просто качественно сверстать сайт (или набор страниц), который потом передадут для интеграции с CMS (Bitrix, WordPress или любой самопис).

Если взять для этой задачи привычный стек (Vue/Nuxt/React/Next), на выходе вы получите папку `dist`, с которой будет невозможно работать:

- **Непредсказуемые хеши** в именах файлов: `main.abc12def.js`
- **Склеенные стили**, которые сложно разделить или точечно переопределить
- **JSX/SFC-компоненты**, которые нельзя просто открыть в браузере и посмотреть

Разработчик открывает результат и не понимает, где именно лежит нужный ему кусок логики, потому что всё собрано в один минифицированный файл. С другой стороны — писать всё на голом HTML в 2026 году или тащить в проект Gulp — это отдельный вид извращения. Хочется иметь компонентный подход, переиспользуемые лейауты и Scoped стили.

## Решение

[Astro Clean Template](https://github.com/davidaganov/astro-clean-template) решает эту проблему. Я взял Astro как идеальный инструмент для **авторинга** (чтобы писать компоненты и лейауты с комфортом), но переписал процесс сборки так, чтобы на выходе получалась классическая, "олдскульная" структура файлов.

::code-tree{defaultValue="dist/index.html"}

```html [dist/index.html]
<!DOCTYPE html>
<html lang="ru">
  <head>
    <link
      rel="stylesheet"
      href="/assets/style/main.css"
    />
  </head>
  <body>
    ...
    <script
      is:inline
      type="module"
      src="/assets/script/main.js"
    ></script>
  </body>
</html>
```

```css [dist/assets/style/main.css]
/* Все стили собираются в один предсказуемый файл */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

```js [dist/assets/script/main.js]
import { initSlider } from "./modules/slider.js"

document.addEventListener("DOMContentLoaded", () => {
  initSlider()
})
```

::

## Как это работает под капотом

### Один CSS-файл без препроцессоров

Все стили агрегируются в один `dist/assets/style/main.css`. Внутри используется нативный CSS с `@import` и встроенным в браузеры нестингом.

```css [src/assets/styles/main.css]
@import "./reset.css";
@import "./variables.css";

.container {
  margin-inline: auto;
  max-width: var(--max-width);

  @media (max-width: 640px) {
    padding-inline: 16px;
  }
}
```

### Стабильные пути к скриптам

Vite по умолчанию пытается собрать и забандлить все ассеты. Я обошел это: скрипты не собираются в общий бандл. Лейаут ссылается на файл как обычно:

```astro [src/layouts/Layout.astro]
<script is:inline type="module" src="/assets/script/main.js"></script>
```

В режиме `build` файлы из `src/assets/script/` просто "как есть" копируются в `dist/`. Это сохраняет структуру модулей, оставляя код удобным для дальнейшей работы. Никаких хешей и минификации.

## Режимы сборки

| Команда              | Что происходит                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`      | Сборка **для передачи**. CSS/JS не минифицируются, HTML не сжимается. Идеально для отладки и интеграции.                      |
| `npm run build:prod` | Сборка **в продакшн**. Всё минифицировано, а `main.js` бандлится через `esbuild` в один компактный файл, импорты разрешаются. |

## Итог

Этот шаблон во многом заменяет тот самый знакомый многим "Gulp + PUG/EJS", объединяя современные технологии для авторинга (Astro, Vite) с максимально предсказуемым и чистым результатом на выходе сборки.

Если в проекте HTML/CSS/JS — это **конечный продукт**, а не промежуточный артефакт, — шаблон сэкономит вам массу времени.
