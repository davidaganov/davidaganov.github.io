<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    bare?: boolean
  }>(),
  { bare: false }
)
</script>

<template>
  <main
    v-if="!props.bare"
    class="min-w-0 flex-1 pt-4 pb-14 lg:pl-6"
  >
    <div
      class="relative min-h-[50vh] min-w-0 overflow-hidden md:rounded-xl md:border md:border-white/5 md:bg-white/2 md:p-6 md:shadow-2xl md:backdrop-blur-sm lg:p-10"
    >
      <div
        class="md:via-primary-500/20 md:absolute md:inset-x-0 md:top-0 md:h-px md:bg-linear-to-r md:from-transparent md:to-transparent"
      />
      <slot />
    </div>
  </main>

  <div
    v-else
    class="flex min-h-0 min-w-0 flex-1 flex-col pb-4 lg:pl-0"
  >
    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
