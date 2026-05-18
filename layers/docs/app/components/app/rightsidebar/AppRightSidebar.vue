<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core"
import { isChangelogDocsPath } from "@docs/utils/sections"
import AppRightSidebarContent from "@docs/components/app/rightsidebar/AppRightSidebarContent.vue"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import { TYPE_PAGE } from "@docs/types"

const RIGHT_SIDEBAR_TARGET = "#app-right-sidebar-root"

const props = withDefaults(
  defineProps<{
    page?: unknown
    type?: TYPE_PAGE
    main?: boolean
  }>(),
  {
    page: undefined,
    type: undefined,
    main: false
  }
)

const route = useRoute()

const breakpoints = useBreakpoints({
  lg: 1024
})

const isLg = breakpoints.greater("lg")

const hasTarget = ref(false)

const syncTarget = () => {
  if (!import.meta.client) return
  hasTarget.value = Boolean(document.querySelector(RIGHT_SIDEBAR_TARGET))
}

const hideSidebar = computed(() => isChangelogDocsPath(route.path))
const useTeleport = computed(() => isLg.value && hasTarget.value)

watch(
  () => route.path,
  async () => {
    await nextTick()
    syncTarget()
  }
)

onMounted(async () => {
  await nextTick()
  syncTarget()
})
</script>

<template>
  <ClientOnly v-if="!hideSidebar">
    <Teleport
      v-if="useTeleport"
      defer
      :to="RIGHT_SIDEBAR_TARGET"
    >
      <aside class="sticky top-(--ui-header-height) overflow-x-hidden overflow-y-hidden pt-4">
        <BaseScrollbar
          height="calc(100vh - var(--ui-header-height))"
          class="overflow-x-hidden"
        >
          <div class="pb-8">
            <AppRightSidebarContent v-bind="props" />
          </div>
        </BaseScrollbar>
      </aside>
    </Teleport>

    <aside
      v-else-if="!isLg"
      class="mt-8 lg:hidden"
    >
      <AppRightSidebarContent
        v-bind="props"
        hide-toc
      />
    </aside>
  </ClientOnly>
</template>
