<script setup lang="ts">
import { useBreakpoints } from "@vueuse/core"
import AppRightSidebarArticleMeta from "@docs/components/app/AppRightSidebarArticleMeta.vue"
import AppRightSidebarGitHubProfile from "@docs/components/app/AppRightSidebarGitHubProfile.vue"
import AppRightSidebarHabrProfile from "@docs/components/app/AppRightSidebarHabrProfile.vue"
import AppRightSidebarProjectMeta from "@docs/components/app/AppRightSidebarProjectMeta.vue"
import AppRightSidebarToc from "@docs/components/app/AppRightSidebarToc.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import { SOCIAL_LINKS } from "@base/constants/config"

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
      <aside class="sticky top-29 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 lg:pb-14">
        <div class="space-y-6">
          <AppRightSidebarToc
            v-if="!props.main"
            :page="props.page"
          />
          <template v-if="props.main">
            <AppRightSidebarHabrProfile v-if="props.type === TYPE_PAGE.ARTICLE" />
            <AppRightSidebarGitHubProfile v-if="props.type === TYPE_PAGE.PROJECT" />
          </template>
          <template v-else>
            <AppRightSidebarArticleMeta
              v-if="props.type === TYPE_PAGE.ARTICLE"
              :page="props.page"
            />
            <AppRightSidebarProjectMeta
              v-else-if="props.type === TYPE_PAGE.PROJECT"
              :page="props.page"
            />
          </template>

          <div class="border-t border-white/10 pt-4">
            <div class="flex items-center gap-4">
              <a
                v-for="item in SOCIAL_LINKS"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 transition-colors hover:text-white"
                :href="item.href"
                :aria-label="item.label"
                :key="item.label"
              >
                <UIcon
                  :name="item.icon"
                  class="size-5"
                />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </Teleport>

    <aside
      v-else
      class="mt-8 space-y-6 lg:hidden"
    >
      <template v-if="props.main">
        <AppRightSidebarHabrProfile v-if="props.type === TYPE_PAGE.ARTICLE" />
        <AppRightSidebarGitHubProfile v-if="props.type === TYPE_PAGE.PROJECT" />
      </template>

      <template v-else>
        <AppRightSidebarArticleMeta
          v-if="props.type === TYPE_PAGE.ARTICLE"
          :page="props.page"
        />

        <AppRightSidebarProjectMeta
          v-else-if="props.type === TYPE_PAGE.PROJECT"
          :page="props.page"
        />
      </template>

      <div class="border-t border-white/10 pt-4">
        <div class="flex items-center gap-4">
          <a
            v-for="item in SOCIAL_LINKS"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 transition-colors hover:text-white"
            :href="item.href"
            :aria-label="item.label"
            :key="item.label"
          >
            <UIcon
              :name="item.icon"
              class="size-5"
            />
          </a>
        </div>
      </div>
    </aside>
  </ClientOnly>
</template>
