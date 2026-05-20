<script setup lang="ts">
import { useProjectsTop } from "@docs/composables/useProjectsTop"
import { getFirstPathForSection } from "@docs/utils/sections"
import { GITHUB_REPO, SOCIAL_LINKS } from "@base/constants"
import { DOCS_SECTIONS } from "@docs/constants"
import UiLogo from "@ui/components/UiLogo.vue"
import { ROUTE_PATH } from "@base/types"

const PROJECTS_LIMIT = 3
const REPO_URL = `https://github.com/${GITHUB_REPO}`

const localePath = useLocalePath()
const { t } = useI18n()

const { projects, loading } = await useProjectsTop(PROJECTS_LIMIT)

const projectList = computed(() => projects.value ?? [])

const year = computed(() => new Date().getFullYear())

const links = computed(() => [
  {
    label: t("layout.footer.resume"),
    to: ROUTE_PATH.RESUME,
    icon: "i-lucide-file-text"
  },
  {
    label: t("layout.navigation.menu.projects"),
    to: ROUTE_PATH.ABOUT_PROJECTS,
    icon: "i-lucide-folder-kanban"
  },
  {
    label: t("layout.navigation.menu.articles"),
    ariaLabel: t("layout.navigation.aria.articlesAbout"),
    to: ROUTE_PATH.ABOUT_ARTICLES,
    icon: "i-lucide-newspaper"
  }
])

const docsSectionsPreview = computed(() =>
  DOCS_SECTIONS.slice(0, 3).map((section) => ({
    id: section.id,
    icon: section.icon,
    label: t(section.labelKey),
    to: getFirstPathForSection(section)
  }))
)

const repositoryLinkTitle = computed(() => {
  return `${t("layout.footer.repository")} — ${t("layout.footer.repositoryHint")}`
})
</script>

<template>
  <footer class="mt-auto pt-6 lg:pb-8">
    <div
      class="relative mx-auto w-full max-w-5xl border border-black/15 bg-white/20 px-3.5 py-6 shadow-xl backdrop-blur-xl lg:rounded-2xl lg:px-10 dark:border-white/5 dark:bg-white/3"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase dark:text-gray-400"
          >
            {{ $t("layout.footer.main") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="item in links"
              :key="item.to"
            >
              <NuxtLink
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
                :to="localePath(item.to)"
                :aria-label="item.ariaLabel"
              >
                <UIcon
                  aria-hidden="true"
                  class="size-3.5 opacity-55 transition-opacity group-hover:opacity-100"
                  :name="item.icon"
                />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase dark:text-gray-400"
          >
            {{ $t("layout.footer.docSections") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="section in docsSectionsPreview"
              :key="section.id"
            >
              <NuxtLink
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
                :to="localePath(section.to)"
              >
                <UIcon
                  aria-hidden="true"
                  class="size-3.5 opacity-55 transition-opacity group-hover:opacity-100"
                  :name="section.icon"
                />
                <span>{{ section.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase dark:text-gray-400"
          >
            {{ $t("layout.navigation.menu.projects") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="slotIdx in PROJECTS_LIMIT"
              :key="slotIdx"
            >
              <NuxtLink
                v-if="projectList[slotIdx - 1]"
                class="group flex items-center gap-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
                :to="localePath(projectList[slotIdx - 1]!.to)"
              >
                <span class="truncate">{{ projectList[slotIdx - 1]!.title }}</span>
                <div
                  class="flex min-w-8 shrink-0 items-center gap-0.5 text-[10px] text-amber-700 tabular-nums dark:text-amber-400/90"
                  :class="{ invisible: loading }"
                >
                  <UIcon
                    name="i-heroicons-star-20-solid"
                    aria-hidden="true"
                    class="size-3"
                  />
                  <span class="font-bold">{{ projectList[slotIdx - 1]!.stars }}</span>
                </div>
              </NuxtLink>
              <div
                v-else
                class="min-h-8"
                aria-hidden="true"
              />
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase dark:text-gray-400"
          >
            {{ $t("layout.navigation.menu.contacts") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="item in SOCIAL_LINKS"
              :key="item.label"
            >
              <a
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                :href="item.href"
              >
                <UIcon
                  aria-hidden="true"
                  class="size-3.5 opacity-55 transition-opacity group-hover:opacity-100"
                  :name="item.icon"
                />
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-6 sm:flex-row dark:border-white/5"
      >
        <div class="flex items-center gap-4">
          <UiLogo />
          <div
            class="h-6 w-px bg-black/15 dark:bg-white/12"
            aria-hidden="true"
          />
          <span class="pt-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            © {{ year }}
          </span>
        </div>

        <a
          class="group inline-flex min-h-11 items-center gap-2 rounded-full border border-black/8 bg-black/5 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-black/15 hover:bg-black/10 hover:text-gray-950 dark:border-white/12 dark:bg-white/6 dark:text-gray-200 dark:hover:border-white/22 dark:hover:bg-white/12 dark:hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
          :href="REPO_URL"
          :title="repositoryLinkTitle"
        >
          <UIcon
            name="i-simple-icons-github"
            aria-hidden="true"
            class="size-4 opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span>{{ $t("layout.footer.repository") }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            aria-hidden="true"
            class="size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
