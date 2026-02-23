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

In this short article, I would like to talk about the concept of Layers in Nuxt 3, how I implement it in my projects, and why I consider it important. I will show two examples: one demonstrating the division of a project into several layers, and the other – the separation of multiple frontends into different layers. The desire to write an article about this arose after I couldn't find enough real-world examples and articles in Russian on using layers.

## The situation that led me to Layers

Initially, I knew about the Layers concept in Nuxt 3, but I didn't use it, considering it redundant and not particularly clear. But one day, finding myself digging through a `components` folder that had no fewer than six subfolders, each with 10-30 components, I realized that something had clearly gone wrong. I decided to break my project into several layers, but in a way that avoids one layer depending on another. After some time, I arrived at this structure:

1.  **Base**: This layer contains common site components such as the header, footer, layouts, composables, and utilities used throughout the project, as well as the home page, user agreement page, etc.
2.  **User**: The layer responsible for authorization, user profile, and everything directly related to the user.
3.  **Order**: Everything related to orders on the site: order creation page, user order list, list of all orders on the site, etc.
4.  **Chat**: Chat page between users. The logic for working with WebSockets is also implemented in this layer.
5.  **UI**: Due to the overgrown Base layer, the decision was made to move all UI components to a separate layer. It is needed so that 20 components related to forms, modals, and cards do not clutter the base layer, which contains more global parts and pages of the application.

The main advantages I experienced using this approach are, firstly, the convenience of working on a specific part of the application. If I need to update authorization, I don't search for components/pages/composables throughout the project, but go to a specific layer and work exclusively within it, without touching the others. Secondly, each layer can have its own configuration.

### Project structure

```
├──layers/
|   ├──base/
│   |   ├── assets/
│   |   |   ├── fonts/
│   |   |   └── styles/
│   |   ├── components/
│   |   ├── composables/
│   |   ├── pages/
│   |   ├── stores/
│   |   ├── utils/
│   |   └── nuxt.config.ts
|   ├──chat/
│   |   ├── components/
│   |   ├── composables/
│   |   ├── pages/
│   |   ├── stores/
│   |   └── nuxt.config.ts
|   ├──order/
│   |   ├── components/
│   |   ├── pages/
│   |   └── stores/
|   ├──ui/
│   |   ├── components/
│   |   └── nuxt.config.ts
|   └──user/
│       ├── components/
│       ├── composables/
│       ├── pages/
│       ├── stores/
│       └── nuxt.config.ts
├── app.vue
└── nuxt.config.ts
```

In the main `nuxt.config.ts` file, I have the following:

```typescript
extends: [
  "./layers/base",
  "./layers/ui",
  "./layers/order",
  "./layers/user",
  "./layers/chat"
],
// Исключительно для удобства при импортировании
alias: {
  "@": "./",
  "@base": "~/layers/base",
  "@ui": "~/layers/ui",
  "@order": "~/layers/order",
  "@user": "~/layers/user",
  "@chat": "~/layers/chat"
}
```

## The problem I encountered

If two different layers have a component with the same name, only one will be auto-imported. This creates a risk of accidentally naming a component exactly the same as in another layer and not understanding why everything is working incorrectly. In an attempt to find a solution to the problem, I decided to disable auto-import in all layers, but in order not to lose the benefit of using auto-import, I created a `global` folder inside the `components` folder in each layer. From it, all components are available for auto-import throughout the application, while components **outside** this folder must be imported directly. To implement such logic, the following must be written in each internal `nuxt.config.ts`:

```typescript
components: [
  {
    path: "~/layers/base/components/global",
    pathPrefix: false,
    global: true
  }
]
```

## Multiple sites based on a single API

Our team was faced with the task of creating several sites that would access one API and share common components, composables, and utilities. We decided to implement this through Layers, where each layer is a separate site.  
The structure is as follows:

```
├── composables/
├── components/
├── services/
├── layers/
│   ├── site-1/
│   ├── site-2/
│   └── site-3/
```

In the `.env` file, there is a parameter responsible for the current site, for example `VITE_NUXT_LAYER=site-1`. It is needed to specify the path to the required site in `nuxt.config.ts`:

```typescript
extends: ["./layers/" + import.meta.env.VITE_NUXT_LAYER]
```

After this, each developer specifies the site name they need and works exclusively within one layer without affecting the work of others.

## Conclusion

Using Layers in Nuxt 3 significantly improves the structure and manageability of large projects. Separating into layers helps avoid unnecessary dependencies and simplifies work on individual parts of the application.

**Useful links**

[Layers Nuxt](https://nuxt.com/docs/getting-started/layers) documentation
