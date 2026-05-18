<script setup lang="ts">
import { useCommandPalette } from "@base/composables/useCommandPalette"
import { useDocsSearch } from "@docs/composables/docs/useDocsSearch"
import { type DocsSearchResult, TYPE_PAGE } from "@docs/types"

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const { isOpen, query, selectedIndex, close, navigateUp, navigateDown, resetSelection } =
  useCommandPalette()

const { flatResults, grouped, isLoading } = useDocsSearch(query)

const LISTBOX_ID = "cmd-results-listbox"
const RESULTS_REGION_ID = "cmd-results-panel"

const categoryLabels: Record<TYPE_PAGE, string> = {
  [TYPE_PAGE.DOCS]: t("layout.navigation.sections.docs"),
  [TYPE_PAGE.ARTICLE]: t("layout.navigation.menu.articles"),
  [TYPE_PAGE.PROJECT]: t("layout.navigation.menu.projects"),
  [TYPE_PAGE.STARTER]: t("layout.navigation.menu.starters")
}

const categoryOrder = [
  TYPE_PAGE.DOCS,
  TYPE_PAGE.ARTICLE,
  TYPE_PAGE.PROJECT,
  TYPE_PAGE.STARTER
] as const

const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const visibleGroups = computed(() =>
  categoryOrder.filter((cat) => (grouped.value[cat]?.length ?? 0) > 0)
)

const globalIndexOf = (result: DocsSearchResult): number => {
  return flatResults.value.indexOf(result)
}

const comboboxExpanded = computed(() => Boolean(query.value.trim()))

const activeDescendantId = computed(() => {
  const q = query.value.trim()
  if (!q || isLoading.value) return undefined
  const list = flatResults.value
  if (!list.length) return undefined
  const current = list[selectedIndex.value]
  if (!current) return undefined
  return `cmd-opt-${globalIndexOf(current)}`
})

const highlightQuery = (text: string): string => {
  if (!query.value.trim()) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="rounded px-0.5 font-medium text-gray-950 ring-1 ring-black/25 bg-amber-200 dark:bg-amber-500/35 dark:text-white dark:ring-white/35">$1</mark>'
  )
}

const selectResult = (result: DocsSearchResult) => {
  router.push(localePath(result.path))
  close()
}

const openDocsGraph = () => {
  router.push(localePath("/docs/graph"))
  close()
}

const onKeydown = (e: KeyboardEvent) => {
  const total = flatResults.value.length
  if (e.key === "ArrowDown") {
    e.preventDefault()
    if (total > 0) {
      navigateDown(total)
      scrollActiveIntoView()
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    if (total > 0) {
      navigateUp(total)
      scrollActiveIntoView()
    }
  } else if (e.key === "Enter") {
    e.preventDefault()
    const current = flatResults.value[selectedIndex.value]
    if (current) selectResult(current)
  }
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    const el = listRef.value?.querySelector("[aria-selected='true']")
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
      :title="$t('components.cmd.title')"
      :description="$t('components.cmd.description')"
      :close="false"
      :ui="{
        overlay: 'bg-black/40 dark:bg-black/80 backdrop-blur-sm',
        content: 'bg-transparent shadow-none',
        header: 'sr-only',
        title: 'sr-only',
        description: 'sr-only'
      }"
    >
      <template #content>
        <div
          class="overflow-hidden bg-white shadow-2xl outline-none dark:bg-black/90 dark:shadow-purple-500/10"
          role="presentation"
          @keydown="onKeydown"
        >
          <label
            class="flex cursor-text items-center gap-3 border-b border-black/5 px-5 py-3.5 dark:border-white/10"
            :for="LISTBOX_ID + '-query'"
          >
            <UIcon
              v-if="!isLoading"
              aria-hidden="true"
              name="i-lucide-search"
              class="size-5 shrink-0 text-gray-600 dark:text-gray-400"
            />
            <UIcon
              v-else
              aria-hidden="true"
              name="i-lucide-loader-circle"
              class="size-5 shrink-0 animate-spin text-gray-600 dark:text-gray-400"
            />
            <input
              v-model="query"
              class="h-9 min-w-0 flex-1 rounded-md bg-transparent px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
              type="text"
              role="combobox"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              aria-haspopup="listbox"
              :aria-label="$t('components.cmd.searchInputLabel')"
              :aria-expanded="comboboxExpanded ? 'true' : 'false'"
              :aria-controls="RESULTS_REGION_ID"
              ref="inputRef"
              :aria-activedescendant="activeDescendantId"
              :placeholder="$t('components.cmd.placeholder')"
              :id="LISTBOX_ID + '-query'"
            />
            <kbd
              aria-hidden="true"
              class="hidden rounded border border-black/15 bg-black/5 px-2 py-1 text-xs text-gray-700 md:inline dark:border-white/25 dark:bg-white/5 dark:text-gray-300"
            >
              ESC
            </kbd>
          </label>

          <div
            class="max-h-[420px] overflow-y-auto scroll-smooth"
            tabindex="-1"
            role="region"
            :aria-label="$t('components.cmd.resultsLabel')"
            ref="listRef"
            :id="RESULTS_REGION_ID"
          >
            <div
              v-if="!query.trim()"
              class="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-command"
                aria-hidden="true"
                class="size-8 text-gray-500"
              />
              <p class="text-sm">
                {{ $t("components.cmd.empty") }}
              </p>
              <UButton
                color="neutral"
                variant="subtle"
                size="sm"
                class="mt-1"
                icon="i-lucide-git-fork"
                :label="$t('docs.graph.openFromPalette')"
                @click="openDocsGraph"
              />
            </div>

            <div
              v-else-if="isLoading"
              class="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-gray-600 dark:text-gray-400"
              role="status"
              aria-live="polite"
            >
              <UIcon
                name="i-lucide-loader-circle"
                aria-hidden="true"
                class="text-primary-500 size-8 animate-spin"
              />
              <p class="text-sm">{{ $t("global.status.loading") }}</p>
            </div>

            <div
              v-else-if="flatResults.length === 0"
              role="status"
              aria-live="polite"
              class="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-search-x"
                aria-hidden="true"
                class="size-8"
              />
              <p class="text-sm">
                {{ $t("components.cmd.noResults") }}
              </p>
            </div>

            <div
              v-else
              class="py-2"
              role="listbox"
              :aria-label="$t('components.cmd.resultsLabel')"
              :aria-busy="false"
              :id="LISTBOX_ID"
            >
              <template
                v-for="cat in visibleGroups"
                :key="cat"
              >
                <h3
                  class="px-4 pt-3 pb-2 text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400"
                >
                  {{ categoryLabels[cat] }}
                </h3>

                <button
                  v-for="result in grouped[cat]"
                  type="button"
                  role="option"
                  class="flex min-h-14 w-full items-start gap-3 px-4 py-2.5 text-left transition-colors outline-none focus-visible:z-10 focus-visible:bg-black/6 dark:focus-visible:bg-white/10"
                  :class="
                    globalIndexOf(result) === selectedIndex
                      ? 'bg-black/8 text-gray-950 dark:bg-white/8 dark:text-white'
                      : 'text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/8'
                  "
                  :aria-selected="globalIndexOf(result) === selectedIndex ? 'true' : 'false'"
                  :data-active="globalIndexOf(result) === selectedIndex"
                  :key="result.path"
                  :id="`cmd-opt-${globalIndexOf(result)}`"
                  @click="selectResult(result)"
                  @mouseenter="selectedIndex = globalIndexOf(result)"
                >
                  <UIcon
                    aria-hidden="true"
                    class="mt-0.5 size-4 shrink-0 text-gray-500 dark:text-gray-400"
                    :name="result.icon"
                  />
                  <span class="min-w-0 flex-1 space-y-0.5">
                    <span class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <template
                        v-for="(crumb, i) in result.breadcrumb.slice(0, -1)"
                        :key="`${result.path}-${i}`"
                      >
                        <span>{{ crumb }}</span>
                        <UIcon
                          v-if="i < result.breadcrumb.slice(0, -1).length - 1"
                          name="i-lucide-chevron-right"
                          aria-hidden="true"
                          class="size-3 shrink-0"
                        />
                      </template>
                    </span>
                    <span
                      v-html="highlightQuery(result.title)"
                      class="truncate text-sm leading-snug font-semibold text-gray-900 dark:text-gray-50"
                    />
                    <span
                      v-if="result.snippet"
                      v-html="highlightQuery(result.snippet)"
                      class="line-clamp-2 text-xs leading-snug text-gray-600 dark:text-gray-400"
                    />
                  </span>
                </button>
              </template>
            </div>
          </div>

          <div
            aria-hidden="true"
            class="hidden items-center justify-between border-t border-black/5 bg-black/3 px-4 py-2 text-xs text-gray-600 md:flex dark:border-white/10 dark:bg-white/6 dark:text-gray-400"
          >
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd
                  class="rounded border border-black/12 bg-black/5 px-1.5 py-0.5 dark:border-white/20 dark:bg-white/10"
                >
                  ↑
                </kbd>
                <kbd
                  class="rounded border border-black/12 bg-black/5 px-1.5 py-0.5 dark:border-white/20 dark:bg-white/10"
                >
                  ↓
                </kbd>
                <span class="ml-1">{{ $t("components.cmd.hints.navigate") }}</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd
                  class="rounded border border-black/12 bg-black/5 px-1.5 py-0.5 dark:border-white/20 dark:bg-white/10"
                >
                  ↵
                </kbd>
                <span class="ml-1">{{ $t("components.cmd.hints.select") }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
