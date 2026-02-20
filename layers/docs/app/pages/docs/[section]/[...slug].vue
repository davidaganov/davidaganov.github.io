<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import type { SidebarCollectionItem } from "@docs/types/sidebar"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"

const { locale } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const sectionParam = computed(() => String(route.params.section || ""))

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

const docsPath = computed(() => `/docs/${sectionParam.value}/${slugParam.value.join("/")}`)

const collectionItem = computed<SidebarCollectionItem | undefined>(() => {
  if (slugParam.value.length !== 1) return undefined
  const topLevelSlug = slugParam.value[0] || ""
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const getCollectionPathPrefix = (source: string): string => `/docs/${sectionParam.value}/${source}`

const getFirstChildPath = async (pathPrefix: string): Promise<string | undefined> => {
  const queryPrefix = getQueryPrefix(pathPrefix)

  const pages = await queryCollection(collection.value)
    .where("path", "LIKE", `%${queryPrefix}%`)
    .select("path")
    .all()

  const first = pages.find((page) => typeof page.path === "string")
  if (!first?.path) return undefined

  const relativePath = getRelativePath(String(first.path), queryPrefix)
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

const titleKey = computed(() => collectionItem.value?.titleKey)
const emptyKey = computed(() => collectionItem.value?.emptyKey)

const parentCollectionItem = computed<SidebarCollectionItem | undefined>(() => {
  const topLevelSlug = slugParam.value[0] || ""
  if (!topLevelSlug) return undefined
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const resolvePageType = (pt: string | undefined): TYPE_PAGE => {
  if (pt === TYPE_PAGE.PROJECT) return TYPE_PAGE.PROJECT
  return TYPE_PAGE.ARTICLE
}

const rightSidebarType = computed(() => resolvePageType(collectionItem.value?.pageType))
const pageRightSidebarType = computed(() => resolvePageType(parentCollectionItem.value?.pageType))
</script>

<template>
  <div v-if="collectionItem">
    <AppIndexPage
      :title-key="titleKey"
      :empty-key="emptyKey"
      :path-prefix="getCollectionPathPrefix(collectionItem.source)"
      :show-source-tabs="collectionItem.showSourceTabs ?? false"
    />
    <AppRightSidebar
      :main="true"
      :type="rightSidebarType"
    />
  </div>
  <div v-else-if="page">
    <ContentRenderer :value="page" />
    <AppRightSidebar
      :page="page"
      :type="pageRightSidebarType"
    />
  </div>
</template>
