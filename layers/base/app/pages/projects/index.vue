<script setup lang="ts">
import type { Collections } from "@nuxt/content"

const localePath = useLocalePath()
const { locale } = useI18n()

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: projects } = await useAsyncData(
  () => `content:${collection.value}:projects:list`,
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
</script>

<template>
  <div class="py-8">
    <h1 class="text-2xl font-semibold">
      {{ $t("layout.projectsPage.title") }}
    </h1>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="project in projects || []"
        :to="localePath(String(project.path))"
        class="group rounded-xl border border-white/5 bg-white/3 p-5 transition-colors hover:border-white/10 hover:bg-white/5"
        :key="String(project.path)"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5"
          >
            <UIcon
              class="size-4 opacity-80"
              :name="String((project.meta?.icon as string | undefined) || 'i-lucide-folder')"
            />
          </div>

          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-white">
              {{ project.title }}
            </div>
            <div class="text-muted mt-1 line-clamp-2 text-sm">
              {{ project.description }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div
      v-if="(projects || []).length === 0"
      class="text-muted mt-6 text-sm"
    >
      {{ $t("layout.projectsPage.empty") }}
    </div>
  </div>
</template>
