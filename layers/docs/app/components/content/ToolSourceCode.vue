<script setup lang="ts">
import { parseMarkdown } from "@nuxtjs/mdc/runtime"

const props = withDefaults(
  defineProps<{
    file: string
    lang?: string
  }>(),
  {
    lang: "vue"
  }
)

const sources = import.meta.glob("./*.{ts,vue}", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

const expanded = ref(false)
const copied = ref(false)

const source = computed(() => {
  return sources[`./${props.file}`] ?? ""
})

const markdown = computed(() => {
  if (!source.value) return ""
  return ["```" + props.lang, source.value.trimEnd(), "```"].join("\n")
})

const { data: ast } = await useAsyncData(
  `tool-source-${props.file}-${props.lang}`,
  async () => {
    if (!markdown.value) return null
    return await parseMarkdown(markdown.value, {
      highlight: {
        theme: "github-dark"
      }
    })
  },
  {
    server: true
  }
)

const copyCode = async () => {
  if (!source.value) return
  await navigator.clipboard.writeText(source.value.trimEnd())
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div
    v-if="source"
    class="relative"
  >
    <!-- Sticky toolbar -->
    <div class="absolute top-2 right-2 z-10 flex gap-2">
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        tabindex="-1"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        :aria-label="copied ? $t('tools.sourceCode.copied') : $t('tools.sourceCode.copy')"
        :title="copied ? $t('tools.sourceCode.copied') : $t('tools.sourceCode.copy')"
        @click="copyCode"
      />
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        tabindex="-1"
        :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
        :aria-label="expanded ? $t('tools.sourceCode.collapse') : $t('tools.sourceCode.expand')"
        :title="expanded ? $t('tools.sourceCode.collapse') : $t('tools.sourceCode.expand')"
        @click="expanded = !expanded"
      />
    </div>

    <div
      class="relative overflow-hidden rounded-[4px] border border-white/10 bg-white/5 backdrop-blur-sm"
      :class="expanded ? '' : 'max-h-96'"
    >
      <MDCRenderer
        v-if="ast?.body"
        class="tool-source-renderer"
        :body="ast.body"
        :data="ast.data"
      />
      <div
        v-else
        class="text-muted p-4 text-sm"
      >
        {{ $t("tools.sourceCode.loading") }}
      </div>

      <div
        v-if="!expanded"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#0b1220] to-transparent"
      />
    </div>
  </div>
</template>

<style scoped>
.tool-source-renderer:deep(> div) {
  margin-block: 0px;
}

.tool-source-renderer:deep(> div > button) {
  display: none;
}

.tool-source-renderer:deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.45;
}
</style>
