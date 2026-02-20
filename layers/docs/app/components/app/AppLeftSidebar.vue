<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import { DOCS_SECTIONS } from "@docs/config/sections"
import type { SidebarCollectionItem, SidebarItem, SidebarLinkItem } from "@docs/types/sidebar"
import { getSectionById, getSectionIdByPath } from "@docs/utils/sections"

const { locale } = useI18n()
const route = useRoute()

const sectionId = computed(() => getSectionIdByPath(route.path))

const section = computed(() => {
  return getSectionById(sectionId.value)
})

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: sectionRootPages } = useAsyncData(
  () => `sidebar:section-root:${collection.value}:${sectionId.value}`,
  async () => {
    if (!sectionId.value) return []

    const prefix = `/${sectionId.value}/`
    const pages = await queryCollection(collection.value)
      .where("path", "LIKE", `${prefix}%`)
      .select("title", "meta", "path")
      .all()

    return pages
      .filter((page) => {
        if (typeof page.path !== "string") return false
        if (!page.path.startsWith(prefix)) return false

        const relative = page.path.slice(prefix.length)
        if (!relative || relative.includes("/")) return false

        const hidden = Boolean(
          (page.meta as { navigation?: boolean } | undefined)?.navigation === false
        )
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
  },
  {
    watch: [locale, sectionId]
  }
)

const sidebarItems = computed<SidebarItem[]>(() => {
  const currentSectionId = sectionId.value
  const currentSection = section.value

  if (!currentSection || !currentSectionId) {
    return DOCS_SECTIONS[0]?.sidebarItems || []
  }

  const pages = sectionRootPages.value || []
  const pageBySlug = new Map(
    pages
      .map((page) => {
        const slug =
          String(page.path || "")
            .split("/")
            .filter(Boolean)
            .at(-1) || ""
        return [slug, page] as const
      })
      .filter(([slug]) => Boolean(slug))
  )

  const explicitLinkNames = new Set(
    currentSection.sidebarItems
      .filter((item): item is SidebarLinkItem => item.type === "link" && Boolean(item.name))
      .map((item) => String(item.name))
  )

  const resolved = currentSection.sidebarItems
    .map((item): SidebarItem | null => {
      if (item.type === "link") {
        const name = item.name
        if (!name) return item

        const page = pageBySlug.get(name)
        if (!page) return null

        const meta = (page.meta as { icon?: string } | undefined) || {}
        return {
          ...item,
          to: `/docs/${currentSectionId}/${name}`,
          label: String(page.title || name),
          icon: String(meta.icon || item.icon || "i-lucide-file-text"),
          translate: false
        }
      }

      if (item.type === "collection") {
        const collectionItem: SidebarCollectionItem = {
          ...item,
          pathPrefix: item.pathPrefix || `/docs/${currentSectionId}/${item.source}`
        }
        return collectionItem
      }

      return item
    })
    .filter((item): item is SidebarItem => Boolean(item))

  const autoLinks: SidebarLinkItem[] = []
  for (const page of pages) {
    const slug =
      String(page.path || "")
        .split("/")
        .filter(Boolean)
        .at(-1) || ""

    if (!slug || explicitLinkNames.has(slug)) continue

    const meta = (page.meta as { icon?: string } | undefined) || {}

    autoLinks.push({
      type: "link",
      name: slug,
      to: `/docs/${currentSectionId}/${slug}`,
      label: String(page.title || slug),
      icon: String(meta.icon || "i-lucide-file-text"),
      translate: false
    })
  }

  return [...resolved, ...autoLinks]
})

const renderedSidebarItems = computed(() => {
  const sectionId = getSectionIdByPath(route.path)
  const section = getSectionById(sectionId)

  if (!section) return DOCS_SECTIONS[0]?.sidebarItems || []

  return sidebarItems.value
})
</script>

<template>
  <aside
    class="sticky top-29 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-white/5"
  >
    <div class="py-8 pr-4">
      <nav class="space-y-1">
        <template
          v-for="(item, index) in renderedSidebarItems"
          :key="index"
        >
          <BaseSidebarLink
            v-if="item.type === 'link'"
            :item="item"
          />
          <BaseSidebarDivider
            v-else-if="item.type === 'divider'"
            :item="item"
          />
          <BaseSidebarCollection
            v-else-if="item.type === 'collection'"
            :item="item"
          />
        </template>
      </nav>
    </div>
  </aside>
</template>
