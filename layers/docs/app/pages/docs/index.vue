<script setup lang="ts">
import { getFirstPathForFirstSection } from "@docs/utils/sections"

const { t } = useI18n()

const localePath = useLocalePath()

await navigateTo(localePath(getFirstPathForFirstSection()), { replace: true })

useSeoMeta({
  title: () => t("layout.navigation.sections.docs"),
  robots: "noindex, nofollow"
})
</script>

<template>
  <div />
</template>
