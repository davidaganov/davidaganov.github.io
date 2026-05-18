import { getFirstPathForSection, getSectionById } from "@docs/utils/sections"

export const useDocsSectionEntry = (sectionId: string) => {
  const localePath = useLocalePath()

  const section = computed(() => getSectionById(sectionId))
  const path = computed(() => getFirstPathForSection(section.value))
  const localizedPath = computed(() => localePath(path.value))

  return {
    section,
    path,
    localizedPath
  }
}
