<script setup lang="ts">
import AppRightSidebarArchiveDownload from "@docs/components/app/right-sidebar/AppRightSidebarArchiveDownload.vue"
import AppRightSidebarArticleMeta from "@docs/components/app/right-sidebar/AppRightSidebarArticleMeta.vue"
import AppRightSidebarGitHubProfile from "@docs/components/app/right-sidebar/AppRightSidebarGitHubProfile.vue"
import AppRightSidebarHabrProfile from "@docs/components/app/right-sidebar/AppRightSidebarHabrProfile.vue"
import AppRightSidebarProjectMeta from "@docs/components/app/right-sidebar/AppRightSidebarProjectMeta.vue"
import AppRightSidebarToc from "@docs/components/app/right-sidebar/AppRightSidebarToc.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import { SOCIAL_LINKS } from "@base/constants/config"

const props = withDefaults(
  defineProps<{
    page?: unknown
    type?: TYPE_PAGE
    main?: boolean
    hideToc?: boolean
  }>(),
  {
    page: undefined,
    type: undefined,
    main: false,
    hideToc: false
  }
)
</script>

<template>
  <div class="space-y-6">
    <AppRightSidebarToc
      v-if="!props.main && !props.hideToc"
      :page="props.page"
    />
    <template v-if="props.main">
      <AppRightSidebarHabrProfile v-if="props.type === TYPE_PAGE.ARTICLE" />
      <AppRightSidebarGitHubProfile
        v-else-if="props.type === TYPE_PAGE.PROJECT || props.type === TYPE_PAGE.STARTER"
      />
    </template>
    <template v-else>
      <AppRightSidebarArticleMeta
        v-if="props.type === TYPE_PAGE.ARTICLE"
        :page="props.page"
      />
      <AppRightSidebarProjectMeta
        v-else-if="props.type === TYPE_PAGE.PROJECT || props.type === TYPE_PAGE.STARTER"
        :page="props.page"
      />
      <AppRightSidebarArchiveDownload />
    </template>

    <div class="border-t border-black/10 pt-4 dark:border-white/10">
      <div class="flex items-center gap-4">
        <a
          v-for="item in SOCIAL_LINKS"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
          :href="item.href"
          :aria-label="item.label"
          :key="item.label"
        >
          <UIcon
            class="size-5"
            :name="item.icon"
          />
        </a>
      </div>
    </div>
  </div>
</template>
