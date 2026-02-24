---
title: Working with Layers in Nuxt 3
description: Using Layers in Nuxt 3 for project structuring and site separation
icon: i-lucide-file-text
habrUrl: https://habr.com/ru/articles/830968/
publishedAt: 2025-07-24
readingTime: 3 min
tags:
  - Nuxt
  - Frontend
---

# Working with Layers in Nuxt 3

## Introduction

In this short article, I would like to talk about the concept of Layers in Nuxt 3, how I implement it in my projects, and why I consider it important. I will show two examples: one demonstrating the separation of a project into several layers, and the other—separating several frontends into different layers. The desire to write an article about this arose after I couldn't find enough real-world examples and articles in Russian on using layers.

## The Situation That Led Me to Layers

Initially, I knew about the Layers concept in Nuxt 3 but didn't use it, considering it redundant and not particularly clear. But one day, finding myself digging through a `components` folder that had at least six subfolders, each with 10-30 components, I realized that something had clearly gone wrong. I decided to break my project into several layers, but in a way that avoids dependency of one layer on another. After some time, I arrived at the following structure:

1.  **Base**: This layer contains general site components such as the header, footer, layouts, composables, and utilities used throughout the project, as well as the home page, terms of service page, etc.
2.  **User**: The layer responsible for authentication, user profile, and everything directly related to the user.
3.  **Order**: Everything related to orders on the site: order creation page, user's order list, list of all orders on the site, etc.
4.  **Chat**: The chat page between users. The logic for working with websockets is also implemented in this layer.
5.  **UI**: Due to the overgrown Base layer, the decision was made to move all UI components into a separate layer. This is needed so that 20 components related to forms, modals, and cards do not clutter the base layer, which contains more global parts and pages of the application.

The main advantages I felt when using this approach are, first, the convenience of working on a specific part of the application. If I need to update the authentication, I don't look for components/pages/composables throughout the project; I go to a specific layer and work exclusively in it without affecting the rest. Second, each layer can have its own configuration.

### Project Structure

Below is a minimal working example of the structure and root configuration:

::code-tree{defaultValue="nuxt.config.ts"}

```ts [layers/base/nuxt.config.ts]
export default defineNuxtConfig({})
```

```css [layers/base/assets/styles/main.css]
@import "~/assets/css/tokens.css";
```

```vue [layers/base/components/BaseHeader.vue]
<template>
  <header>Header</header>
</template>
```

```ts [layers/base/composables/useSeo.ts]
export const useSeo = () => useHead({ title: "App" })
```

```vue [layers/base/pages/index.vue]
<template>
  <div>Home</div>
</template>
```

```ts [layers/chat/nuxt.config.ts]
export default defineNuxtConfig({})
```

```vue [layers/chat/pages/index.vue]
<template>
  <div>Chat</div>
</template>
```

```vue [layers/chat/components/ChatMessage.vue]
<template>
  <article>Message</article>
</template>
```

```ts [layers/order/nuxt.config.ts]
export default defineNuxtConfig({})
```

```vue [layers/order/pages/index.vue]
<template>
  <div>Orders</div>
</template>
```

```ts [layers/ui/nuxt.config.ts]
export default defineNuxtConfig({})
```

```vue [layers/ui/components/BaseButton.vue]
<template>
  <button>Button</button>
</template>
```

```ts [layers/user/nuxt.config.ts]
export default defineNuxtConfig({})
```

```vue [layers/user/pages/profile.vue]
<template>
  <div>Profile</div>
</template>
```

```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ["./layers/base", "./layers/ui", "./layers/order", "./layers/user", "./layers/chat"],
  alias: {
    "@": "./",
    "@base": "~/layers/base",
    "@ui": "~/layers/ui",
    "@order": "~/layers/order",
    "@user": "~/layers/user",
    "@chat": "~/layers/chat"
  }
})
```

::

## The Problem I Encountered

If there is a component with the same name in two different layers, only one will be auto-imported. This creates a risk of accidentally naming a component exactly the same as in another layer and not understanding why everything is working incorrectly. In an attempt to find a solution to this problem, I decided to disable auto-import in all layers, but to avoid losing the benefit of auto-import, I created a `global` folder inside the `components` folder in each layer. From there, all components are available for auto-import throughout the application, while components **outside** this folder must be imported directly. To implement such logic, you need to write the following in each internal `nuxt.config.ts`:

```ts [layers/base/nuxt.config.ts]
components: [
  {
    path: "~/layers/base/components/global",
    pathPrefix: false,
    global: true
  }
]
```

## Multiple Sites Based on a Single API

Our team faced the task of making several sites that would access a single API and have common components, composables, and utilities. We decided to implement this through Layers, where each layer is a separate site.  
The structure is as follows:

::code-tree{defaultValue="nuxt.config.ts"}

```ts [composables/useApi.ts]
export const useApi = () => $fetch
```

```vue [components/BaseButton.vue]
<template>
  <button>Base button</button>
</template>
```

```ts [layers/site-1/nuxt.config.ts]
export default defineNuxtConfig({ app: { baseURL: "/site-1" } })
```

```vue [layers/site-1/pages/index.vue]
<template>
  <div>Site 1</div>
</template>
```

```ts [layers/site-2/nuxt.config.ts]
export default defineNuxtConfig({ app: { baseURL: "/site-2" } })
```

```vue [layers/site-2/pages/index.vue]
<template>
  <div>Site 2</div>
</template>
```

```ts [layers/site-3/nuxt.config.ts]
export default defineNuxtConfig({ app: { baseURL: "/site-3" } })
```

```vue [layers/site-3/pages/index.vue]
<template>
  <div>Site 3</div>
</template>
```

```bash [.env]
VITE_NUXT_LAYER=site-1
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ["./layers/" + import.meta.env.VITE_NUXT_LAYER]
})
```

::

In the `.env` file, there is a parameter responsible for the current site, for example, `VITE_NUXT_LAYER=site-1`. Next, in `nuxt.config.ts`, the path to the required layer is formed dynamically.

After this, each developer specifies the site name they need and develops exclusively within one layer without affecting the work of others.

## Conclusion

Using Layers in Nuxt 3 significantly improves the structure and manageability of large projects. Separation into layers helps avoid unnecessary dependencies and facilitates work on individual parts of the application.

**Useful Links**

[Nuxt Layers](https://nuxt.com/docs/getting-started/layers) documentation
