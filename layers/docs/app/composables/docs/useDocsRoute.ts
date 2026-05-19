import { until } from "@vueuse/core"
import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentPage } from "@docs/composables/content/useContentPage"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import { joinPublicDocsPath } from "@docs/utils/path/joinPublicPath"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"
import type { SidebarCollectionItem } from "@docs/types"

export const useDocsRoute = async () => {
  const localePath = useLocalePath()
  const route = useRoute()
  const { collection } = useContentCollection()

  const getCollectionPathPrefix = (source: string) => `/docs/${sectionParam.value}/${source}`

  const sectionParam = computed(() => String(route.params.section || ""))

  const slugParam = computed(() => {
    const value = route.params.slug
    return Array.isArray(value) ? value.filter(Boolean).map(String) : value ? [String(value)] : []
  })

  const section = computed(() => getSectionById(sectionParam.value))
  const docsPath = computed(() => `/docs/${sectionParam.value}/${slugParam.value.join("/")}`)

  const parentCollectionItem = computed(() => {
    const topLevelSlug = slugParam.value[0]
    if (!topLevelSlug) return undefined
    return section.value?.sidebarItems.find(
      (item): item is SidebarCollectionItem =>
        item.type === "collection" && item.source === topLevelSlug
    )
  })

  const collectionItem = computed(() => {
    return slugParam.value.length === 1 ? parentCollectionItem.value : undefined
  })

  const pageQuery = useContentPage(docsPath)

  const page = computed(() => pageQuery.data.value)

  const isPagePending = computed(
    () => !collectionItem.value && pageQuery.status.value === "pending"
  )

  const waitForPage = async () => {
    if (collectionItem.value) return

    if (pageQuery.status.value === "idle") {
      await pageQuery.refresh()
    }

    if (pageQuery.status.value === "pending") {
      await until(pageQuery.status).not.toBe("pending")
    }
  }

  const ensureValidRoute = async () => {
    if (!section.value) {
      await navigateTo(localePath(getFirstPathForFirstSection()), { replace: true })
      return false
    }
    if (!slugParam.value.length) {
      await navigateTo(localePath(getFirstPathForSection(section.value)), { replace: true })
      return false
    }
    return true
  }

  const redirectCollectionWithoutIndex = async () => {
    if (collectionItem.value?.indexPage !== false) return

    const pathPrefix = getCollectionPathPrefix(collectionItem.value.source)
    const queryPrefix = toContentPrefix(pathPrefix)
    const firstChild = await queryCollection(collection.value)
      .where("path", "LIKE", `${queryPrefix}%`)
      .select("path")
      .first()

    if (firstChild?.path) {
      const relativePath = toRelativeContentPath(String(firstChild.path), queryPrefix)
      await navigateTo(localePath(joinPublicDocsPath(pathPrefix, relativePath)), { replace: true })
    }
  }

  const redirectMissingPage = async () => {
    await waitForPage()
    if (page.value || collectionItem.value) return
    const targetPath = getFirstPathForSection(section.value)
    if (targetPath && targetPath !== docsPath.value) {
      await navigateTo(localePath(targetPath), { replace: true })
    }
  }

  await waitForPage()

  if (await ensureValidRoute()) {
    await redirectCollectionWithoutIndex()
    await waitForPage()
    await redirectMissingPage()
  }

  return {
    section,
    docsPath,
    slugParam,
    sectionParam,
    parentCollectionItem,
    collectionItem,
    page,
    isPagePending,
    getCollectionPathPrefix
  }
}
