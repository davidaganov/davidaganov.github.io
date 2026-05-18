<script setup lang="ts">
import { useDocsForceGraph } from "@docs/composables/docs/useDocsForceGraph"
import AppGraphSettings from "@docs/components/app/graph/AppGraphSettings.vue"
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
const labelFade = ref(100)
const nodeSize = ref(50)
const linkThickness = ref(50)

useDocsForceGraph(
  containerRef,
  toRef(() => props.data),
  {
    attraction,
    repulsion,
    linkPull,
    nodeGap,
    labelFade,
    nodeSize,
    linkThickness
  },
  (node: DocsGraphNode) => {
    void router.push(localePath(node.id))
  }
)
</script>

<template>
  <div class="relative h-[calc(100dvh-var(--ui-header-height,7rem))] min-h-0 min-w-0 flex-1">
    <div
      ref="containerRef"
      class="force-graph-root h-full w-full overflow-hidden"
    />

    <AppGraphSettings
      v-model:attraction="attraction"
      v-model:repulsion="repulsion"
      v-model:link-pull="linkPull"
      v-model:node-gap="nodeGap"
      v-model:label-fade="labelFade"
      v-model:node-size="nodeSize"
      v-model:link-thickness="linkThickness"
    />
  </div>
</template>

<style scoped>
.force-graph-root :deep(.force-graph-container) {
  width: 100%;
  height: 100%;
}
</style>
