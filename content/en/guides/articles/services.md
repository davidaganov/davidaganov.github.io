---
title: Clean API Client
description: Practical request-layer architecture that will rid your components of code duplication and chaos.
icon: i-lucide-book-open
publishedAt: 2026-02-20
readingTime: 5 min
tags:
  - Frontend
  - Architecture
  - API
---

# Clean API Client

> The main rule of reliable architecture: **the request layer must be a self-contained module**. It should know nothing about components, pages, or UI frameworks.

## The Problem: Chaos in Components

When requests are made directly inside components, the project quickly accumulates technical debt. You will inevitably face the following problems:

- **Duplication:** the same endpoint is called in several different files.
- **Inconsistency:** different error handling and header settings everywhere.
- **Refactoring Pain:** when the API changes, you have to rewrite half of the UI components.
- **Difficulty of Reuse:** logic cannot be moved to another project.

I avoid this using a simple and flat structure that strictly separates transport, domains, and the entry point.

---

## Request Layer Architecture

### Basic Directory Structure

::code-tree{defaultValue="services/client.ts"}

```ts [services/request.ts]
export const request = {
  get: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PUT", body })
}
```

```ts [services/requests/products/routes.ts]
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

```ts [services/requests/products/index.ts]
import { request } from "@/services/request"
import { routes } from "./routes"
import type { Product } from "./types"

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

```ts [services/requests/users/routes.ts]
export const routes = {
  me: () => `/users/me`
}
```

```ts [services/requests/users/index.ts]
import { request } from "@/services/request"
import { routes } from "./routes"
import type { User } from "./types"

export const getCurrentUser = () => request.get<User>(routes.me())
```

```ts [services/client.ts]
import * as products from "@/services/requests/products/index"
import * as users from "@/services/requests/users/index"

export const ApiClient = {
  products,
  users
}
```

::

Each element of this structure solves exactly one task:

| File                | Responsibility                                                                          |
| ------------------- | --------------------------------------------------------------------------------------- |
| `request.ts`        | Low-level transport: fetch/axios, timeouts, error normalization, and headers.           |
| `requests/<domain>` | Domain logic: endpoints (routes.ts) and typed methods (index.ts) for a specific entity. |
| `client.ts`         | A single facade (ApiClient) that collects all domains into one convenient entry point.  |

### Request Layer (Transport)

Inside `request.ts` lies a universal wrapper that builds URLs with query parameters, sets timeouts, and parses responses.

Implementation example:

```ts [services/request.ts]
export const request = {
  get: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PUT", body })
}
```

### Domain Modules

Each data source lives in its own folder. For example, products are in `products/`. We separate the requests themselves from their paths so that URLs aren't scattered throughout the code.

```ts [services/requests/products/routes.ts]
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

In `index.ts`, we use these routes and our base transport, wrapping everything in strict types:

```ts [services/requests/products/index.ts]
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

### Single API Client

When there are many modules, importing each one individually becomes inconvenient. I collect them into a shared client:

```ts [services/client.ts]
import * as products from "@/services/requests/products/index"
import * as users from "@/services/requests/users/index"

export const ApiClient = {
  products,
  users
}
```

Now the application has a predictable and convenient data access interface: `ApiClient.<domain>.<method>`.

---

## How it's used in the UI

See how much cleaner the component's code becomes. It no longer knows about URLs, headers, tokens, and fetch details.

```vue [app/components/ProductList.vue]
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

The component only handles its direct task — state management and data display.

---

## Conclusion

This separation allows you to avoid mixing business logic and representation. A basic set consisting of a shared `request`, domain folders, and a single `ApiClient` is more than enough to prevent code sprawl and keep it readable even as the project scales significantly.
