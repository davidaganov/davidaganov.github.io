<script setup lang="ts">
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"

const { t } = useI18n()

const localePath = useLocalePath()
const route = useRoute()

const sectionParam = computed(() => {
  const value = route.params.section
  return Array.isArray(value) ? String(value[0] || "") : String(value || "")
})

const section = computed(() => getSectionById(sectionParam.value))

const seoTitle = computed(() =>
  section.value ? t(section.value.labelKey) : t("layout.navigation.sections.docs")
)

const target = computed(() => {
  if (!section.value) return getFirstPathForFirstSection()

  return getFirstPathForSection(section.value)
})

await navigateTo(localePath(target.value), { replace: true })

useSeoMeta({
  title: () => seoTitle.value,
  robots: "noindex, nofollow"
})
</script>

<template>
  <div />
</template>
