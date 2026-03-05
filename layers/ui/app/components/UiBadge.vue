<script setup lang="ts">
const props = defineProps<{
  label?: string
  value?: string | number
  color?: string
  icon?: string
  loading?: boolean
  href?: string
  external?: boolean
  trailingIcon?: string
  tag?: {
    text: string | number
    icon?: string
    color?: string
  }
  block?: boolean
}>()

const isExternal = computed(() => props.external || (props.href?.startsWith("http") ?? false))
</script>

<template>
  <component
    :is="props.href ? 'a' : 'div'"
    v-if="!props.loading"
    class="items-center gap-1.5 rounded-md border border-black/5 bg-black/3 px-2 py-1 text-xs transition-colors dark:border-white/10 dark:bg-white/5"
    :class="[
      props.block ? 'flex w-full justify-between' : 'inline-flex',
      props.href
        ? 'hover:border-black/10 hover:bg-black/5 dark:hover:border-white/20 dark:hover:bg-white/10'
        : ''
    ]"
    :href="props.href || undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <div class="flex items-center gap-1.5">
      <UIcon
        v-if="props.icon"
        class="size-3 shrink-0 opacity-70"
        :name="props.icon"
      />
      <span
        v-if="props.label"
        class="whitespace-nowrap text-gray-600 dark:text-white/70"
      >
        {{ props.label }}
      </span>
      <span
        v-if="props.value !== undefined"
        class="line-clamp-1 font-semibold text-gray-900 dark:text-white"
        :title="`${props.label}: ${props.value}`"
        :style="props.color ? { color: props.color } : undefined"
      >
        {{ props.value }}
      </span>
      <span
        v-if="props.tag"
        class="flex h-4 items-center gap-1 rounded px-1.5 text-[10px] font-medium"
        :style="
          props.tag.color
            ? { backgroundColor: `${props.tag.color}20`, color: props.tag.color }
            : {
                backgroundColor: 'var(--ui-bg-accent, rgba(0,0,0,0.05))',
                color: 'var(--ui-text-muted, rgba(0,0,0,0.6))'
              }
        "
        :class="{ 'dark:bg-white/10! dark:text-white/70!': !props.tag.color }"
      >
        {{ props.tag.text }}
        <UIcon
          v-if="props.tag.icon"
          class="-mt-px size-2.5 opacity-60"
          :name="props.tag.icon"
        />
      </span>
    </div>
    <UIcon
      v-if="props.trailingIcon"
      class="size-3 shrink-0 opacity-60"
      :name="props.trailingIcon"
    />
  </component>
  <div
    v-else
    class="inline-flex h-6 w-16 animate-pulse rounded-md bg-black/5 dark:bg-white/10"
  />
</template>
