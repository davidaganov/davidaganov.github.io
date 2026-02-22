<script setup lang="ts">
import { useDocsArchive } from "@docs/composables/useDocsArchive"
import { GITHUB_REPO } from "@base/constants/config"

const { t } = useI18n()

const { archiveEntries, archiveName, hasArchive } = useDocsArchive()

const implementationUrl = `https://github.com/${GITHUB_REPO}/blob/main/layers/docs/app/components/app/AppRightSidebarArchiveDownload.vue`

const isDownloading = ref(false)
const error = ref("")

const downloadArchive = async () => {
  if (!hasArchive.value || typeof window === "undefined") return

  error.value = ""
  isDownloading.value = true

  try {
    const { default: JSZip } = await import("jszip")
    const zip = new JSZip()

    for (const file of archiveEntries.value) {
      zip.file(file.path, file.content)
    }

    const blob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = archiveName.value
    link.rel = "noopener"
    document.body.append(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
  } catch {
    error.value = t("archive.error")
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div
    v-if="hasArchive"
    class="rounded-xl border border-white/5 bg-white/3 p-4"
  >
    <div class="flex items-start justify-between gap-2">
      <div>
        <div class="text-sm font-semibold text-white">
          {{ $t("archive.title") }}
        </div>
      </div>
      <UPopover
        mode="hover"
        :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-lock"
          :aria-label="$t('archive.safety.aria')"
          :title="$t('archive.safety.aria')"
        />

        <template #content>
          <div class="w-64 rounded-lg border border-white/10 bg-[#0b1220] p-3 text-xs shadow-xl">
            <p class="text-white/90">
              {{ $t("archive.safety.description") }}
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary mt-2 inline-flex items-center gap-1 underline-offset-4 hover:underline"
              :href="implementationUrl"
            >
              {{ $t("archive.safety.link") }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-3"
              />
            </a>
          </div>
        </template>
      </UPopover>
    </div>

    <div class="text-muted mt-2 text-xs">
      {{ $t("archive.filesCount") }}: {{ archiveEntries.length }}
    </div>

    <UButton
      block
      class="mt-3"
      color="primary"
      variant="soft"
      icon="i-lucide-download"
      :loading="isDownloading"
      :label="isDownloading ? $t('archive.preparing') : $t('archive.download')"
      @click="downloadArchive"
    />

    <p
      v-if="error"
      class="mt-2 text-xs text-red-300"
    >
      {{ error }}
    </p>
  </div>
</template>
