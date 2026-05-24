<script setup lang="ts">
import FeedPostCard from "@base/components/pages/feed/FeedPostCard.vue"
import FeedSubscribePanel from "@base/components/pages/feed/FeedSubscribePanel.vue"
import type { RssFeedPageData } from "@app/types"
import { ROUTE_PATH } from "@base/types"

const localePath = useLocalePath()
const { locale } = useI18n()

const selectedCategory = ref<string | null>(null)

const loadFeedData = (): Promise<RssFeedPageData> =>
  $fetch<RssFeedPageData>(`/api/feed-page/${locale.value}`)

const { data, pending, error } = await useAsyncData(
  () => `feed-page-${locale.value}`,
  () => loadFeedData(),
  {
    watch: [() => locale.value],
    getCachedData: (key, nuxtApp) => {
      const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
      return cached && typeof cached === "object" ? (cached as RssFeedPageData) : undefined
    }
  }
)

const categories = computed(() => data.value?.categories ?? [])
const hasError = computed(() => Boolean(error.value) || (!pending.value && !data.value))

const filteredItems = computed(() => {
  const items = data.value?.items ?? []
  if (!selectedCategory.value) return items
  return items.filter((item) => item.categories?.includes(selectedCategory.value!))
})

const selectCategory = (category: string | null) => {
  selectedCategory.value = category
}
</script>

<template>
  <article class="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-14 lg:pb-16">
    <header class="space-y-4 border-b border-black/10 pb-4 dark:border-white/10">
      <div class="flex flex-col items-start gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300"
          >
            <UIcon
              name="i-lucide-rss"
              aria-hidden="true"
              class="size-5"
            />
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {{ $t("pages.feed.heading") }}
          </h1>
        </div>
        <p
          v-if="data?.channel.description"
          class="text-base leading-relaxed text-gray-600 dark:text-gray-300"
        >
          {{ data.channel.description }}
        </p>
      </div>
    </header>

    <div
      v-if="pending"
      class="py-16 text-center text-sm text-gray-500 dark:text-gray-400"
    >
      {{ $t("global.status.loading") }}
    </div>

    <div
      v-else-if="hasError"
      class="py-16 text-center text-sm text-red-600 dark:text-red-400"
    >
      {{ $t("global.status.error") }}
    </div>

    <template v-else-if="data">
      <FeedSubscribePanel
        class="mt-4"
        :feed-urls="data.feedUrls"
      />

      <section class="mt-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
            {{ $t("pages.feed.recentPosts") }}
          </h2>
          <NuxtLink
            class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
            :to="localePath(ROUTE_PATH.DOCS)"
          >
            {{ $t("pages.feed.viewAllDocs") }}
            <UIcon
              name="i-lucide-arrow-right"
              aria-hidden="true"
              class="size-4"
            />
          </NuxtLink>
        </div>

        <div
          v-if="categories.length"
          class="mt-6 flex flex-wrap items-center gap-2"
          role="group"
          :aria-label="$t('pages.feed.filterLabel')"
        >
          <button
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            :class="
              selectedCategory === null
                ? 'bg-primary-200/60 text-primary-800 dark:bg-primary-500/25 dark:text-primary-200'
                : 'bg-black/5 text-gray-600 hover:bg-black/8 dark:bg-white/8 dark:text-gray-300'
            "
            @click="selectCategory(null)"
          >
            {{ $t("global.labels.all") }}
          </button>
          <button
            v-for="category in categories"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            :class="
              selectedCategory === category
                ? 'bg-primary-200/60 text-primary-800 dark:bg-primary-500/25 dark:text-primary-200'
                : 'bg-black/5 text-gray-600 hover:bg-black/8 dark:bg-white/8 dark:text-gray-300'
            "
            :key="category"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>

        <p
          v-if="!filteredItems.length"
          class="text-muted mt-8 text-center text-sm"
        >
          {{ $t("pages.feed.emptyFiltered") }}
        </p>

        <ul
          v-else
          class="mt-6 space-y-4"
        >
          <li
            v-for="item in filteredItems"
            :key="item.guid"
          >
            <FeedPostCard :item="item" />
          </li>
        </ul>

        <p class="text-muted mt-8 text-center text-xs">
          {{ $t("pages.feed.updatesNote") }}
        </p>
      </section>
    </template>
  </article>
</template>
