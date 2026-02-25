<script setup lang="ts">
import { getFirstPathForFirstSection } from "@docs/utils/sections"

const { t } = useI18n()

const localePath = useLocalePath()
const target = getFirstPathForFirstSection()

if (import.meta.server || import.meta.client) {
  await navigateTo(localePath(target), { replace: true })
}

useSeoMeta({
  title: () => t("layout.navigation.sections.docs"),
  robots: "noindex, nofollow"
})
</script>

<template>
  <div />
</template>
