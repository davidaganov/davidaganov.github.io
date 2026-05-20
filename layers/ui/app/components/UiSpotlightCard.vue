<script setup lang="ts">
import type { ComponentPublicInstance } from "vue"
import { registerSpotlightCard } from "@ui/composables/useSpotlightProximity"
import { spotlightCardVariants } from "@ui/utils/spotlightCardVariants"
import { getSpotlightColors, type SpotlightCardVariant } from "@ui/utils/spotlightColors"

const props = withDefaults(
  defineProps<{
    variant?: SpotlightCardVariant
    to?: string
    href?: string
    class?: string
    contentClass?: string
    spotlight?: boolean
  }>(),
  {
    variant: "resume",
    spotlight: true
  }
)

defineOptions({ inheritAttrs: false })

const rootRef = ref<HTMLElement | ComponentPublicInstance | null>(null)
const glowRef = ref<HTMLElement | null>(null)

const colorMode = useColorMode()

const preset = computed(() => spotlightCardVariants[props.variant])

const NuxtLinkComponent = resolveComponent("NuxtLink")

const rootTag = computed(() => {
  if (props.to) return NuxtLinkComponent
  if (props.href !== undefined) return "a"
  return "div"
})

const isInteractive = computed(() => Boolean(props.to || props.href !== undefined))
const isDark = computed(() => colorMode.value === "dark")

const frameClass = computed(() => [
  isInteractive.value ? "cursor-pointer" : "cursor-default",
  preset.value.frame,
  props.class
])

const linkBindings = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href !== undefined) return { href: props.href }
  return {}
})

const resolveRootElement = (): HTMLElement | null => {
  const target = rootRef.value
  if (!target) return null
  if (target instanceof HTMLElement) return target
  const el = (target as ComponentPublicInstance).$el
  return el instanceof HTMLElement ? el : null
}

let unregisterSpotlight: (() => void) | undefined

const bindSpotlight = () => {
  unregisterSpotlight?.()

  const root = resolveRootElement()
  const glow = glowRef.value

  if (!props.spotlight || !root || !glow) return

  unregisterSpotlight = registerSpotlightCard({
    root,
    glow,
    variant: props.variant,
    getColors: () => getSpotlightColors(props.variant, isDark.value)
  })
}

watch([rootRef, glowRef, () => props.spotlight, () => props.variant, () => colorMode.value], () =>
  nextTick(bindSpotlight)
)

onMounted(() => nextTick(bindSpotlight))
onUnmounted(() => unregisterSpotlight?.())
</script>

<template>
  <component
    v-bind="{ ...$attrs, ...linkBindings }"
    ref="rootRef"
    class="ui-spotlight-card group block p-[2px] text-inherit no-underline"
    :is="rootTag"
    :class="frameClass"
    :data-spotlight="props.spotlight ? 'on' : 'off'"
    :data-variant="props.variant"
  >
    <div
      class="ui-spotlight-card__surface relative overflow-hidden"
      :class="preset.surface"
    >
      <div
        v-if="props.spotlight"
        ref="glowRef"
        class="ui-spotlight-card__glow"
        aria-hidden="true"
      />

      <div
        class="ui-spotlight-card__content relative z-1"
        :class="props.contentClass"
      >
        <slot />
      </div>
    </div>
  </component>
</template>

<style scoped>
.ui-spotlight-card {
  --xPos: -200px;
  --yPos: -200px;
  --spot-edge: transparent;
  --spot-ring: rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  background: var(--spot-ring);
  transition: transform 0.3s ease;
}

.ui-spotlight-card:hover {
  transform: translateY(-3px);
}

.ui-spotlight-card__glow {
  position: absolute;
  z-index: 0;
  width: 500px;
  height: 500px;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.35s ease;
}

@media print {
  .ui-spotlight-card,
  .ui-spotlight-card:hover {
    padding: 0;
    background: transparent;
    transform: none;
  }

  .ui-spotlight-card__surface {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .ui-spotlight-card__glow {
    display: none;
  }
}
</style>
