---
title: Project architecture
description: How I organize folder structure, components, stores, routing, validation — and why.
icon: i-lucide-layers
publishedAt: 2026-05-10
readingTime: 10 min
languageOriginal: "ru"
tags:
  - Frontend
  - Vue 3
  - Architecture
---

# Project architecture

I have spent a fair amount of time opening other people’s (and my own) projects where 600-line components sat next to API calls right in `onMounted`, and the `components/` folder turned into a dump of 80 files with no structure at all. This article is about how I solved that problem for myself once and for all.

The examples here use Vue 3 — it is simply the easiest way for me to explain things. I apply the same principles in any stack: React, Astro, plain HTML/CSS/JS. The stack changes; the approach does not.

---

## Part I. File system

### Directory structure

Here is the base tree I use in every application:

```
src/
├── assets/
│   ├── fonts/
│   └── styles/
│       ├── lib/         # tailwind.css and other global configs
│       └── main.css
├── components/
│   ├── ui/              # UiButton.vue, UiInput.vue — atomic building blocks
│   ├── base/            # BaseList.vue, BaseCatalog.vue — reusable sections
│   ├── app/             # AppHeader.vue, AppSidebar.vue, AppFooter.vue
│   └── pages/
│       └── products/
│           ├── ProductsPage.vue
│           └── ProductsListSection.vue
├── composables/         # useFilters.ts, usePagination.ts
├── config/              # Constants, magic values, UI configs
├── layouts/
│   └── default.vue
├── router/
│   ├── index.ts
│   └── productsRoutes.ts
├── services/            # API client (more in a separate article)
├── stores/
│   └── products.store.ts
├── types/
│   ├── index.ts
│   └── enums/
├── utils/               # Non-reactive helper functions
├── validation/          # Form validation schemas
│   └── productSchema.ts
└── views/
    └── ProductsView.vue  # Thin wrapper over ProductsPage.vue
```

Each folder here has a single job. No `helpers/` dumping ground, no `components/ProductCard.vue` at the root — only a clear hierarchy.

### Component hierarchy

The most important decision in the whole architecture. I split components into four categories — and mixing them is undesirable.

1. **`ui/` — atomic building blocks.** Minimal logic, no business context. These are reusable primitives that should work anywhere in the app: `UiButton.vue`, `UiInput.vue`, `UiTabs.vue`, `UiModal.vue`. The rule is simple: if a component knows about `Product` or `User`, it is no longer `ui/`.

2. **`base/` — reusable blocks.** Larger components that may contain business logic and compose several `Ui*` components. They are reused across features: `BaseEntityHeader.vue`, `BaseEntityList.vue`, `BaseEntityDrawer.vue`.

3. **`app/` — global layout.** Components that exist as a single instance and form the app shell: `AppHeader.vue`, `AppSidebar.vue`, `AppFooter.vue`.

4. **`pages/[feature]/` — page components.** This is where most of the business logic lives. Each page has its own folder:

```
pages/
└── products/
    ├── ProductsPage.vue        # Main page component
    └── ProductsListSection.vue # Page subsection
```

`*Page.vue` is the control center for the page: it pulls data from the store, passes it to child components, and manages state. This is the first place you look when you need to understand how a page works.

`*Section.vue` / `*Block.vue` / `*List.vue`, etc. are large semantic chunks split out from `Page` so it does not balloon to an unmanageable size.

### Page infrastructure

`views/` (in Vue) and `pages/` (in Nuxt) are page infrastructure: layout wiring, SEO meta, redirects, route params. Everything that makes a page a page — but not what it displays.

```vue [pages/index.vue]
<script setup lang="ts">
import HomePage from "@/components/pages/home/HomePage.vue"

const { t } = useI18n()

useSeoMeta({
  title: t("pages.home.title"),
  description: t("pages.home.description")
})

definePageMeta({
  layout: "home"
})
</script>

<template>
  <HomePage />
</template>
```

Business logic, API calls, feature state — all of that lives in `*Page.vue`. The view only knows what the router and the browser need to know.

---

## Part II. Naming and conventions

Good naming is documentation that writes itself. When you see `UiButton`, it is immediately clear: atomic, no business logic, from `ui/`. When you see `products.store.ts` — it is a store, not a composable, and so on.

### Files

- **Directory prefix in the file name.** A component from `ui/` is `UiButton.vue`. From `base/` — `BaseEntityList.vue`. From `app/` — `AppHeader.vue`. This simplifies navigation in the tree and helps avoid name clashes when searching.
- **Stores:** `[name].store.ts` — I use the `.store.ts` suffix for stores.
- **Composables:** `use[Name].ts` — standard in the Vue ecosystem.
- **Validation schemas:** `Schema` suffix — `productSchema.ts`, `loginSchema.ts`.
- **Routes:** `Routes` suffix — `productsRoutes.ts`, `usersRoutes.ts`.
- **Constants and enum values:** `UPPER_SNAKE_CASE`.

### Templates

- **PascalCase for components.** Always `<UiButton>`, never `<ui-button>`. This is not only convention — it visually separates components from native HTML tags.
- **`props.` prefix when accessing props.** Lets you instantly tell a prop from a local `ref` when reading the template. Sounds minor — but as a component grows, it saves minutes every time.

```vue
<!-- ✅ Correct -->
<div>{{ props.title }}</div>

<!-- ❌ Incorrect -->
<div>{{ title }}</div>
```

- **Handlers via `handle*`.** I never call `emit` or heavy logic inline in the template — only through a named function in `<script setup>`. That is easier to extend, test, and read: the template stays declarative.

```vue
<!-- ✅ Correct -->
<UiButton @click="handleSubmit" />

<!-- ❌ Incorrect -->
<UiButton @click="emit('submit', formData)" />
```

---

## Part III. Inside a component

### Order in `<script setup>`

I stick to a strict order because when every file is structured the same way, your eye finds what it needs instantly.

```vue [components/pages/products/ProductsPage.vue]
<script setup lang="ts">
// 1. Imports (Framework → Stores → Components → Types)
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useProductsStore } from "@/stores/useProductsStore"
import ProductsListSection from "@/components/pages/products/ProductsListSection.vue"
import type { Product } from "@/types"

// 2. Local constants
const PAGE_SIZE = 20

// 3. Props and emits
const props = defineProps<{
  initialFilter?: string
}>()

// 4. Global utilities
const router = useRouter()

// 5. Stores
const productsStore = useProductsStore()

// 6. Reactive state
const searchQuery = ref("")

// 7. Computed
const filteredProducts = computed(() =>
  productsStore.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// 8. Functions
const handleProductClick = (product: Product) => {
  router.push(`/products/${product.id}`)
}

// 9. Lifecycle hooks
onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>
```

> I still have a bit of PTSD about this from Vue 2 Options API, where logic was scattered across `data`, `methods`, `computed`. Composition API does not force an order, but the habit of making the order explicit stuck with me.

---

## Part IV. Tooling

### Routing: split by feature

All routes in one file is a trap. The project grows a little and `router/index.ts` becomes a 300-line wall nobody wants to touch.

I move each feature’s routes into its own file:

```ts [router/productsRoutes.ts]
import type { RouteRecordRaw } from "vue-router"

export const productsRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "/products",
        name: "products",
        component: () => import("@/views/ProductsView.vue")
      },
      {
        path: "/products/:id",
        name: "product-detail",
        component: () => import("@/views/ProductDetailView.vue")
      }
    ]
  }
]
```

And `router/index.ts` simply stitches them together:

```ts [router/index.ts]
import { createRouter, createWebHistory } from "vue-router"
import { productsRoutes } from "@/router/productsRoutes"
import { usersRoutes } from "@/router/usersRoutes"

export const router = createRouter({
  history: createWebHistory(),
  routes: [...productsRoutes, ...usersRoutes]
})
```

Adding a feature is one new file and one line in `index.ts`.

### Stores: Setup Stores only

I use Setup Stores exclusively — not the Options API style. They are closer to composables, type better, and are easier to test.

```ts [stores/useProductsStore.ts]
import { ref } from "vue"
import { defineStore } from "pinia"
import { ApiClient } from "@/services/client"
import type { Product } from "@/types"

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      products.value = await ApiClient.products.getProducts()
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, fetchProducts }
})
```

### Validation: schemas separate from components

When validation lives inside the component, scaling hurts. I move all schemas to `src/validation/` and use `yup` + `vee-validate`.

A schema is always a function, not an object. That lets you use `useI18n()` inside and get translated error messages:

```ts [validation/productSchema.ts]
import { number, object, string } from "yup"

export default function schema() {
  const { t } = useI18n()

  return object({
    name: string().required(t("Name is required")).min(3, t("Minimum 3 characters")),
    price: number().required(t("Price is required")).positive(t("Price must be positive"))
  })
}
```

In the component:

```vue [components/pages/products/ProductsCreateSection.vue]
<script setup lang="ts">
import { useForm } from "vee-validate"
import schema from "@/validation/productSchema"

const { handleSubmit, errors } = useForm({
  validationSchema: schema()
})

const handleCreate = handleSubmit(async (values) => {
  await ApiClient.products.createProduct(values)
})
</script>
```

### Service layer

The API client and how requests are organized is a big topic on its own. In short: everything lives in `services/`, no component talks to `fetch` directly, and typing lives in domain modules. I covered this in detail in [“Clean API client”](/docs/guides/articles/services).

---

## End-to-end example: Products page

Here is how all these layers work together — the full path from route to template.

**1. Route** only knows about `View`:

```ts [router/productsRoutes.ts]
{
  path: "/products",
  name: "products",
  component: () => import("@/views/ProductsView.vue")
}
```

**2. View** — thin wrapper:

```vue [views/ProductsView.vue]
<script setup lang="ts">
import ProductsPage from "@/components/pages/products/ProductsPage.vue"
</script>

<template>
  <ProductsPage />
</template>
```

**3. Page** — control center:

```vue [components/pages/products/ProductsPage.vue]
<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useProductsStore } from "@/stores/useProductsStore"
import AppHeader from "@/components/App/AppHeader.vue"
import ProductsListSection from "@/components/pages/products/ProductsListSection.vue"
import type { Product } from "@/types"

const router = useRouter()
const productsStore = useProductsStore()

const searchQuery = ref("")

const filteredProducts = computed(() =>
  productsStore.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const handleProductClick = (product: Product) => {
  router.push(`/products/${product.id}`)
}

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<template>
  <div>
    <AppHeader />
    <ProductsListSection
      :products="filteredProducts"
      :is-loading="productsStore.isLoading"
      @select="handleProductClick"
    />
  </div>
</template>
```

**4. Section** — display only:

```vue [components/pages/products/ProductsListSection.vue]
<script setup lang="ts">
import type { Product } from "@/types"

const props = defineProps<{
  products: Product[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  select: [product: Product]
}>()

const handleSelect = (product: Product) => {
  emit("select", product)
}
</script>

<template>
  <section>
    <div v-if="props.isLoading">Loading...</div>
    <ul v-else>
      <li
        v-for="product in props.products"
        :key="product.id"
        @click="handleSelect(product)"
      >
        {{ product.name }}
      </li>
    </ul>
  </section>
</template>
```

**5. Store** — all data fetching here:

```ts [stores/useProductsStore.ts]
import { ref } from "vue"
import { defineStore } from "pinia"
import { ApiClient } from "@/services/client"
import type { Product } from "@/types"

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      products.value = await ApiClient.products.getProducts()
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, fetchProducts }
})
```

`Section` does not know about the store. `Page` does not know about `fetch`. `Store` does not know about the router. Each layer only knows its neighbor — that is the core idea.

---

## How does this work in Nuxt?

The approach stays the same — same naming rules, same component hierarchy, same stores. The main difference: `views/` becomes `pages/` and you use file-based routing. The main addition is **Layers**: a way to isolate features or reusable parts into modules. That is a separate article — [“Nuxt 3 Layers”](/docs/guides/articles/nuxt-layers).

---

## Summary

This architecture is not perfect and can feel verbose, but it is flexible and scales well. There are many other approaches: Feature-Sliced Design (FSD), Atomic Design, and so on. They all have merits, but what matters is that the architecture fits you, your team, and the project.

| Layer                         | Role                              |
| ----------------------------- | --------------------------------- |
| `ui/`                         | Atomic reusable primitives        |
| `base/`                       | Larger reusable blocks with logic |
| `pages/[feature]/Page.vue`    | Page control center: data, state  |
| `pages/[feature]/Section.vue` | Visual sub-blocks of the page     |
| `views/`                      | Thin wrappers for the router      |
| `stores/`                     | Reactive state and data fetching  |
| `router/`                     | Routing split by feature          |
| `validation/`                 | Isolated validation schemas       |
| `services/`                   | API client                        |
