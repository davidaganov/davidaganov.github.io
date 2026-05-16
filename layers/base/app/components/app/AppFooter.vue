<script setup lang="ts">
import { DOCS_SECTIONS } from "@docs/config/sections"
import { getFirstPathForSection } from "@docs/utils/sections"
import { SOCIAL_LINKS, GITHUB_REPO } from "@base/constants/config"
import { ROUTE_PATH } from "@base/types/enums/route.enum"
import UiLogo from "@ui/components/UiLogo.vue"

const repoUrl = `https://github.com/${GITHUB_REPO}`

const localePath = useLocalePath()
const { t } = useI18n()

const { projects } = useTopProjects(3)

const year = computed(() => new Date().getFullYear())
const aboutSection = computed(() => DOCS_SECTIONS.find((section) => section.id === "about"))

const docLinks = computed(() => [
  {
    label: t("layout.navigation.sections.overview"),
    to: getFirstPathForSection(aboutSection.value),
    icon: "i-lucide-house"
  },
  {
    label: t("layout.navigation.menu.projects"),
    to: ROUTE_PATH.ABOUT_PROJECTS,
    icon: "i-lucide-folder-kanban"
  },
  {
    label: t("layout.navigation.menu.articles"),
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
</script>

<template>
  <footer class="mt-auto pt-6 lg:pb-8">
    <div
      class="relative mx-auto w-full max-w-5xl border border-black/15 bg-white/20 px-3.5 py-6 shadow-xl backdrop-blur-xl lg:rounded-2xl lg:px-10 dark:border-white/5 dark:bg-white/3"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500"
          >
            {{ $t("layout.footer.main") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="item in docLinks"
              :key="item.to"
            >
              <NuxtLink
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                :to="localePath(item.to)"
              >
                <UIcon
                  :name="item.icon"
                  class="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
                />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500"
          >
            {{ $t("layout.footer.docSections") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="section in docsSectionsPreview"
              :key="section.id"
            >
              <NuxtLink
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                :to="localePath(section.to)"
              >
                <UIcon
                  class="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
                  :name="section.icon"
                />
                <span>{{ section.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div
          v-if="projects.length"
          class="space-y-4"
        >
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500"
          >
            {{ $t("layout.navigation.menu.projects") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="item in projects"
              :key="item.to"
            >
              <NuxtLink
                class="group flex items-center gap-2.5 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                :to="localePath(item.to)"
              >
                <span class="truncate">{{ item.title }}</span>
                <div
                  v-if="item.stars"
                  class="flex items-center gap-0.5 text-[10px] text-yellow-500/80"
                >
                  <UIcon
                    name="i-heroicons-star-20-solid"
                    class="size-3"
                  />
                  <span class="font-bold">{{ item.stars }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3
            class="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500"
          >
            {{ $t("layout.navigation.menu.contacts") }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="item in SOCIAL_LINKS"
              :key="item.label"
            >
              <a
                class="group inline-flex items-center gap-2.5 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                :href="item.href"
              >
                <UIcon
                  class="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
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
          <div class="h-6 w-px bg-black/10 dark:bg-white/10" />
          <span class="pt-0.5 text-xs font-medium text-gray-400 dark:text-gray-500">
            © {{ year }}
          </span>
        </div>

        <a
          class="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-1.5 text-[11px] font-bold text-gray-500 transition-all hover:border-black/10 hover:bg-black/10 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UIcon
            name="i-simple-icons-github"
            class="size-3.5 opacity-70 transition-opacity group-hover:opacity-100"
          />
          <span>{{ $t("layout.footer.repository") }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-3 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
