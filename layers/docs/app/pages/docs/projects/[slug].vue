<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import { ROUTE_PATH } from "@base/types/enums"

const localePath = useLocalePath()
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
    <NuxtLink
      class="text-primary mb-1.5 block text-sm font-semibold"
      :to="localePath(ROUTE_PATH.PROJECTS)"
    >
      {{ $t("layout.sidebar.sections.projects") }}
    </NuxtLink>
    <ContentRenderer :value="page" />
    <AppRightSidebar
      :page="page"
      :type="TYPE_PAGE.PROJECT"
    />
  </div>

  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
