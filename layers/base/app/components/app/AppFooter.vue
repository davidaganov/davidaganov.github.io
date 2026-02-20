<script setup lang="ts">
import { DOCS_SECTIONS } from "@docs/config/sections"
import { getFirstPathForSection } from "@docs/utils/sections"
import { SOCIAL_LINKS } from "@base/constants/config"
import { ROUTE_PATH } from "@base/types/enums/route.enum"
import UiDivider from "@ui/components/UiDivider.vue"
import UiLogo from "@ui/components/UiLogo.vue"

const localePath = useLocalePath()
const { t } = useI18n()

const { projects } = useTopProjects(3)

const year = computed(() => new Date().getFullYear())
const aboutSection = computed(() => DOCS_SECTIONS.find((section) => section.id === "about"))

const docLinks = computed(() => [
  {
    label: t("nav.overview"),
    to: getFirstPathForSection(aboutSection.value),
    icon: "i-lucide-house"
  },
  {
    label: t("nav.projects"),
    to: ROUTE_PATH.ABOUT_PROJECTS,
    icon: "i-lucide-folder-kanban"
  },
  {
    label: t("nav.articles"),
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
  <footer class="w-full">
    <div class="relative">
      <div class="absolute right-0 left-0 z-1 mx-auto flex -translate-y-1/2 justify-center">
        <UiLogo :short="true" />
      </div>

      <UiDivider />
    </div>

    <nav class="relative container py-10">
      <div class="flex flex-row flex-wrap gap-12 md:max-w-1/2 md:justify-between md:gap-20">
        <div>
          <h3 class="text-xs font-semibold tracking-wider text-gray-200 uppercase">
            {{ $t("footer.main") }}
          </h3>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="item in docLinks"
              :key="item.to"
            >
              <NuxtLink
                class="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                :to="localePath(item.to)"
              >
                <UIcon
                  :name="item.icon"
                  class="size-4"
                />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-semibold tracking-wider text-gray-200 uppercase">
            {{ $t("footer.docSections") }}
          </h3>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="section in docsSectionsPreview"
              :key="section.id"
            >
              <NuxtLink
                class="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                :to="localePath(section.to)"
              >
                <UIcon
                  :name="section.icon"
                  class="size-4"
                />
                <span>{{ section.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="projects.length">
          <h3 class="text-xs font-semibold tracking-wider text-gray-200 uppercase">
            {{ $t("nav.projects") }}
          </h3>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="item in projects"
              :key="item.to"
            >
              <NuxtLink
                class="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                :to="localePath(item.to)"
              >
                <span>{{ item.title }}</span>
                <span
                  v-if="item.stars"
                  class="inline-flex items-center gap-1 text-xs text-gray-500"
                >
                  <UIcon
                    name="i-heroicons-star-20-solid mb-0.5"
                    class="size-3"
                  />
                  {{ item.stars }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-semibold tracking-wider text-gray-200 uppercase">
            {{ $t("nav.contacts") }}
          </h3>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="item in SOCIAL_LINKS"
              :key="item.label"
            >
              <a
                class="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                :href="item.href"
              >
                <UIcon
                  class="size-4"
                  :name="item.icon"
                />
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="relative">
      <UiDivider />
    </div>

    <div class="relative container my-6">
      <div
        class="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>© {{ year }} David Aganov</div>

        <a
          class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          href="https://github.com/davidaganov/davidaganov.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UIcon
            name="i-lucide-github"
            class="size-4 opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span>{{ $t("footer.repository") }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4 opacity-60"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
