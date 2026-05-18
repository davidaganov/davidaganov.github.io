<script setup lang="ts">
import { useDocsForceGraph } from "@docs/composables/docs/useDocsForceGraph"
import AppDocsForceGraphSettings from "@docs/components/App/Docs/AppDocsForceGraphSettings.vue"
import type { DocsGraphFile, DocsGraphNode } from "@docs/types"

const props = defineProps<{
  data: DocsGraphFile
}>()

const localePath = useLocalePath()
const router = useRouter()

const containerRef = ref<HTMLDivElement | null>(null)

const attraction = ref(70)
const repulsion = ref(70)
const linkPull = ref(70)
const nodeGap = ref(25)

useDocsForceGraph(
  containerRef,
  toRef(() => props.data),
  {
    attraction,
    repulsion,
    linkPull,
    nodeGap
  },
  (node: DocsGraphNode) => {
    void router.push(localePath(node.id))
  }
)
</script>

<template>
  <div class="relative min-h-[calc(100dvh-9rem)] min-w-0 flex-1 md:min-h-[calc(100dvh-8.5rem)]">
    <div
      ref="containerRef"
      class="force-graph-root h-full min-h-[inherit] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-white/10"
    />

    <AppDocsForceGraphSettings
      v-model:attraction="attraction"
      v-model:repulsion="repulsion"
      v-model:link-pull="linkPull"
      v-model:node-gap="nodeGap"
    />
  </div>
</template>

<style scoped>
.force-graph-root :deep(.force-graph-container) {
  width: 100%;
  height: 100%;
}
</style>
