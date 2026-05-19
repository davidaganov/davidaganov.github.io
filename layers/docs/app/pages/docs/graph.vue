<script setup lang="ts">
import AppGraph from "@docs/components/app/graph/AppGraph.vue"
import type { DocsGraphFile } from "@docs/types"

const { locale, t } = useI18n()

definePageMeta({
  layout: "default"
})

useSeoMeta({
  title: () => t("docs.graph.seoTitle"),
  description: () => t("docs.graph.seoDescription"),
  robots: "noindex, nofollow"
})

const { data, error, pending } = await useAsyncData(
  () => `docs-graph-json:${locale.value}`,
  () => $fetch<DocsGraphFile>(`/api/docs/${locale.value}`),
  { watch: [locale] }
)

const graphFile = computed(() => data.value)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    <UAlert
      v-if="error"
      color="warning"
      variant="subtle"
      class="shrink-0 px-4 pt-4"
      :title="$t('global.status.error')"
      :description="$t('docs.graph.missingJson')"
    />

    <div
      v-else-if="pending"
      class="text-muted flex flex-1 items-center justify-center text-sm"
    >
      {{ $t("global.status.loading") }}
    </div>

    <AppGraph
      v-else-if="graphFile"
      :key="graphFile.builtAt"
      :data="graphFile"
    />
  </div>
</template>
