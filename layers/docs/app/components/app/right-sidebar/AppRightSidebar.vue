<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core"
import AppRightSidebarContent from "@docs/components/app/right-sidebar/AppRightSidebarContent.vue"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import { isChangelogDocsPath } from "@docs/utils/sections"

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

const hideSidebar = computed(() => isChangelogDocsPath(route.path))
</script>

<template>
  <ClientOnly v-if="!hideSidebar">
    <Teleport
      v-if="isLg"
      to="#app-right-sidebar-root"
    >
      <aside
        class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] overflow-hidden"
      >
        <BaseScrollbar height="calc(100vh - var(--ui-header-height))">
          <div class="pb-8">
            <AppRightSidebarContent v-bind="props" />
          </div>
        </BaseScrollbar>
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
