<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    blur?: boolean
  }>(),
  {
    blur: false
  }
)

const colorMode = useColorMode()

const themeItems = [
  { value: "system", icon: "i-lucide-monitor" },
  { value: "light", icon: "i-lucide-sun" },
  { value: "dark", icon: "i-lucide-moon" }
]

const preference = computed({
  get: () => colorMode.preference,
  set: (val) => (colorMode.preference = val as "system" | "light" | "dark")
})
</script>

<template>
  <UTabs
    v-model="preference"
    :items="themeItems"
    :content="false"
    :ui="{
      root: 'flex items-center',
      list: [
        'flex items-center gap-0.5 p-0.5 rounded-lg border h-[30px] border-black/10 bg-black/5 dark:border-white/20 dark:bg-white/10',
        props.blur ? 'backdrop-blur-sm' : ''
      ],
      indicator: 'bg-white dark:bg-white/15 shadow-sm rounded-md inset-y-0.5',
      trigger: [
        'flex h-full w-8 items-center justify-center rounded-md p-0',
        'text-gray-700 dark:text-white',
        'data-[state=inactive]:hover:text-primary-500 dark:data-[state=inactive]:hover:text-primary-400',
        'data-[state=active]:text-primary-500 dark:data-[state=active]:text-primary-400',
        'focus-visible:ring-0 transition-colors'
      ]
    }"
  >
    <template #leading="{ item }">
      <UIcon
        class="size-4"
        :name="item.icon"
      />
    </template>
  </UTabs>
</template>
