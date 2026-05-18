<script setup lang="ts">
interface Props {
  /** The target URL for internal navigation (NuxtLink) */
  to?: string | object
  /** The target URL for external navigation (anchor tag) */
  href?: string
  /** Whether the link is currently active/selected */
  active?: boolean
  /** Whether the link should be rendered as a square icon button (1:1 ratio) */
  isIcon?: boolean
  /** Target attribute for external links (e.g., '_blank') */
  target?: string
  /** Accessible name when visible text is ambiguous (e.g. duplicate link labels) */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  active: false,
  isIcon: false,
  target: "_self",
  ariaLabel: undefined
})

const localePath = useLocalePath()

/**
 * Normalizes props for the underlying component.
 */
const componentProps = computed(() => {
  if (props.to) {
    return {
      to: typeof props.to === "string" ? localePath(props.to) : props.to
    }
  }

  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.target === "_blank" ? "noopener noreferrer" : undefined
    }
  }

  return { type: "button" as const }
})

/**
 * Computes CSS classes based on state and variant.
 */
const classes = computed(() => {
  return [
    "group cursor-pointer  inline-flex items-center transition-all duration-200 rounded-lg text-sm font-medium whitespace-nowrap",
    // Layout variant
    props.isIcon ? "size-9 justify-center shrink-0" : "px-3 py-2 gap-3",
    // State variant
    props.active
      ? "bg-primary-200/50 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400"
      : "text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
  ]
})
</script>

<template>
  <NuxtLink
    v-if="props.to"
    v-bind="componentProps"
    :aria-current="props.active ? 'page' : undefined"
    :aria-label="props.ariaLabel"
    :class="classes"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="props.href"
    v-bind="componentProps"
    :aria-label="props.ariaLabel"
    :class="classes"
  >
    <slot />
  </a>

  <button
    v-else
    v-bind="componentProps"
    :aria-label="props.ariaLabel"
    :class="classes"
  >
    <slot />
  </button>
</template>
