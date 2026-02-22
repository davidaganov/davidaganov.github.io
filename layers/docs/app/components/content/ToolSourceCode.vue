<script setup lang="ts">
import { useClipboard } from "@vueuse/core"
import type { Highlighter } from "shiki"
import { getHighlighterInstance } from "@docs/utils/shiki"

const sources = import.meta.glob("../../content/tools/**/*.{ts,vue}", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

const props = withDefaults(
  defineProps<{
    file: string
    lang?: string
  }>(),
  {
    lang: "vue"
  }
)

const expanded = ref(false)
const highlighter = shallowRef<Highlighter | null>(null)

const { copy, copied } = useClipboard()

const normalizeSourcePath = (file: string): string => {
  return file
    .replace(/\\/g, "/")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^\.\/?/, "")
    .replace(/^tools\//, "")
}

const resolveSource = (file: string): string => {
  if (!file) return ""
  const normalized = normalizeSourcePath(file)

  const directCandidates = [
    `../../content/tools/${normalized}`,
    `../../content/tools/${normalized.replace(/^content\//, "")}`
  ]

  for (const candidate of directCandidates) {
    const direct = sources[candidate]
    if (direct) return direct
  }

  const bySuffix = Object.entries(sources).find(([key]) => {
    const normalizedKey = normalizeSourcePath(key.replace(/^\.\.\/\.\.\/content\/tools\//, ""))
    return normalizedKey === normalized || normalizedKey.endsWith(`/${normalized}`)
  })

  return bySuffix?.[1] ?? ""
}

const escapeHtml = (str: string) => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }

  return str.replace(/[&<>"']/g, (m) => map[m] ?? m)
}

const source = computed(() => resolveSource(props.file).trimEnd())

const downloadFileName = computed(() => {
  const normalized = props.file?.replace(/\\/g, "/") ?? ""
  return normalized.split("/").filter(Boolean).at(-1) ?? "source-code.txt"
})

const highlightedCode = computed(() => {
  if (!source.value) return ""

  const fallbackHtml = `<pre><code>${escapeHtml(source.value)}</code></pre>`

  if (!highlighter.value) return fallbackHtml

  try {
    return highlighter.value.codeToHtml(source.value, {
      lang: props.lang,
      theme: "material-theme"
    })
  } catch {
    return fallbackHtml
  }
})

const downloadSource = () => {
  if (typeof window === "undefined" || !source.value) return

  const blob = new Blob([source.value], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = downloadFileName.value
  link.rel = "noopener"
  document.body.append(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

onMounted(async () => {
  highlighter.value = await getHighlighterInstance()
})
</script>

<template>
  <div
    v-if="source"
    class="group relative my-5"
  >
    <div
      class="absolute top-[11px] right-[11px] z-10 flex gap-2 transition lg:opacity-0 lg:group-hover:opacity-100"
    >
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        tabindex="-1"
        icon="i-lucide-download"
        :aria-label="$t('tools.sourceCode.download')"
        :title="$t('tools.sourceCode.download')"
        @click="downloadSource"
      />
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        tabindex="-1"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        :aria-label="copied ? $t('tools.sourceCode.copied') : $t('tools.sourceCode.copy')"
        :title="copied ? $t('tools.sourceCode.copied') : $t('tools.sourceCode.copy')"
        @click="copy(source)"
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
      class="border-muted bg-muted relative overflow-hidden rounded-md border px-4 py-3"
      :class="{ 'max-h-96': !expanded }"
    >
      <div
        v-if="highlightedCode"
        v-html="highlightedCode"
        class="tool-source-renderer"
        :class="{ 'max-h-96': !expanded }"
      />

      <div
        v-if="!expanded"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#0b1220] to-transparent"
      />
    </div>
  </div>
</template>

<style scoped>
.tool-source-renderer:deep(pre) {
  white-space: pre-wrap;
  background: transparent !important;
}

.tool-source-renderer:deep(code) {
  display: flex;
  flex-direction: column;
}

.tool-source-renderer:deep(.line) {
  display: block;
  font-size: 0.875rem;
  min-height: 1.5rem;
}
</style>
