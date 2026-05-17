<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import UiLink from "@ui/components/UiLink.vue"
import { ROUTE_PATH } from "@base/types/enums"
import type { SidebarCollectionItem } from "@docs/types/sidebar"

const props = defineProps<{
  item: SidebarCollectionItem
}>()

const { locale, t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const isOpen = ref(props.item.defaultOpen ?? false)

const submenuPanelId = `docs-sidebar-submenu-${useId()}`
const submenuLabel = computed(() => t(props.item.label))

const expandableLabel = computed(() =>
  t("layout.a11y.toggleDocsSubgroup", { title: submenuLabel.value })
)

const submenuVisible = computed(() => !props.item.collapsible || isOpen.value)

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: pages } = useAsyncData(
  () => `sidebar:collection:${props.item.source}:${props.item.pathPrefix || ""}:${locale.value}`,
  async () => {
    const pathPrefix = props.item.pathPrefix || ROUTE_PATH.HOME
    const queryPrefix = getQueryPrefix(pathPrefix)

    return await queryCollection(collection.value)
      .where("path", "LIKE", `%${queryPrefix}%`)
      .select("title", "description", "meta", "path")
      .all()
  },
  {
    watch: [locale]
  }
)

const items = computed(() => {
  const list = pages.value || []
  const pathPrefix = props.item.pathPrefix || ROUTE_PATH.DOCS
  const queryPrefix = getQueryPrefix(pathPrefix)

  return list
    .filter((p) => {
      if (typeof p.path !== "string" || !p.path.includes(queryPrefix)) return false
      const hidden = Boolean((p.meta as { navigation?: boolean } | undefined)?.navigation === false)
      return !hidden
    })
    .sort((left, right) => {
      const leftMeta = (left.meta as { order?: number } | undefined) || {}
      const rightMeta = (right.meta as { order?: number } | undefined) || {}

      const leftOrder =
        typeof leftMeta.order === "number" ? leftMeta.order : Number.MAX_SAFE_INTEGER
      const rightOrder =
        typeof rightMeta.order === "number" ? rightMeta.order : Number.MAX_SAFE_INTEGER

      if (leftOrder !== rightOrder) return leftOrder - rightOrder

      const leftTitle = String(left.title || "")
      const rightTitle = String(right.title || "")
      return leftTitle.localeCompare(rightTitle)
    })
    .map((p) => {
      const relativePath = getRelativePath(String(p.path), queryPrefix)
      const fullPath = pathPrefix + relativePath

      return {
        type: "link" as const,
        label: String(p.title || ""),
        description: String(p.description || ""),
        to: fullPath,
        icon: String(
          (p.meta as { icon?: string } | undefined)?.icon ||
            props.item.itemIcon ||
            "i-lucide-file-text"
        ),
        translate: false
      }
    })
    .filter((p) => Boolean(p.label))
})

const isIndexActive = computed(() => {
  return (props.item.indexPage ?? true) && route.path === localePath(props.item.pathPrefix || "")
})

const toggleOpen = () => {
  if (props.item.collapsible) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div v-if="items.length > 0">
    <template v-if="props.item.indexPage ?? true">
      <div class="flex w-full items-stretch gap-1">
        <UiLink
          class="min-w-0 flex-1 items-center"
          :to="props.item.pathPrefix || ''"
          :active="isIndexActive"
          :aria-label="item.ariaLabelKey ? t(item.ariaLabelKey) : undefined"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <UIcon
              v-if="item.icon"
              class="size-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
              :name="item.icon"
            />
            <span class="line-clamp-1">{{ $t(item.label) }}</span>
          </div>
        </UiLink>

        <UiLink
          v-if="item.collapsible"
          is-icon
          :active="isIndexActive"
          :aria-expanded="isOpen"
          :aria-controls="submenuPanelId"
          :aria-label="expandableLabel"
          @click.prevent.stop="toggleOpen"
        >
          <UIcon
            name="i-lucide-chevron-down"
            class="size-4.5 opacity-70 transition-[transform,opacity] duration-200 group-hover:opacity-100"
            aria-hidden="true"
            :class="item.collapsible && !isOpen ? '-rotate-90' : 'rotate-0'"
          />
        </UiLink>
      </div>
    </template>

    <button
      v-else-if="props.item.collapsible"
      type="button"
      class="text-muted mb-0.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
      :class="isOpen ? 'text-primary-700 dark:text-primary-400' : ''"
      :aria-expanded="isOpen"
      :aria-controls="submenuPanelId"
      :aria-label="expandableLabel"
      @click="toggleOpen"
    >
      <UIcon
        v-if="item.icon"
        class="size-4 shrink-0 opacity-70 transition-opacity hover:opacity-100"
        aria-hidden="true"
        :name="item.icon"
      />
      <span class="line-clamp-1 flex-1 text-left">{{ $t(item.label) }}</span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-3.5 shrink-0 transition-transform duration-200"
        aria-hidden="true"
        :class="!isOpen && '-rotate-90'"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="submenuVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      :id="submenuPanelId"
    >
      <div class="ml-2 min-h-0 space-y-0.5 overflow-hidden p-1">
        <BaseSidebarLink
          v-for="subItem in items"
          :item="subItem"
          :key="subItem.to"
        />
      </div>
    </div>
  </div>
</template>
