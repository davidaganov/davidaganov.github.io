<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core"
import { SOCIAL_LINKS } from "@base/constants"
import AppRightSidebarArchiveDownload from "@docs/components/app/rightsidebar/AppRightSidebarArchiveDownload.vue"
import AppRightSidebarArticleMeta from "@docs/components/app/rightsidebar/AppRightSidebarArticleMeta.vue"
import AppRightSidebarGitHubProfile from "@docs/components/app/rightsidebar/AppRightSidebarGitHubProfile.vue"
import AppRightSidebarHabrProfile from "@docs/components/app/rightsidebar/AppRightSidebarHabrProfile.vue"
import AppRightSidebarProjectMeta from "@docs/components/app/rightsidebar/AppRightSidebarProjectMeta.vue"
import AppRightSidebarToc from "@docs/components/app/rightsidebar/AppRightSidebarToc.vue"
import { TYPE_PAGE } from "@docs/types"

const SCROLL_TOP_THRESHOLD_PX = 300

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

const { y } = useWindowScroll()

const isScrollShown = computed(() => !import.meta.server && y.value >= SCROLL_TOP_THRESHOLD_PX)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
</script>

<template>
  <div class="space-y-6">
    <AppRightSidebarToc
      v-if="!props.main && !props.hideToc"
      v-motion
      :page="props.page"
      :initial="{ opacity: 0 }"
      :enter="{
        opacity: 1,
        transition: { duration: 400, delay: 200, ease: [0.16, 1, 0.3, 1] }
      }"
    />
    <template v-if="props.main">
      <AppRightSidebarHabrProfile
        v-if="props.type === TYPE_PAGE.ARTICLE"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{
          opacity: 1,
          transition: { duration: 400, delay: 300, ease: [0.16, 1, 0.3, 1] }
        }"
      />
      <AppRightSidebarGitHubProfile
        v-else-if="props.type === TYPE_PAGE.PROJECT || props.type === TYPE_PAGE.STARTER"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{
          opacity: 1,
          transition: { duration: 400, delay: 300, ease: [0.16, 1, 0.3, 1] }
        }"
      />
    </template>
    <template v-else>
      <div
        v-motion
        class="space-y-6"
        :initial="{ opacity: 0 }"
        :enter="{
          opacity: 1,
          transition: { duration: 400, delay: 300, ease: [0.16, 1, 0.3, 1] }
        }"
      >
        <AppRightSidebarArticleMeta
          v-if="props.type === TYPE_PAGE.ARTICLE"
          :page="props.page"
        />
        <AppRightSidebarProjectMeta
          v-else-if="props.type === TYPE_PAGE.PROJECT || props.type === TYPE_PAGE.STARTER"
          :page="props.page"
        />
        <AppRightSidebarArchiveDownload />
      </div>
    </template>

    <div
      v-motion
      class="border-t border-black/10 pt-4 dark:border-white/10"
      :initial="{ opacity: 0, y: 10 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 400, delay: 400, ease: [0.16, 1, 0.3, 1] }
      }"
    >
      <div class="flex items-start gap-4">
        <a
          v-for="(item, index) in SOCIAL_LINKS"
          v-motion
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
          :href="item.href"
          :aria-label="item.label"
          :initial="{ opacity: 0, scale: 0.8 }"
          :enter="{
            opacity: 1,
            scale: 1,
            transition: { delay: 500 + index * 50 }
          }"
          :key="item.label"
        >
          <UIcon
            class="size-5"
            :name="item.icon"
          />
        </a>

        <button
          v-if="isScrollShown"
          type="button"
          class="ml-auto text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
          @click="scrollToTop"
        >
          <UIcon
            name="i-lucide-arrow-up"
            class="size-5"
          />
        </button>
      </div>
    </div>
  </div>
</template>
