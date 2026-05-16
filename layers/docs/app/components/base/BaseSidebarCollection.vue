<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import type { SidebarCollectionItem } from "@docs/types/sidebar"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import { ROUTE_PATH } from "@base/types/enums"
import UiLink from "@ui/components/UiLink.vue"

const props = defineProps<{
  item: SidebarCollectionItem
}>()

const { locale } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const isOpen = ref(props.item.defaultOpen ?? false)

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
</script>

<template>
  <div v-if="items.length > 0">
    <div class="mb-0.5">
      <UiLink
        v-if="props.item.indexPage ?? true"
        class="w-full"
        :to="props.item.pathPrefix || ''"
        :active="isIndexActive"
      >
        <div class="flex flex-1 items-center gap-3">
          <UIcon
            v-if="item.icon"
            class="size-4 opacity-70 transition-opacity group-hover:opacity-100"
            :name="item.icon"
          />
          <span class="line-clamp-1">{{ $t(item.label) }}</span>
        </div>

        <button
          v-if="item.collapsible"
          type="button"
          class="text-muted flex items-center justify-center transition-colors hover:text-gray-900 dark:hover:text-white"
          @click.prevent.stop="isOpen = !isOpen"
        >
          <UIcon
            name="i-lucide-chevron-down"
            class="size-3.5 transition-transform duration-200"
            :class="!isOpen && '-rotate-90'"
          />
        </button>
      </UiLink>

      <UiLink
        v-else
        class="w-full"
        :active="isOpen"
        @click="item.collapsible && (isOpen = !isOpen)"
      >
        <div class="flex flex-1 items-center gap-3">
          <UIcon
            v-if="item.icon"
            class="size-4 opacity-70 transition-opacity group-hover:opacity-100"
            :name="item.icon"
          />
          <span class="line-clamp-1">{{ $t(item.label) }}</span>
        </div>

        <button
          v-if="item.collapsible"
          type="button"
          class="text-muted flex items-center justify-center transition-colors hover:text-gray-900 dark:hover:text-white"
          @click.stop="isOpen = !isOpen"
        >
          <UIcon
            name="i-lucide-chevron-down"
            class="size-3.5 transition-transform duration-200"
            :class="!isOpen && '-rotate-90'"
          />
        </button>
      </UiLink>
    </div>

    <div
      class="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="isOpen ? 'mt-0.5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'"
    >
      <div class="ml-2 min-h-0 space-y-0.5 overflow-hidden">
        <BaseSidebarLink
          v-for="subItem in items"
          :item="subItem"
          :key="subItem.to"
        />
      </div>
    </div>
  </div>
</template>
