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

const tabsUi = {
  root: "!mt-0 !mb-5 gap-2",
  list: "rounded-xl mr-auto border border-white/10 bg-white/5 p-1",
  indicator: "rounded-lg bg-primary/20",
  trigger:
    "rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-white data-[state=active]:bg-primary/15 data-[state=active]:text-primary",
  content: "mt-2"
}
</script>

<template>
  <ProseTabs
    v-if="normalizedItems.length"
    default-value="0"
    class="w-full"
    :ui="tabsUi"
  >
    <ProseTabsItem
      v-for="(item, index) in normalizedItems"
      :key="`${item.file}-${index}`"
      :label="item.title"
    >
      <ToolSourceCode
        :file="item.file"
        :lang="item.lang || 'vue'"
      />
    </ProseTabsItem>
  </ProseTabs>
</template>
