<script setup lang="ts">
import type { NavHighlightKind } from "@docs/types"

const props = withDefaults(
  defineProps<{
    kind: NavHighlightKind
    variant?: "dot" | "pill"
  }>(),
  {
    variant: "pill"
  }
)

const { t } = useI18n()

const label = computed(() => {
  return props.kind === "new" ? t("layout.navHighlight.new") : t("layout.navHighlight.updated")
})
</script>

<template>
  <span
    v-if="variant === 'dot'"
    class="absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-(--ui-bg)"
    aria-hidden="true"
    :class="kind === 'new' ? 'bg-primary-500' : 'bg-amber-500'"
  />
  <span
    v-else
    class="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] leading-none font-medium"
    :class="
      kind === 'new'
        ? 'bg-primary-500/15 text-primary-700 dark:text-primary-300'
        : 'bg-amber-500/15 text-amber-800 dark:text-amber-200'
    "
  >
    {{ label }}
  </span>
</template>
