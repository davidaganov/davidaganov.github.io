<script setup lang="ts">
import { ROUTE_PATH } from "@base/types"
import { getFirstPathForFirstSection, normalizeDocsPath } from "@docs/utils/sections"

const { t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()
const target = getFirstPathForFirstSection()

const isDocsRoot = computed(() => normalizeDocsPath(route.path) === ROUTE_PATH.DOCS)

if (isDocsRoot.value) {
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
