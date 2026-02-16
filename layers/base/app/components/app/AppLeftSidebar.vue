<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import { SOCIAL_LINKS } from "@base/constants"
import { ROUTE_PATH } from "@base/types/enums"

const localePath = useLocalePath()
const route = useRoute()
const { t, locale } = useI18n()

const isProjectsOpen = ref(true)

const nav = computed(() => [
  {
    label: t("layout.sidebar.nav.gettingStarted"),
    to: ROUTE_PATH.GETTING_STARTED,
    icon: "i-lucide-book-open"
  },
  {
    label: t("layout.sidebar.nav.experience"),
    to: ROUTE_PATH.EXPERIENCE,
    icon: "i-lucide-briefcase"
  },
  { label: t("layout.sidebar.nav.stack"), to: ROUTE_PATH.STACK, icon: "i-lucide-layers" }
])

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: projectPages } = await useAsyncData(
  () => `content:${collection.value}:projects:index`,
  async () => {
    return await queryCollection(collection.value)
      .where("path", "LIKE", "/projects/%")
      .select("title", "description", "meta", "path")
      .all()
  },
  {
    watch: [locale]
  }
)

const projects = computed(() => {
  const pages = projectPages.value || []

  return pages
    .filter((p) => typeof p.path === "string" && p.path.startsWith("/projects/"))
    .map((p) => ({
      label: String(p.title || ""),
      description: String(p.description || ""),
      to: String(p.path),
      icon: String((p.meta as { icon?: string } | undefined)?.icon || "i-lucide-folder")
    }))
    .filter((p) => Boolean(p.label))
})
</script>

<template>
  <aside
    class="sticky top-0 hidden h-fit w-64 shrink-0 self-start border-r border-white/5 lg:block"
  >
    <div class="scrollbar-thin scrollbar-thumb-white/10 h-screen overflow-y-auto py-8 pr-4">
      <nav class="space-y-1">
        <NuxtLink
          v-for="item in nav"
          :to="localePath(item.to)"
          class="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
          :class="
            route.path === localePath(item.to) ? 'bg-primary-500/10 text-primary-400' : 'text-muted'
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

      <div class="mt-8">
        <button
          class="text-muted flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-colors hover:text-white"
          @click="isProjectsOpen = !isProjectsOpen"
        >
          <span>{{ $t("layout.sidebar.sections.projects") }}</span>
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
            class="group text-muted hover:border-primary-500/50 flex items-center gap-3 rounded-lg border-l border-transparent px-3 py-2 text-sm transition-all hover:bg-white/5 hover:text-white"
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

      <div class="mt-12 border-t border-white/5 pt-6">
        <div class="text-muted mb-3 px-3 text-xs font-semibold tracking-wider uppercase">
          {{ $t("layout.sidebar.sections.connect") }}
        </div>
        <div class="space-y-1">
          <a
            v-for="link in SOCIAL_LINKS"
            target="_blank"
            rel="noopener noreferrer"
            class="group text-muted flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white"
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
</template>
