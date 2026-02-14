<script setup lang="ts">
import { SOCIAL_LINKS } from "@base/constants"
import { ROUTE_PATH } from "@base/types/enums"

const localePath = useLocalePath()
const route = useRoute()

// Navigation state
const isProjectsOpen = ref(true)

const nav = [
  { label: "Overview", to: ROUTE_PATH.OVERVIEW, icon: "i-lucide-book-open" },
  { label: "Experience", to: ROUTE_PATH.EXPERIENCE, icon: "i-lucide-briefcase" },
  { label: "Stack", to: ROUTE_PATH.STACK, icon: "i-lucide-layers" }
]

// Mock projects (will be fetched from content later)
const projects = [
  { label: "Portfolio Modern", to: "/projects/portfolio", icon: "i-lucide-layout" },
  { label: "E-Commerce API", to: "/projects/ecommerce", icon: "i-lucide-shopping-cart" },
  { label: "Task Manager", to: "/projects/tasks", icon: "i-lucide-check-square" }
]
</script>

<template>
  <div class="min-h-dvh bg-background-deep text-gray-300 selection:bg-primary-500/30">
    <!-- Header (Glass) -->
    <header
      class="sticky top-0 z-50 border-b border-white/5 bg-background-deep/80 backdrop-blur-xl"
    >
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-bold text-white transition-opacity hover:opacity-80"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10"
          >
            <span class="text-primary-400">D</span>
          </div>
          <span>Portfolio</span>
        </NuxtLink>

        <!-- Search Trigger -->
        <button
          class="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-muted transition-colors hover:border-white/10 hover:bg-white/10"
        >
          <UIcon
            name="i-lucide-search"
            class="h-4 w-4"
          />
          <span>Search...</span>
          <kbd class="hidden rounded bg-black/20 px-1 font-mono text-[10px] sm:inline-block">
            Ctrl K
          </kbd>
        </button>

        <div class="flex items-center gap-2">
          <!-- Mobile Menu Trigger -->
          <ClientOnly>
            <UColorModeButton />
          </ClientOnly>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="flex min-h-[calc(100vh-3.5rem)]">
        <!-- Sidebar (Left) -->
        <aside class="hidden w-64 shrink-0 border-r border-white/5 lg:block">
          <div
            class="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4 scrollbar-thin scrollbar-thumb-white/10"
          >
            <!-- Main Nav -->
            <nav class="space-y-1">
              <NuxtLink
                v-for="item in nav"
                :to="localePath(item.to)"
                class="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
                :class="
                  route.path === localePath(item.to)
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-muted'
                "
                :key="item.to"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    :name="item.icon"
                    class="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100"
                  />
                  <span>{{ item.label }}</span>
                </div>
              </NuxtLink>
            </nav>

            <!-- Projects Section -->
            <div class="mt-8">
              <button
                class="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-white"
                @click="isProjectsOpen = !isProjectsOpen"
              >
                <span>Projects</span>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="!isProjectsOpen && '-rotate-90'"
                />
              </button>

              <div
                v-show="isProjectsOpen"
                v-motion
                :initial="{ opacity: 0, height: 0 }"
                :enter="{ opacity: 1, height: 'auto', transition: { duration: 300 } }"
                class="mt-1 space-y-0.5 overflow-hidden"
              >
                <NuxtLink
                  v-for="project in projects"
                  :to="localePath(project.to)"
                  class="group flex items-center gap-3 rounded-lg border-l border-transparent px-3 py-2 text-sm text-muted transition-all hover:border-primary-500/50 hover:bg-white/5 hover:text-white"
                  :class="route.path.startsWith(project.to) ? 'bg-white/5 text-white' : ''"
                  :key="project.to"
                >
                  <UIcon
                    :name="project.icon"
                    class="h-4 w-4 opacity-70 group-hover:opacity-100"
                  />
                  <span>{{ project.label }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Links (Bottom) -->
            <div class="mt-12 border-t border-white/5 pt-6">
              <div class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                Connect
              </div>
              <div class="space-y-1">
                <a
                  v-for="link in SOCIAL_LINKS"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-white"
                  :href="link.href"
                  :key="link.href"
                >
                  <UIcon
                    :name="link.icon"
                    class="h-4 w-4"
                  />
                  <span>{{ link.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 py-8 lg:pl-8">
          <!-- Glass Panel Background for Content -->
          <div
            class="relative min-h-[50vh] rounded-xl border border-white/5 bg-white/2 p-6 shadow-2xl backdrop-blur-sm lg:p-10"
          >
            <!-- Top gradient line -->
            <div
              class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent"
            />

            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
