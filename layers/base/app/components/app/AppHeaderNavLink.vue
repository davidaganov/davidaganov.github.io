<script setup lang="ts">
import NavHighlightBadge from "@docs/components/base/NavHighlightBadge.vue"
import UiLink from "@ui/components/UiLink.vue"
import type { DocsHeaderNavAction } from "@docs/types"

const props = withDefaults(
  defineProps<{
    action: DocsHeaderNavAction
    variant?: "tab" | "icon"
    ariaLabel?: string
  }>(),
  {
    variant: "tab",
    ariaLabel: undefined
  }
)

const { t } = useI18n()

const resolvedAriaLabel = computed(() => props.ariaLabel ?? props.action.label)

const highlightAriaLabel = computed(() => {
  if (!props.action.highlight) return ""
  return props.action.highlight === "new"
    ? t("layout.navHighlight.new")
    : t("layout.navHighlight.updated")
})

const classes = computed(() => {
  return props.variant === "tab" ? "px-3 py-1! lg:py-1.5!" : undefined
})
</script>

<template>
  <UiLink
    :class="classes"
    :is-icon="variant === 'icon'"
    :to="action.to"
    :active="action.active"
    :aria-label="resolvedAriaLabel"
    :title="variant === 'icon' ? resolvedAriaLabel : undefined"
  >
    <div class="relative mt-1">
      <UIcon
        class="size-4 shrink-0"
        aria-hidden="true"
        :name="action.icon"
      />
      <NavHighlightBadge
        v-if="action.highlight"
        variant="dot"
        :kind="action.highlight"
      />
    </div>
    <template v-if="variant === 'tab'">
      {{ action.label }}
      <span
        v-if="action.highlight"
        class="sr-only"
      >
        —
        {{ highlightAriaLabel }}
      </span>
    </template>
  </UiLink>
</template>
