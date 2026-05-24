<script setup lang="ts">
import { formatDate } from "@base/utils/date"
import type { RssPostItem } from "@app/types"

const props = defineProps<{
  item: RssPostItem
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const imageFailed = ref(false)

const dateLocale = computed(() => (locale.value === "ru" ? "ru-RU" : "en-US"))
const formattedDate = computed(() => formatDate(props.item.publishedAt, dateLocale.value, "short"))
const to = computed(() => props.item.docPath || props.item.link)

watch(
  () => props.item.imageUrl,
  () => {
    imageFailed.value = false
  }
)
</script>

<template>
  <article
    class="group overflow-hidden rounded-xl border border-black/10 bg-white/30 shadow-sm backdrop-blur-sm transition-colors hover:border-black/15 hover:bg-white/45 dark:border-white/8 dark:bg-white/3 dark:hover:border-white/12 dark:hover:bg-white/5"
  >
    <NuxtLink
      class="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5"
      :to="localePath(to)"
    >
      <div
        v-if="props.item.imageUrl"
        class="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/8 bg-black/5 sm:aspect-4/3 sm:w-36 dark:border-white/8 dark:bg-black/30"
        :class="imageFailed ? 'text-gray-400 dark:text-gray-500' : ''"
      >
        <img
          v-show="!imageFailed"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          :src="props.item.imageUrl"
          :alt="props.item.title"
          @error="imageFailed = true"
        />
        <UIcon
          v-if="imageFailed"
          name="i-lucide-image-off"
          aria-hidden="true"
          class="size-8 opacity-70"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <h3
            class="text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-950 dark:text-white/90 dark:group-hover:text-white"
          >
            {{ props.item.title }}
          </h3>
          <UIcon
            name="i-lucide-arrow-right"
            aria-hidden="true"
            class="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 dark:text-gray-500"
          />
        </div>

        <p
          v-if="props.item.description"
          class="text-muted mt-1.5 line-clamp-2 text-sm"
        >
          {{ props.item.description }}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <time
            v-if="formattedDate"
            class="text-muted inline-flex items-center gap-1 text-xs"
            :datetime="props.item.publishedAt"
          >
            <UIcon
              name="i-lucide-calendar"
              aria-hidden="true"
              class="size-3.5"
            />
            {{ formattedDate }}
          </time>

          <span
            v-for="category in props.item.categories"
            class="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-600 uppercase dark:bg-white/8 dark:text-gray-300"
            :key="category"
          >
            {{ category }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
