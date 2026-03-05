<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppPageViewCounter from "@docs/components/app/AppPageViewCounter.vue"
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
const localePath = useLocalePath()
const route = useRoute()

const sectionParam = computed(() => String(route.params.section || ""))
const slugParam = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.filter(Boolean).map(String) : value ? [String(value)] : []
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

const parentCollectionItem = computed(() => {
  const topLevelSlug = slugParam.value[0]
  if (!topLevelSlug) return undefined
  return section.value?.sidebarItems.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const collectionItem = computed(() =>
  slugParam.value.length === 1 ? parentCollectionItem.value : undefined
)

const getCollectionPathPrefix = (source: string) => `/docs/${sectionParam.value}/${source}`

if (collectionItem.value?.indexPage === false) {
  const pathPrefix = getCollectionPathPrefix(collectionItem.value.source)
  const queryPrefix = getQueryPrefix(pathPrefix)
  const firstChild = await queryCollection(collection.value)
    .where("path", "LIKE", `%${queryPrefix}%`)
    .select("path")
    .first()

  if (firstChild?.path) {
    const relativePath = getRelativePath(String(firstChild.path), queryPrefix)
    await navigateTo(localePath(`${pathPrefix}${relativePath}`), { replace: true })
  }
}

const { data: page } = await usePageContent(docsPath.value)

if (!page.value && !collectionItem.value) {
  const targetPath = getFirstPathForSection(section.value)
  if (targetPath && targetPath !== docsPath.value) {
    await navigateTo(localePath(targetPath), { replace: true })
  }
}

const { breadcrumbs, pageType } = useDocsSeo({
  section,
  collectionItem,
  parentCollectionItem,
  page
})
</script>

<template>
  <div v-if="collectionItem || page">
    <!-- Header: Breadcrumbs & Counter -->
    <div class="flex items-center justify-between gap-4">
      <UBreadcrumb
        v-if="breadcrumbs.length"
        class="mb-6"
        :items="breadcrumbs"
      />
      <AppPageViewCounter v-if="!collectionItem" />
    </div>

    <!-- Main Content -->
    <template v-if="collectionItem">
      <AppIndexPage
        :title-key="collectionItem.titleKey"
        :subtitle-key="collectionItem.subtitleKey"
        :empty-key="collectionItem.emptyKey"
        :path-prefix="getCollectionPathPrefix(collectionItem.source)"
        :show-source-tabs="collectionItem.showSourceTabs ?? false"
      />
      <AppRightSidebar
        main
        :type="pageType"
      />
    </template>

    <template v-else-if="page">
      <ContentRenderer :value="page" />
      <AppRightSidebar
        :page="page"
        :type="pageType"
      />
    </template>
  </div>
</template>
