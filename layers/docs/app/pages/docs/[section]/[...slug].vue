<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import type { SidebarCollectionItem } from "@docs/types/sidebar"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"
import { ROUTE_PATH } from "@base/types/enums"

const { locale } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const sectionParam = computed(() => {
  const value = route.params.section
  return Array.isArray(value) ? String(value[0] || "") : String(value || "")
})

const slugParam = computed(() => {
  const value = route.params.slug
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (!value) return []
  return [String(value)]
})

const section = computed(() => getSectionById(sectionParam.value))
const collection = computed(() => `content_${locale.value}` as keyof Collections)

if (!section.value) {
  await navigateTo(localePath(getFirstPathForFirstSection()), { replace: true })
}

if (!slugParam.value.length) {
  await navigateTo(localePath(getFirstPathForSection(section.value)), { replace: true })
}

const docsPath = computed(() => {
  return `/docs/${sectionParam.value}/${slugParam.value.join("/")}`
})

const collectionSlug = computed(() => {
  if (slugParam.value.length !== 1) return ""
  return slugParam.value[0] || ""
})

const collectionItem = computed<SidebarCollectionItem | undefined>(() => {
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === collectionSlug.value
  )
})

const isCollectionIndex = computed(() => Boolean(collectionItem.value))

const getQueryPrefix = (pathPrefix: string) => {
  if (pathPrefix.startsWith(ROUTE_PATH.DOCS)) {
    return pathPrefix.replace(/^\/docs\/[^/]+/, "") || ROUTE_PATH.HOME
  }

  return pathPrefix
}

const getCollectionPathPrefix = (source: string): string => {
  return `/docs/${sectionParam.value}/${source}`
}

const getFirstChildPath = async (pathPrefix: string): Promise<string | undefined> => {
  const queryPrefix = getQueryPrefix(pathPrefix)

  const pages = await queryCollection(collection.value)
    .where("path", "LIKE", `%${queryPrefix}%`)
    .select("path")
    .all()

  const first = pages.find((page) => typeof page.path === "string")

  if (!first?.path) return undefined

  const relativePath = String(first.path).split(queryPrefix).pop() || ""
  return `${pathPrefix}${relativePath}`
}

if (collectionItem.value?.indexPage === false) {
  const pathPrefix = getCollectionPathPrefix(collectionItem.value.source)
  const firstChildPath = await getFirstChildPath(pathPrefix)

  if (firstChildPath) {
    await navigateTo(localePath(firstChildPath), { replace: true })
  }
}

const { data: page } = await usePageContent(docsPath.value)

const titleKey = computed(() => {
  if (collectionItem.value?.source === "projects") return "layout.projectsPage.title"
  return "layout.articlesPage.title"
})

const emptyKey = computed(() => {
  if (collectionItem.value?.source === "projects") return "layout.projectsPage.empty"
  return "layout.articlesPage.empty"
})

const rightSidebarType = computed(() => {
  if (collectionItem.value?.source === "projects") return TYPE_PAGE.PROJECT
  return TYPE_PAGE.ARTICLE
})
</script>

<template>
  <div v-if="isCollectionIndex && collectionItem">
    <AppIndexPage
      :title-key="titleKey"
      :empty-key="emptyKey"
      :path-prefix="getCollectionPathPrefix(collectionItem.source)"
      :show-source-tabs="collectionItem.source === 'articles'"
    />
    <AppRightSidebar
      :main="true"
      :type="rightSidebarType"
    />
  </div>
  <div v-else-if="page">
    <ContentRenderer :value="page" />
    <AppRightSidebar :page="page" />
  </div>
  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
