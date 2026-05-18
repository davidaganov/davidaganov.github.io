<script setup lang="ts">
import { useDocsGraphData } from "@docs/composables/docs/useDocsGraphData"
import AppDocsForceGraph from "@docs/components/App/Docs/AppDocsForceGraph.vue"

const { t } = useI18n()

definePageMeta({
  layout: "default",
  ssr: false
})

useSeoMeta({
  title: () => t("docs.graph.seoTitle"),
  description: () => t("docs.graph.seoDescription")
})

const { data, error, pending } = useDocsGraphData()

const graphFile = computed(() => data.value)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <UAlert
      v-if="error"
      color="warning"
      variant="subtle"
      class="shrink-0 px-2 pt-2 sm:px-0"
      :title="$t('global.status.error')"
      :description="$t('docs.graph.missingJson')"
    />

    <div
      v-else-if="pending"
      class="text-muted flex flex-1 items-center justify-center text-sm"
    >
      {{ $t("global.status.loading") }}
    </div>

    <AppDocsForceGraph
      v-else-if="graphFile"
      :key="graphFile.builtAt"
      :data="graphFile"
    />
  </div>
</template>
