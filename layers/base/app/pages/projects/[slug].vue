<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppRightSidebar from "@base/components/app/AppRightSidebar.vue"

const route = useRoute()

const { locale } = useI18n()

const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? String(value[0] || "") : String(value || "")
})

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: page } = await useAsyncData(
  () => `content:${collection.value}:/projects/${slug.value}`,
  async () => {
    if (!slug.value) return null
    return await queryCollection(collection.value).path(`/projects/${slug.value}`).first()
  },
  {
    watch: [locale, slug]
  }
)
</script>

<template>
  <div v-if="page">
    <ContentRenderer :value="page" />
    <AppRightSidebar :page="page" />
  </div>

  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
