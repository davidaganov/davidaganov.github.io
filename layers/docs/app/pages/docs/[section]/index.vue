<script setup lang="ts">
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"

const localePath = useLocalePath()
const route = useRoute()

const sectionParam = computed(() => {
  const value = route.params.section
  return Array.isArray(value) ? String(value[0] || "") : String(value || "")
})

const section = computed(() => getSectionById(sectionParam.value))

const target = computed(() => {
  if (!section.value) return getFirstPathForFirstSection()

  return getFirstPathForSection(section.value)
})

await navigateTo(localePath(target.value), { replace: true })
</script>

<template>
  <div />
</template>
