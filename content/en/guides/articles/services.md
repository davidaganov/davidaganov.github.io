---
title: Clean API Client
description: A request-layer architecture that frees components from duplicated code.
icon: i-lucide-book-open
publishedAt: 2026-02-20
readingTime: 5 min
languageOriginal: "ru"
tags:
  - Frontend
  - Architecture
  - API
---

# Clean API Client

> The main rule of reliable architecture: **the request layer must be an independent module**. It should know nothing about components, pages, or UI frameworks.

## The Problem: Chaos in Components

When requests are made directly inside components, the project accumulates technical debt very quickly. You'll inevitably run into these problems:

- **Duplication:** the same endpoint is called across multiple different files.
- **Inconsistency:** error handling and header configuration differ everywhere.
- **Painful refactoring:** when the API changes, you have to rewrite half the UI components.
- **Poor reusability:** the logic can't be moved to another project.

I avoid this with a simple, flat structure that strictly separates transport, domains, and the entry point.

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

Each element in this structure has exactly one responsibility:

| File                | Responsibility                                                                          |
| ------------------- | --------------------------------------------------------------------------------------- |
| `request.ts`        | Low-level transport: fetch/axios, timeouts, error normalization, and headers.           |
| `requests/<domain>` | Domain logic: endpoints (routes.ts) and typed methods (index.ts) for a specific entity. |
| `client.ts`         | A single facade (ApiClient) that assembles all domains into one convenient entry point. |

### Request Layer (Transport)

`request.ts` contains a universal wrapper that assembles URLs with query parameters, sets timeouts, and parses responses.

Example implementation:

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

Each data source lives in its own folder. For example, products reside in `products/`. We separate the requests themselves from their paths so that URLs don't spread throughout the code.

```ts [services/requests/products/routes.ts]
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

In `index.ts` we use these routes and our base transport, wrapping everything in strict types:

```ts [services/requests/products/index.ts]
import { request } from "@/services/request"
import { routes } from "./routes"
import type { Product } from "./types"

export const getProducts = async (): Promise<Product[]> => {
  try {
    return await request.get<Product[]>(routes.list())
  } catch (error) {
    // Centralized handling or fallback
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

### Unified API Client

When there are many modules, importing each one individually becomes inconvenient. I assemble them into a shared client:

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

## How It's Used in the UI

See how much cleaner the component code becomes. It no longer knows anything about URLs, headers, tokens, or fetch internals.

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

The component only deals with its direct responsibility — managing state and rendering data.

---

## Conclusion

This separation prevents mixing business logic with presentation. The basic set of a shared `request`, domain folders, and a single `ApiClient` is more than enough to keep the code from spreading and remain readable even as the project scales significantly.
