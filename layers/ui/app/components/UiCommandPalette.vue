<script setup lang="ts">
import type { SearchResult } from "@docs/composables/useDocsSearch"
import { TYPE_PAGE } from "@docs/types/enums/page.enum"

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const { isOpen, query, selectedIndex, close, navigateUp, navigateDown, resetSelection } =
  useCommandPalette()

const { flatResults, grouped, isLoading } = useDocsSearch(query)

const categoryLabels: Record<TYPE_PAGE, string> = {
  [TYPE_PAGE.DOCS]: t("commandPalette.categories.docs"),
  [TYPE_PAGE.ARTICLE]: t("commandPalette.categories.articles"),
  [TYPE_PAGE.PROJECT]: t("commandPalette.categories.projects")
}

const categoryOrder = [TYPE_PAGE.DOCS, TYPE_PAGE.ARTICLE, TYPE_PAGE.PROJECT] as const

const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const visibleGroups = computed(() =>
  categoryOrder.filter((cat) => (grouped.value[cat]?.length ?? 0) > 0)
)

const globalIndexOf = (result: SearchResult): number => {
  return flatResults.value.indexOf(result)
}

const highlightQuery = (text: string): string => {
  if (!query.value.trim()) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-primary-500/30 text-primary-300 rounded px-0.5">$1</mark>'
  )
}

const selectResult = (result: SearchResult) => {
  router.push(localePath(result.path))
  close()
}

const onKeydown = (e: KeyboardEvent) => {
  const total = flatResults.value.length
  if (e.key === "ArrowDown") {
    e.preventDefault()
    navigateDown(total)
    scrollActiveIntoView()
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    navigateUp(total)
    scrollActiveIntoView()
  } else if (e.key === "Enter") {
    e.preventDefault()
    const current = flatResults.value[selectedIndex.value]
    if (current) selectResult(current)
  }
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    const el = listRef.value?.querySelector("[data-active='true']")
    el?.scrollIntoView({ block: "nearest" })
  })
}

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
  }
})

watch(query, () => {
  resetSelection()
})
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isOpen"
      class="max-w-2xl"
      :title="$t('commandPalette.title')"
      :description="$t('commandPalette.description')"
      :close="false"
      :ui="{
        overlay: 'bg-black/80 backdrop-blur-sm',
        content: 'bg-transparent shadow-none',
        header: 'sr-only',
        title: 'sr-only',
        description: 'sr-only'
      }"
    >
      <span class="hidden" />

      <template #content>
        <div
          class="overflow-hidden rounded-xl border border-white/10 bg-black/90 shadow-2xl shadow-purple-500/10"
          @keydown="onKeydown"
        >
          <!-- Search Input -->
          <div class="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <UIcon
              v-if="!isLoading"
              name="i-lucide-search"
              class="size-5 shrink-0 text-gray-400"
            />
            <UIcon
              v-else
              name="i-lucide-loader-circle"
              class="size-5 shrink-0 animate-spin text-gray-400"
            />
            <input
              v-model="query"
              type="text"
              class="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              :placeholder="$t('commandPalette.placeholder')"
              ref="inputRef"
            />
            <kbd
              class="hidden rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-gray-400 md:inline"
            >
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div
            class="max-h-[420px] overflow-y-auto"
            ref="listRef"
          >
            <!-- Empty: no query -->
            <div
              v-if="!query.trim()"
              class="flex min-h-[200px] flex-col items-center justify-center gap-2 p-4 text-gray-500"
            >
              <UIcon
                name="i-lucide-command"
                class="size-8"
              />
              <p class="text-sm">
                {{ $t("commandPalette.empty") }}
              </p>
            </div>

            <!-- Empty: query but no results -->
            <div
              v-else-if="!isLoading && flatResults.length === 0"
              class="flex min-h-[200px] flex-col items-center justify-center gap-2 p-4 text-gray-500"
            >
              <UIcon
                name="i-lucide-search-x"
                class="size-8"
              />
              <p class="text-sm">
                {{ $t("commandPalette.noResults") }}
              </p>
            </div>

            <!-- Grouped results -->
            <div
              v-else
              class="py-2"
            >
              <div
                v-for="cat in visibleGroups"
                :key="cat"
              >
                <!-- Category header -->
                <div
                  class="px-4 pt-3 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase"
                >
                  {{ categoryLabels[cat] }}
                </div>

                <!-- Result items -->
                <button
                  v-for="result in grouped[cat]"
                  class="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors"
                  :class="
                    globalIndexOf(result) === selectedIndex
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  "
                  :data-active="globalIndexOf(result) === selectedIndex"
                  :key="result.path"
                  @click="selectResult(result)"
                  @mouseenter="selectedIndex = globalIndexOf(result)"
                >
                  <UIcon
                    :name="result.icon"
                    class="mt-0.5 size-4 shrink-0 text-gray-400"
                  />
                  <div class="min-w-0 flex-1">
                    <!-- Breadcrumb -->
                    <div class="flex items-center gap-1 text-xs text-gray-500">
                      <template
                        v-for="(crumb, i) in result.breadcrumb.slice(0, -1)"
                        :key="i"
                      >
                        <span>{{ crumb }}</span>
                        <UIcon
                          name="i-lucide-chevron-right"
                          class="size-3"
                        />
                      </template>
                    </div>
                    <!-- Title -->
                    <p
                      v-html="highlightQuery(result.title)"
                      class="truncate text-sm font-medium"
                    />
                    <!-- Snippet -->
                    <p
                      v-if="result.snippet"
                      v-html="highlightQuery(result.snippet)"
                      class="mt-0.5 line-clamp-1 text-xs text-gray-500"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="hidden items-center justify-between border-t border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400 md:flex"
          >
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↑</kbd>
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↓</kbd>
                <span class="ml-1">{{ $t("commandPalette.navigate") }}</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↵</kbd>
                <span class="ml-1">{{ $t("commandPalette.select") }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
