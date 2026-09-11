<script setup lang="ts">
import { resolveOgImageFields } from "@app/utils/rss"
import { useExperience } from "@base/composables/useExperience"
import HomePage from "@base/components/pages/home/HomePage.vue"

const { t } = useI18n()
const { frontendYears } = useExperience()

const homeTitle = computed(() => t("global.portfolio"))
const homeDescription = computed(() =>
  t("pages.home.description", { frontendYears: frontendYears.value })
)

const homeOgFields = computed(() =>
  resolveOgImageFields({
    component: "HomePage",
    title: homeTitle.value,
    description: homeDescription.value
  })
)

definePageMeta({
  layout: "home"
})

useSeoMeta({
  title: () => homeTitle.value,
  description: () => homeDescription.value,
  ogTitle: () => homeTitle.value,
  ogDescription: () => homeDescription.value
})

defineOgImage("HomePage", {
  title: homeOgFields.value.title,
  description: homeOgFields.value.description
})
</script>

<template>
  <HomePage />
</template>
