<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { useDocsSeo } from "@docs/composables/useDocsSeo"
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

const parentCollectionItem = computed<SidebarCollectionItem | undefined>(() => {
  const topLevelSlug = slugParam.value[0] || ""
  if (!topLevelSlug) return undefined
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const { data: page } = await usePageContent(docsPath.value)
const { breadcrumbs, pageType } = useDocsSeo({
  section,
  collectionItem,
  parentCollectionItem,
  page
})

const titleKey = computed(() => collectionItem.value?.titleKey)
const subtitleKey = computed(() => collectionItem.value?.subtitleKey)
const emptyKey = computed(() => collectionItem.value?.emptyKey)
</script>

<template>
  <div v-if="collectionItem">
    <UBreadcrumb
      v-if="breadcrumbs.length"
      class="mb-6"
      :items="breadcrumbs"
    />
    <AppIndexPage
      :title-key="titleKey"
      :subtitle-key="subtitleKey"
      :empty-key="emptyKey"
      :path-prefix="getCollectionPathPrefix(collectionItem.source)"
      :show-source-tabs="collectionItem.showSourceTabs ?? false"
    />
    <AppRightSidebar
      :main="true"
      :type="pageType"
    />
  </div>
  <div v-else-if="page">
    <UBreadcrumb
      v-if="breadcrumbs.length"
      class="mb-6"
      :items="breadcrumbs"
    />
    <ContentRenderer :value="page" />
    <AppRightSidebar
      :page="page"
      :type="pageType"
    />
  </div>
</template>
