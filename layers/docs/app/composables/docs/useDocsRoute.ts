import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentPage } from "@docs/composables/content/useContentPage"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"
import type { SidebarCollectionItem } from "@docs/types"

export const useDocsRoute = () => {
  const localePath = useLocalePath()
  const route = useRoute()
  const { collection } = useContentCollection()

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

  const getCollectionPathPrefix = (source: string) => `/docs/${sectionParam.value}/${source}`

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
      await navigateTo(localePath(`${pathPrefix}${relativePath}`), { replace: true })
    }
  }

  const { data: page } = useContentPage(docsPath)

  const redirectMissingPage = async () => {
    if (page.value || collectionItem.value) return
    const targetPath = getFirstPathForSection(section.value)
    if (targetPath && targetPath !== docsPath.value) {
      await navigateTo(localePath(targetPath), { replace: true })
    }
  }

  return {
    section,
    docsPath,
    slugParam,
    sectionParam,
    parentCollectionItem,
    collectionItem,
    page,
    getCollectionPathPrefix,
    ensureValidRoute,
    redirectCollectionWithoutIndex,
    redirectMissingPage
  }
}
