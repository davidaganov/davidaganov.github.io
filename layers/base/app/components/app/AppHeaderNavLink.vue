<script setup lang="ts">
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

const resolvedAriaLabel = computed(() => props.ariaLabel ?? props.action.label)

const classes = computed(() => {
  return props.variant === "tab" ? "min-h-11 px-3 py-1.5 lg:min-h-0 lg:py-2!" : undefined
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
      <span
        v-if="action.showBadge"
        class="bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-(--ui-bg)"
        aria-hidden="true"
      />
    </div>
    <template v-if="variant === 'tab'">
      {{ action.label }}
      <span
        v-if="action.showBadge && action.badgeAriaLabel"
        class="sr-only"
      >
        —
        {{ action.badgeAriaLabel }}
      </span>
    </template>
  </UiLink>
</template>
