import type { Collections } from "@nuxt/content"
import { SORT_ORDER } from "@docs/types/enums/filter.enum"
import type { ProjectItem, ProjectMeta } from "@docs/types/project"

export const useProjectsFilter = () => {
  const { locale } = useI18n()

  const sortOrder = ref<SORT_ORDER>(SORT_ORDER.DESC)
  const selectedTags = ref<string[]>([])

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const { data: projects } = useAsyncData<ProjectItem[]>(
    "projects-list",
    async () => {
      const raw = await queryCollection(collection.value)
        .where("path", "LIKE", "%/projects/%")
        .select("title", "description", "meta", "path")
        .all()
      return raw.map((p) => ({
        title: p.title,
        description: p.description,
        path: `/docs${p.path}`,
        meta: p.meta as ProjectMeta | undefined
      }))
    },
    {
      watch: [locale]
    }
  )

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    ;(projects.value || []).forEach((p) => {
      p.meta?.tags?.forEach((t) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  })

  const hasActiveFilters = computed(
    () => selectedTags.value.length > 0 || sortOrder.value !== SORT_ORDER.DESC
  )

  const filteredProjects = computed((): ProjectItem[] => {
    return sortByTitle(filterByTags(projects.value || []))
  })

  const totalFiltered = computed(() => filteredProjects.value.length)

  const sortIcon = computed(() =>
    sortOrder.value === SORT_ORDER.DESC ? "i-lucide-arrow-down-a-z" : "i-lucide-arrow-up-a-z"
  )

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.DESC
  }

  const toggleTag = (tag: string) => {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) selectedTags.value.push(tag)
    else selectedTags.value.splice(idx, 1)
  }

  const resetFilters = () => {
    selectedTags.value = []
    sortOrder.value = SORT_ORDER.DESC
  }

  const sortByTitle = <T extends { title: string }>(list: T[]): T[] => {
    return [...list].sort((a, b) => {
      const cmp = a.title.localeCompare(b.title)
      return sortOrder.value === SORT_ORDER.DESC ? cmp : -cmp
    })
  }

  const filterByTags = <T extends { meta?: ProjectMeta }>(list: T[]): T[] => {
    if (!selectedTags.value.length) return list
    return list.filter((p) => selectedTags.value.every((t) => p.meta?.tags?.includes(t)))
  }

  return {
    projects,
    filteredProjects,
    allTags,
    sortOrder,
    selectedTags,
    hasActiveFilters,
    totalFiltered,
    sortIcon,
    toggleSortOrder,
    toggleTag,
    resetFilters
  }
}
