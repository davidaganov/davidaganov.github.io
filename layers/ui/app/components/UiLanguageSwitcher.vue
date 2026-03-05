<script setup lang="ts">
import { AVAILABLE_LOCALES } from "@base/constants"
import { LOCALE } from "@base/types/enums"

const props = withDefaults(
  defineProps<{
    blur?: boolean
  }>(),
  {
    blur: false
  }
)

const { locale, setLocale } = useI18n()

const currentLocale = computed({
  get: () => locale.value as LOCALE,
  set: (value: LOCALE) => setLocale(value)
})

const baseClass = computed(() => {
  const classes = [
    "bg-black/5",
    "dark:bg-white/10",
    "text-gray-700",
    "dark:text-white",
    "border",
    "border-black/10",
    "dark:border-white/20",
    "ring-0"
  ]

  if (props.blur) {
    classes.push("backdrop-blur-sm")
  }

  return classes.join(" ")
})
</script>

<template>
  <USelect
    v-model="currentLocale"
    size="sm"
    class="h-[30px] w-21"
    icon="i-lucide-globe"
    :items="AVAILABLE_LOCALES"
    :ui="{
      base: baseClass,
      leadingIcon: 'text-gray-700 dark:text-primary-400',
      trailingIcon: 'text-gray-700 dark:text-primary-400',
      content:
        'dark:bg-[#0d1626]/90 bg-white/90 border ring-0 backdrop-blur-sm dark:border-white/20 border-black/10',
      item: 'dark:text-white text-gray-700 dark:bg-black/20 bg-gray-50 my-0.5 first:mt-0 last:mb-0 dark:hover:bg-black/30 hover:bg-gray-100 cursor-pointer rounded-md'
    }"
  />
</template>
