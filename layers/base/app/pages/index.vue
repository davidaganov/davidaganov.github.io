<script setup lang="ts">
import HomePage from "@base/components/pages/home/HomePage.vue"

const { t } = useI18n()
const { frontendYears } = useExperience()

const homeTitle = computed(() => t("global.name"))
const homeDescription = computed(() =>
  t("pages.home.description", { frontendYears: frontendYears.value })
)

definePageMeta({
  layout: "home"
})

useSeoMeta({
  title: () => homeTitle.value,
  description: () => homeDescription.value,
  ogTitle: () => homeTitle.value,
  ogDescription: () => homeDescription.value,
  twitterTitle: () => homeTitle.value,
  twitterDescription: () => homeDescription.value,
  twitterCard: "summary_large_image"
})

defineOgImageComponent("HomePage", {
  title: homeTitle.value,
  description: homeDescription.value
})
</script>

<template>
  <HomePage />
</template>
