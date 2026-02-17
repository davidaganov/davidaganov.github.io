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
  const classes = ["bg-white/10", "text-white", "border", "border-white/20", "ring-0"]

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
      content: 'bg-white/10 border ring-0 backdrop-blur-sm border-white/20',
      item: 'text-white bg-black/20 my-0.5 first:mt-0 last:mb-0 hover:bg-black/30 cursor-pointer rounded-md'
    }"
  />
</template>
