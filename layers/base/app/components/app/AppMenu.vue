<script setup lang="ts">
import { useSiteNav } from "@docs/composables/useSiteNav"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarNavList from "@docs/components/base/BaseSidebarNavList.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"
import { ROUTE_PATH } from "@base/types"

const props = defineProps<{
  open: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  close: []
  "update:open": [value: boolean]
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const { flatNavItems } = await useSiteNav()

const quickLinks = computed(() => [
  {
    to: ROUTE_PATH.FEED,
    icon: "i-lucide-rss",
    label: t("layout.footer.rss"),
    title: t("layout.rss.footerLink")
  },
  {
    to: ROUTE_PATH.RESUME,
    icon: "i-lucide-file-text",
    label: t("layout.footer.resume")
  },
  {
    to: ROUTE_PATH.DOCS_GRAPH,
    icon: "i-lucide-git-fork",
    label: t("docs.graph.headerTab"),
    title: t("docs.graph.headerAria")
  }
])

const isOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit("update:open", val)
    if (!val) emit("close")
  }
})

const handleClose = () => {
  isOpen.value = false
}

watch(
  () => route.path,
  () => {
    handleClose()
  }
)
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="right"
    :title="$t('layout.navigation.aria.title')"
    :ui="{
      content: 'max-w-none sm:max-w-md',
      overlay: 'bg-black/80 backdrop-blur-sm pointer-events-auto',
      header:
        'flex items-center justify-between py-5 gap-2 min-h-fit border-b border-black/8 px-4 dark:border-white/8',
      title: 'text-base font-semibold',
      body: 'p-2!',
      close: 'size-8'
    }"
  >
    <template #body>
      <div class="flex h-full flex-col overflow-hidden">
        <div class="min-h-0 flex-1 overflow-hidden px-1 pr-2">
          <BaseScrollbar height="100%">
            <nav
              id="site-nav"
              class="space-y-1 py-3 pb-4"
              :aria-label="$t('layout.navigation.aria.title')"
            >
              <BaseSidebarNavList
                :items="flatNavItems"
                @navigate="handleClose"
              />
            </nav>
          </BaseScrollbar>
        </div>

        <div
          class="mt-auto flex items-center justify-between gap-3 border-t border-black/8 px-4 py-3 dark:border-white/8"
        >
          <div class="flex items-center gap-1">
            <NuxtLink
              v-for="link in quickLinks"
              class="inline-flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/8 dark:hover:text-white"
              :key="link.to"
              :to="localePath(link.to)"
              :title="link.title ?? link.label"
              :aria-label="link.label"
              @click="handleClose"
            >
              <UIcon
                class="size-5"
                aria-hidden="true"
                :name="link.icon"
              />
            </NuxtLink>
          </div>

          <div class="flex items-center gap-2">
            <UiThemeToggle />
            <UiLanguageSwitcher />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
