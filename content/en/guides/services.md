---
title: How I Build the Request Layer
description: A practical request-layer structure I use across different projects.
icon: i-lucide-book-open
publishedAt: 2026-02-20
readingTime: 5 min
tags:
  - Frontend
  - Architecture
  - API
---

# How I Build the Request Layer

The key idea: **the request layer should be a standalone module** that knows nothing about components, pages, or UI.

## What problem this approach solves

When requests are scattered across components, chaos starts very quickly:

- error handling differs everywhere
- the same endpoint gets duplicated across multiple files
- logic becomes hard to reuse between projects

I avoid this with a simple, flat structure.

## Structure

### Basic scheme

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

There are three levels here:

1. `request.ts` — low-level transport (GET/POST/PUT, etc.)
2. `requests/*` — domain modules (`products`, `users`, `orders`)
3. `client.ts` — a single entry point (`ApiClient`)

### Request layer

`request.ts` contains a universal `apiRequest` function that:

- builds URLs with query params
- applies a timeout
- normalizes errors
- returns either JSON or text

Example from a project:

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

### Domain requests by folders

Then each data source lives separately. For example, `products/index.ts`:

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

`routes.ts` sits alongside it so URLs are not spread across the codebase.

```ts
// products/routes.ts
export const routes = {
  list: () => `/products`,
  byId: (id: number) => `/products/${id}`
}
```

### Unified API client

When modules become more than one, I combine them into a shared client:

```ts
import * as products from "@/services/requests/products/index"
import * as users from "@/services/requests/users/index"

export const ApiClient = {
  products,
  users
}
```

This gives a predictable entry point: `ApiClient.<domain>.<method>`.

## How this is used in UI

Example usage in a component:

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

The component knows nothing about URLs, headers, or `fetch` details. It only works with a domain method.

## Minimal set

If you need a stable and reusable request layer, the minimum set is:

1. shared `request` with unified behavior
2. `requests/&​lt;domain&​gt;` folders with methods for each entity
3. unified `ApiClient` as the app’s public API

As the project grows, this split helps keep business logic separate from presentation.
This alone is enough to keep code from spreading out and to preserve readability as the project scales.
