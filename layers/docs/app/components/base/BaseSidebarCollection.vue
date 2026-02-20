<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import type { SidebarCollectionItem } from "@docs/types/sidebar"
import { ROUTE_PATH } from "@base/types/enums"

const props = defineProps<{
  item: SidebarCollectionItem
}>()

const { locale } = useI18n()

const localePath = useLocalePath()
const route = useRoute()

const isOpen = ref(props.item.defaultOpen ?? false)

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const getQueryPrefix = (pathPrefix: string) => {
  if (pathPrefix.startsWith(ROUTE_PATH.DOCS)) {
    return pathPrefix.replace(/^\/docs\/[^/]+/, "") || ROUTE_PATH.HOME
  }

  return pathPrefix
}

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
      const relativePath = String(p.path).split(queryPrefix).pop() || ""
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
</script>

<template>
  <div v-if="items.length > 0">
    <div class="flex items-center justify-between px-3 py-2">
      <NuxtLink
        v-if="props.item.indexPage !== false"
        class="flex items-center justify-between rounded-lg text-sm font-medium transition-all hover:text-white"
        :class="
          route.path === localePath(props.item.pathPrefix || '') ? 'text-primary-400' : 'text-muted'
        "
        :to="localePath(props.item.pathPrefix || '')"
      >
        <div class="flex items-center gap-3">
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-4"
          />
          <span class="line-clamp-1">{{ $t(item.label) }}</span>
        </div>
      </NuxtLink>
      <button
        v-else
        type="button"
        class="text-muted flex items-center justify-between rounded-lg text-sm font-medium transition-all hover:text-white"
        @click="item.collapsible && (isOpen = !isOpen)"
      >
        <div class="flex items-center gap-3">
          <UIcon
            v-if="item.icon"
            class="size-4"
            :name="item.icon"
          />
          <span class="line-clamp-1">{{ $t(item.label) }}</span>
        </div>
      </button>
      <button
        v-if="item.collapsible"
        class="text-muted flex flex-1 justify-end transition-colors hover:text-white"
        @click="isOpen = !isOpen"
      >
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 transition-transform duration-200"
          :class="!isOpen && '-rotate-90'"
        />
      </button>
    </div>

    <div
      v-show="isOpen"
      v-motion
      class="mb-1 ml-2 space-y-0.5 overflow-hidden"
      :initial="{ opacity: 0, height: 0 }"
      :enter="{ opacity: 1, height: 'auto', transition: { duration: 300 } }"
    >
      <BaseSidebarLink
        v-for="subItem in items"
        :item="subItem"
        :key="subItem.to"
      />
    </div>
  </div>
</template>
