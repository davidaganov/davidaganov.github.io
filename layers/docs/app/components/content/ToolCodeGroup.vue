<script setup lang="ts">
interface ToolCodeGroupItem {
  title: string
  file: string
  lang?: string
}

const props = withDefaults(
  defineProps<{
    items: ToolCodeGroupItem[] | string
  }>(),
  {
    items: () => []
  }
)

const isToolCodeGroupItem = (item: unknown): item is ToolCodeGroupItem => {
  if (!item || typeof item !== "object") return false

  const candidate = item as Record<string, unknown>
  return typeof candidate.title === "string" && typeof candidate.file === "string"
}

const toToolCodeGroupItems = (value: unknown): ToolCodeGroupItem[] => {
  if (!Array.isArray(value)) return []
  return value.filter(isToolCodeGroupItem)
}

const parseItemsString = (raw: string): ToolCodeGroupItem[] => {
  try {
    return toToolCodeGroupItems(JSON.parse(raw))
  } catch {
    const normalized = raw
      .replace(/([{,]\s*)([a-zA-Z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
      .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, s: string) => {
        return `"${s.replace(/"/g, '\\"')}"`
      })

    try {
      return toToolCodeGroupItems(JSON.parse(normalized))
    } catch {
      return []
    }
  }
}

const normalizedItems = computed<ToolCodeGroupItem[]>(() => {
  const raw = props.items

  if (Array.isArray(raw)) return toToolCodeGroupItems(raw)
  if (typeof raw !== "string") return []

  return parseItemsString(raw)
})

const tabItems = computed(() =>
  normalizedItems.value.map((item, index) => ({
    label: item.title,
    value: String(index),
    slot: `code-${index}`
  }))
)
</script>

<template>
  <ProseTabs
    v-if="normalizedItems.length"
    default-value="0"
    class="w-full"
    :items="tabItems"
  >
    <template
      v-for="(item, index) in normalizedItems"
      #[`code-${index}`]
      :key="`${item.file}-${index}`"
    >
      <ToolSourceCode
        :file="item.file"
        :lang="item.lang || 'vue'"
      />
    </template>
  </ProseTabs>
</template>
