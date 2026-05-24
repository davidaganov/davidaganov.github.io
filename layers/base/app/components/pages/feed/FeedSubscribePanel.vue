<script setup lang="ts">
import { getRssReaderSubscribeUrl } from "@app/utils/rss"
import type { RssFeedUrls } from "@app/types"

const props = defineProps<{
  feedUrls: RssFeedUrls
}>()

const { t } = useI18n()

const copied = ref(false)

const primaryFeedUrl = computed(() => props.feedUrls.rss)

const copyFeedUrl = async () => {
  if (!import.meta.client) return

  try {
    await navigator.clipboard.writeText(primaryFeedUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

const readerLinks = computed(() => [
  {
    id: "feedly",
    label: t("pages.feed.readers.feedly"),
    href: getRssReaderSubscribeUrl("feedly", primaryFeedUrl.value)
  },
  {
    id: "inoreader",
    label: t("pages.feed.readers.inoreader"),
    href: getRssReaderSubscribeUrl("inoreader", primaryFeedUrl.value)
  }
])
</script>

<template>
  <section
    class="rounded-2xl border border-black/10 bg-white/25 p-5 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/8 dark:bg-white/4"
  >
    <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {{ $t("pages.feed.whatIsRss") }}
    </p>

    <div class="mt-5 space-y-2">
      <label
        class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400"
        for="feed-url-input"
      >
        {{ $t("pages.feed.feedUrlLabel") }}
      </label>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input
          id="feed-url-input"
          type="url"
          readonly
          class="min-h-11 flex-1 rounded-lg border border-black/10 bg-white/60 px-3 py-2 font-mono text-xs text-gray-800 sm:text-sm dark:border-white/10 dark:bg-black/30 dark:text-gray-100"
          :value="primaryFeedUrl"
        />
        <div class="flex shrink-0 gap-2">
          <UButton
            color="primary"
            variant="solid"
            icon="i-lucide-copy"
            :label="copied ? $t('global.actions.copied') : $t('pages.feed.copy')"
            @click="copyFeedUrl"
          />
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-rss"
            target="_blank"
            rel="noopener noreferrer"
            :label="$t('pages.feed.openXml')"
            :href="primaryFeedUrl"
          />
        </div>
      </div>
    </div>

    <div class="mt-5">
      <p class="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
        {{ $t("pages.feed.addToReader") }}
      </p>
      <div class="mt-2 flex flex-wrap gap-2">
        <UButton
          v-for="reader in readerLinks"
          color="neutral"
          variant="soft"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
          :key="reader.id"
          :label="reader.label"
          :href="reader.href"
        />
      </div>
    </div>
  </section>
</template>
