---
title: Как я строю слой запросов
description: Практическая структура request-слоя, которую я использую в разных проектах.
icon: i-lucide-book-open
publishedAt: 2026-02-20
readingTime: 5 мин
tags:
  - Frontend
  - Архитектура
  - API
---

# Как я строю слой запросов

Главная мысль: **слой запросов должен быть самостоятельным модулем**, который не знает ничего про компоненты, страницы и UI.

## Задача, которую решает такой подход

Когда запросы разбросаны по компонентам, очень быстро начинается хаос:

- везде разная обработка ошибок
- один и тот же endpoint дублируется в разных файлах
- сложно переиспользовать логику между проектами

Я стараюсь этого избегать через простую и плоскую структуру.

## Структура

### Базовая схема

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

Здесь есть три уровня:

1. `request.ts` — низкоуровневый транспорт (GET/POST/PUT и т.д.)
2. `requests/*` — доменные модули (`products`, `users`, `orders`)
3. `client.ts` — единая точка входа (`ApiClient`)

### Request-слой

В `request.ts` лежит универсальная функция `apiRequest`, которая:

- собирает URL с query-параметрами
- ставит timeout
- нормализует ошибки
- возвращает либо JSON, либо text

Пример из проекта:

```ts
export const request = {
  get: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PUT", body })
}
```

### Доменные запросы по папкам

Дальше каждый источник данных живёт отдельно. Например, `products/index.ts`:

```ts
// products/index.ts
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await request.get<Product[]>(routes.list())
  } catch {
    return []
  }
}

export const getProduct = async (id: number): Promise<Product | null> => {
  try {
    return await request.get<Product>(routes.byId(id))
  } catch {
    return null
  }
}
```

Отдельно там же лежит `routes.ts`, чтобы URL не размазывались по коду.

```ts
// products/routes.ts
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

### Единый API-клиент

Когда модулей становится несколько, собираю их в общий клиент:

```ts
import * as products from "@/services/requests/products/index"
import * as users from "@/services/requests/users/index"

export const ApiClient = {
  products,
  users
}
```

Это даёт предсказуемую точку входа: `ApiClient.<domain>.<method>`.

## Как это используется в UI

Пример использования в компоненте:

```ts
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
```

Компонент не знает про URL, headers и `fetch`-детали. Он работает только с доменным методом.

## Минимальный набор

Если нужен стабильный и переиспользуемый слой запросов, то минимальный набор такой:

1. общий `request` с единым поведением
2. папки `requests/<domain>` с методами под конкретную сущность
3. единый `ApiClient` как публичный API для приложения

Когда проект растёт, это разделение позволяет не смешивать бизнес-логику и представление.
Этого уже достаточно, чтобы код не расползался и оставался читаемым даже по мере роста проекта.
