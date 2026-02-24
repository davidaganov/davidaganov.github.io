<script setup lang="ts">
import HomePage from "@base/components/pages/home/HomePage.vue"

const { locale, t } = useI18n()

const homeTitle = computed(() => (locale.value === "ru" ? "Портфолио" : "Portfolio"))
const homeDescription = computed(() => t("pages.home.description"))

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
</script>

<template>
  <HomePage />
</template>
