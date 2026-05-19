<script setup lang="ts">
import { useDocsRoute } from "@docs/composables/docs/useDocsRoute"
import { useDocsSeo } from "@docs/composables/docs/useDocsSeo"
import AppArticleNavigation from "@docs/components/app/AppArticleNavigation.vue"
import AppArticleTranslationWarning from "@docs/components/app/AppArticleTranslationWarning.vue"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppRightSidebar from "@docs/components/app/rightsidebar/AppRightSidebar.vue"
import BaseViewCounter from "@docs/components/base/BaseViewCounter.vue"

const {
  section,
  docsPath,
  parentCollectionItem,
  collectionItem,
  page,
  isPagePending,
  getCollectionPathPrefix
} = await useDocsRoute()

const { breadcrumbs, pageType } = useDocsSeo({
  section,
  collectionItem,
  parentCollectionItem,
  page
})
</script>

<template>
  <div
    v-if="isPagePending"
    class="text-muted flex min-h-[40vh] items-center justify-center text-sm"
  >
    {{ $t("global.status.loading") }}
  </div>

  <div v-else-if="collectionItem || page">
    <div class="mb-6 flex items-center justify-between gap-4">
      <UBreadcrumb
        v-if="breadcrumbs.length"
        :items="breadcrumbs"
      />
      <BaseViewCounter v-if="!collectionItem" />
    </div>

    <AppIndexPage
      v-if="collectionItem"
      :title-key="collectionItem.titleKey"
      :subtitle-key="collectionItem.subtitleKey"
      :empty-key="collectionItem.emptyKey"
      :path-prefix="getCollectionPathPrefix(collectionItem.source)"
      :show-source-tabs="collectionItem.showSourceTabs ?? false"
    />
    <AppRightSidebar
      v-if="collectionItem"
      main
      :type="pageType"
    />

    <template v-else-if="page">
      <AppArticleTranslationWarning :page="page" />
      <div class="docs-markdown-scope">
        <ContentRenderer :value="page" />
      </div>
      <AppRightSidebar
        :page="page"
        :type="pageType"
      />
    </template>

    <AppArticleNavigation
      :docs-path="docsPath"
      :is-collection="!!collectionItem"
    />
  </div>
</template>
