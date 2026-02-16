<script setup lang="ts">
import type { Collections } from "@nuxt/content"

const localePath = useLocalePath()
const { locale } = useI18n()

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: articles } = await useAsyncData(
  () => `content:${collection.value}:articles:list`,
  async () => {
    return await queryCollection(collection.value)
      .where("path", "LIKE", "%/articles/%")
      .select("title", "description", "meta", "path")
      .all()
  },
  {
    watch: [locale]
  }
)
</script>

<template>
  <div class="py-8">
    <h1 class="text-2xl font-semibold">
      {{ $t("layout.articlesPage.title") }}
    </h1>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="article in articles || []"
        class="group rounded-xl border border-white/5 bg-white/3 p-5 transition-colors hover:border-white/10 hover:bg-white/5"
        :to="localePath(String(article.path))"
        :key="String(article.path)"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5"
          >
            <UIcon
              class="size-4 opacity-80"
              :name="String((article.meta?.icon as string | undefined) || 'i-lucide-file-text')"
            />
          </div>

          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-white">
              {{ article.title }}
            </div>
            <div class="text-muted mt-1 line-clamp-2 text-sm">
              {{ article.description }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div
      v-if="(articles || []).length === 0"
      class="text-muted mt-6 text-sm"
    >
      {{ $t("layout.articlesPage.empty") }}
    </div>
  </div>
</template>
