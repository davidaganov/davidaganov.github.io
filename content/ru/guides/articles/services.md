---
title: Чистый API-клиент
description: Практическая архитектура request-слоя, которая избавит ваши компоненты от дублирования кода и хаоса.
icon: i-lucide-book-open
publishedAt: 2026-02-20
readingTime: 5 мин
tags:
  - Frontend
  - Архитектура
  - API
---

# Чистый API-клиент

> Главное правило надежной архитектуры: **слой запросов должен быть самостоятельным модулем**. Он не должен ничего знать про компоненты, страницы или UI-фреймворки.

## Проблема: хаос в компонентах

Когда запросы делаются прямо внутри компонентов, проект очень быстро обрастает техническим долгом. Вы неизбежно столкнетесь со следующими проблемами:

- **Дублирование:** один и тот же endpoint вызывается в нескольких разных файлах.
- **Непоследовательность:** везде разная обработка ошибок и настройки заголовков.
- **Боль при рефакторинге:** при изменении API приходится переписывать половину UI-компонентов.
- **Сложность переиспользования:** логику невозможно перенести в другой проект.

Я избегаю этого с помощью простой и плоской структуры, которая строго разделяет транспорт, домены и точку входа.

---

## Архитектура слоя запросов

### Базовая схема директорий

```bash
/services/
├── request.ts
├── client.ts
└── requests/
    ├── products/
    │   ├── routes.ts
    │   └── index.ts
    └── users/
        ├── routes.ts
        └── index.ts
```

Каждый элемент этой структуры решает строго одну задачу:

| Файл                | Зона ответственности                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `request.ts`        | Низкоуровневый транспорт: fetch/axios, таймауты, нормализация ошибок и заголовки.                  |
| `requests/<domain>` | Доменная логика: эндпоинты (routes.ts) и типизированные методы (index.ts) для конкретной сущности. |
| `client.ts`         | Единый фасад (ApiClient), собирающий все домены в одну удобную точку входа.                        |

### Request-слой (Транспорт)

В `request.ts` лежит универсальная обертка, которая собирает URL с query-параметрами, ставит таймауты и парсит ответы.

Пример реализации:

```ts
// services/request.ts
export const request = {
  get: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PUT", body })
}
```

### Доменные модули

Каждый источник данных живет в своей папке. Например, продукты лежат в `products/`. Мы разделяем сами запросы и пути к ним, чтобы URL не размазывались по коду.

```ts
// products/routes.ts
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

В `index.ts` мы используем эти роуты и наш базовый транспорт, оборачивая всё в строгие типы:

```ts
// products/index.ts
import { request } from "@/services/request"
import { routes } from "./routes"
import type { Product } from "./types"

export const getProducts = async (): Promise<Product[]> => {
  try {
    return await request.get<Product[]>(routes.list())
  } catch (error) {
    // Централизованная обработка или фоллбэк
    return []
  }
}

export const getProduct = async (id: number): Promise<Product | null> => {
  try {
    return await request.get<Product>(routes.byId(id))
  } catch (error) {
    return null
  }
}
```

### Единый API-клиент

Когда модулей становится много, импортировать каждый по отдельности неудобно. Я собираю их в общий клиент:

```ts
// services/client.ts
import * as products from "@/services/requests/products/index"
import * as users from "@/services/requests/users/index"

export const ApiClient = {
  products,
  users
}
```

Теперь у приложения есть предсказуемый и удобный интерфейс доступа к данным: `ApiClient.<домен>.<метод>`.

---

## Как это используется в UI

Посмотрите, насколько чище становится код самого компонента. Он больше не знает про URL, headers, токены и fetch-детали.

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ApiClient } from "@/services/client"

const products = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    products.value = await ApiClient.products.getProducts()
  } finally {
    loading.value = false
  }
})
</script>
```

Компонент занимается только своей прямой задачей — управлением состоянием и отображением данных.

---

## Итог

Такое разделение позволяет не смешивать бизнес-логику и представление. Базового набора из общего `request`, доменных папок и единого `ApiClient` более чем достаточно, чтобы код не расползался и оставался читаемым даже при сильном масштабировании проекта.
