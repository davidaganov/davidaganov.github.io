---
title: Архитектура проекта
description: Как я организую структуру папок, компоненты, стор, роутинг, валидацию — и почему именно так.
icon: i-lucide-layers
publishedAt: 2026-05-10
languageOriginal: "ru"
tags:
  - frontend
  - Vue 3
  - Архитектура
---

# Архитектура проекта

Я потратил немало времени, открывая чужие (и свои собственные) проекты, где компоненты на 600 строк соседствовали с запросами к API прямо в `onMounted`, а папка `components/` превратилась в свалку из 80 файлов без какой-либо структуры. Эта статья про то, как я решил эту проблему для себя раз и навсегда.

Примеры здесь на Vue 3 — это просто способ, которым мне удобнее всего объяснять. Сами принципы я применяю в любом стеке: React, Astro, ванильный HTML/CSS/JS. Стек меняется, подход — нет.

---

## Часть I. Файловая система

### Структура директорий

Вот базовое дерево, которое я использую в каждом приложении:

```
src/
├── assets/
│   ├── fonts/
│   └── styles/
│       ├── lib/         # tailwind.css и другие глобальные конфиги
│       └── main.css
├── components/
│   ├── ui/              # UiButton.vue, UiInput.vue — атомарные кирпичики
│   ├── base/            # BaseList.vue, BaseCatalog.vue — переиспользуемые секции
│   ├── app/             # AppHeader.vue, AppSidebar.vue, AppFooter.vue
│   └── pages/
│       └── products/
│           ├── ProductsPage.vue
│           └── ProductsListSection.vue
├── composables/         # useFilters.ts, usePagination.ts
├── config/              # Константы, магические значения, UI-конфиги
├── layouts/
│   └── default.vue
├── router/
│   ├── index.ts
│   └── productsRoutes.ts
├── services/            # API-клиент (подробнее — в отдельной статье)
├── stores/
│   └── products.store.ts
├── types/
│   ├── index.ts
│   └── enums/
├── utils/               # Нереактивные вспомогательные функции
├── validation/          # Схемы валидации для форм
│   └── productSchema.ts
└── views/
    └── ProductsView.vue  # Тонкая обёртка над ProductsPage.vue
```

Каждая папка здесь решает одну задачу. Никакой папки `helpers/` куда валится всё подряд, никакого `components/ProductCard.vue` в корне — только понятная иерархия.

### Иерархия компонентов

Самое важное решение во всей архитектуре. Я делю компоненты на четыре категории — и смешивать их нежелательно.

1. **`ui/` — атомарные кирпичики.** Минимальная логика, никакого бизнес-контекста. Это переиспользуемые примитивы, которые должны работать в любом месте приложения: `UiButton.vue`, `UiInput.vue`, `UiTabs.vue`, `UiModal.vue`. Правило простое: если компонент знает про `Product` или `User` — он уже не `ui/`.

2. **`base/` — переиспользуемые блоки.** Более крупные компоненты, которые могут содержать бизнес-логику и собирать в себе несколько `Ui*`-компонентов. Они переиспользуются между разными фичами: `BaseEntityHeader.vue`, `BaseEntityList.vue`, `BaseEntityDrawer.vue`.

3. **`app/` — глобальный лейаут.** Компоненты, которые существуют в единственном экземпляре и формируют скелет приложения: `AppHeader.vue`, `AppSidebar.vue`, `AppFooter.vue`.

4. **`pages/[feature]/` — компоненты страниц.** Вот где сосредоточена основная бизнес-логика. Каждая страница — своя папка:

```
pages/
└── products/
    ├── ProductsPage.vue        # Главный компонент страницы
    └── ProductsListSection.vue # Подсекция страницы
```

`*Page.vue` — это центр управления страницей: он получает данные через стор, распределяет их по дочерним компонентам и управляет состоянием. Именно сюда смотришь в первую очередь, когда нужно разобраться, как работает та или иная страница.

`*Section.vue` / `*Block.vue` / `*List.vue` и т.д. — это крупные смысловые блоки, которые выделяются из `Page`, чтобы не раздувать его до неуправляемых размеров.

### Инфраструктура страницы

`views/` (в Vue) и `pages/` (в Nuxt) — инфраструктура страницы: подключение лейаута, SEO-мета, редиректы, роутинг-параметры. Всё, что делает страницу страницей — но не то, что она показывает.

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

Бизнес-логика, запросы к API, состояние фичи — всё это уходит в `*Page.vue`. View знает только то, что нужно знать роутеру и браузеру.

---

## Часть II. Нейминг и соглашения

Хорошее именование — это документация, которая пишет сама себя. Когда видишь `UiButton`, сразу понятно: атомарный, без бизнес-логики, из `ui/`. Когда видишь `products.store.ts` — стор, не composable и т.д.

### Файлы

- **Префикс директории в имени файла.** Компонент из `ui/` — `UiButton.vue`. Из `base/` — `BaseEntityList.vue`. Из `app/` — `AppHeader.vue`. Это упрощает навигацию по файловой структуре и помогает избежать конфликтов имён при поиске.
- **Сторы:** `[name].store.ts` — использую суффикс `.store.ts` при создании сторов.
- **Composables:** `use[Name].ts` — стандарт Vue-экосистемы.
- **Схемы валидации:** суффикс `Schema` — `productSchema.ts`, `loginSchema.ts`.
- **Роуты:** суффикс `Routes` — `productsRoutes.ts`, `usersRoutes.ts`.
- **Константы и enum-значения:** `UPPER_SNAKE_CASE`.

### Шаблоны

- **PascalCase для компонентов.** Всегда `<UiButton>`, никогда `<ui-button>`. Это не только конвенция — это способ визуально отделить компоненты от нативных HTML-тегов.
- **Префикс `props.` при обращении к пропсам.** Позволяет мгновенно отличить пропс от локального `ref` при чтении шаблона. Звучит как мелочь — но когда компонент разрастается, это экономит минуты каждый раз.

```vue
<!-- ✅ Правильно -->
<div>{{ props.title }}</div>

<!-- ❌ Неправильно -->
<div>{{ title }}</div>
```

- **Обработчики через `handle*`.** Никогда не вызываю `emit` или сложную логику напрямую в шаблоне — только через именованную функцию в `<script setup>`. Это легче расширять, тестировать и читать: шаблон остаётся декларативным.

```vue
<!-- ✅ Правильно -->
<UiButton @click="handleSubmit" />

<!-- ❌ Неправильно -->
<UiButton @click="emit('submit', formData)" />
```

---

## Часть III. Внутри компонента

### Порядок в `<script setup>`

Я придерживаюсь строгого порядка, потому что когда все файлы устроены одинаково, глаз мгновенно находит нужное место.

```vue [components/pages/products/ProductsPage.vue]
<script setup lang="ts">
// 1. Импорты (Фреймворк → Сторы → Компоненты → Типы)
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useProductsStore } from "@/stores/useProductsStore"
import ProductsListSection from "@/components/pages/products/ProductsListSection.vue"
import type { Product } from "@/types"

// 2. Локальные константы
const PAGE_SIZE = 20

// 3. Props и Emits
const props = defineProps<{
  initialFilter?: string
}>()

// 4. Глобальные утилиты
const router = useRouter()

// 5. Сторы
const productsStore = useProductsStore()

// 6. Реактивное состояние
const searchQuery = ref("")

// 7. Computed
const filteredProducts = computed(() =>
  productsStore.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// 8. Функции
const handleProductClick = (product: Product) => {
  router.push(`/products/${product.id}`)
}

// 9. Хуки жизненного цикла
onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>
```

> У меня остался некий ПТСР на эту тему из-за Vue 2 Options API, где логика была раскидана по разным секциям — `data`, `methods`, `computed`. Composition API к этому не обязывает, но привычка явно обозначать порядок осталась.

---

## Часть IV. Инструменты

### Роутинг: разбиваем по фичам

Все роуты в одном файле — это ловушка. Проект чуть вырастает, и `router/index.ts` превращается в простыню на 300 строк, в которой никто не хочет разбираться.

Я выношу роуты каждой фичи в отдельный файл:

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

А `router/index.ts` просто собирает их вместе:

```ts [router/index.ts]
import { createRouter, createWebHistory } from "vue-router"
import { productsRoutes } from "@/router/productsRoutes"
import { usersRoutes } from "@/router/usersRoutes"

export const router = createRouter({
  history: createWebHistory(),
  routes: [...productsRoutes, ...usersRoutes]
})
```

Добавление новой фичи — это создание одного файла и одна строчка в `index.ts`.

### Сторы: только Setup Stores

Я использую исключительно Setup Stores — не Options API-вариант. Они ближе к composables, лучше типизируются и проще тестируются.

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

### Валидация: схемы отдельно от компонентов

Когда валидация живёт прямо в компоненте — это боль при масштабировании. Я выношу все схемы в `src/validation/` и использую `yup` + `vee-validate`.

Схема — это всегда функция, а не объект. Это позволяет использовать `useI18n()` внутри и получать переведённые сообщения об ошибках:

```ts [validation/productSchema.ts]
import { number, object, string } from "yup"

export default function schema() {
  const { t } = useI18n()

  return object({
    name: string().required(t("Название обязательно")).min(3, t("Минимум 3 символа")),
    price: number().required(t("Цена обязательна")).positive(t("Цена должна быть положительной"))
  })
}
```

В компоненте:

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

### Сервисный слой

API-клиент и организация запросов — отдельная большая тема. Если коротко: всё живёт в `services/`, ни один компонент не знает про `fetch` напрямую, а вся типизация сосредоточена в доменных модулях. Подробно я разобрал это в статье [«Чистый API-клиент»](/docs/guides/articles/services).

---

## Сквозной пример: страница Products

Посмотрим, как все эти слои работают вместе — полный путь от роута до шаблона.

**1. Роут** знает только про `View`:

```ts [router/productsRoutes.ts]
{
  path: "/products",
  name: "products",
  component: () => import("@/views/ProductsView.vue")
}
```

**2. View** — тонкая обёртка:

```vue [views/ProductsView.vue]
<script setup lang="ts">
import ProductsPage from "@/components/pages/products/ProductsPage.vue"
</script>

<template>
  <ProductsPage />
</template>
```

**3. Page** — центр управления страницей:

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

**4. Section** — отвечает только за отображение:

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
    <div v-if="props.isLoading">Загрузка...</div>
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

**5. Store** — весь data-fetching здесь:

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

`Section` не знает про стор. `Page` не знает про `fetch`. `Store` не знает про роутер. Каждый слой знает только о соседнем — это и есть главная идея.

---

## А как это работает в Nuxt?

Подход остаётся тем же — те же правила нейминга, та же иерархия компонентов, те же сторы. Основное отличие: `views/` переименовывается в `pages/` и используется файловый роутинг. Главное дополнение — **Layers**: способ выделять фичи или переиспользуемые части в изолированные модули. Это тема отдельной статьи — [«Nuxt 3 Layers»](/docs/guides/articles/nuxt-layers).

---

## Итог

Эта архитектура не идеальна, может показаться чересчур многословной, но зато она очень гибкая и масштабируемая. Есть множество иных подходов: Feature Slice Design (FSD), Atomic Design и т.п. Все они хороши по-своему, но главное — чтобы архитектура подходила именно вам/вашей команде и проекту.

| Слой                          | Задача                                        |
| ----------------------------- | --------------------------------------------- |
| `ui/`                         | Атомарные переиспользуемые примитивы          |
| `base/`                       | Крупные переиспользуемые блоки с логикой      |
| `pages/[feature]/Page.vue`    | Центр управления страницей: данные, состояние |
| `pages/[feature]/Section.vue` | Визуальные подблоки страницы                  |
| `views/`                      | Тонкие обёртки для роутера                    |
| `stores/`                     | Реактивное состояние и data-fetching          |
| `router/`                     | Разбитый по фичам роутинг                     |
| `validation/`                 | Изолированные схемы валидации                 |
| `services/`                   | API-клиент                                    |
