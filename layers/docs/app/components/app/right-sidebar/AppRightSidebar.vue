<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core"
import AppRightSidebarContent from "@docs/components/app/right-sidebar/AppRightSidebarContent.vue"
import { TYPE_PAGE } from "@docs/types/enums"

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

const breakpoints = useBreakpoints({
  lg: 1024
})

const isLg = breakpoints.greater("lg")
</script>

<template>
  <ClientOnly>
    <Teleport
      v-if="isLg"
      to="#app-right-sidebar-root"
    >
      <aside
        class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] overflow-y-auto pb-8"
      >
        <AppRightSidebarContent v-bind="props" />
      </aside>
    </Teleport>

    <aside
      v-else
      class="mt-8 lg:hidden"
    >
      <AppRightSidebarContent
        v-bind="props"
        hide-toc
      />
    </aside>
  </ClientOnly>
</template>
