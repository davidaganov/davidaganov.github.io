<script setup lang="ts">
import { AVAILABLE_LOCALES } from "@base/constants"
import { LOCALE } from "@base/types/enums"

const { locale, setLocale } = useI18n()

const currentLocale = computed({
  get: () => locale.value as LOCALE,
  set: (value: LOCALE) => setLocale(value)
})
</script>

<template>
  <USelect
    v-model="currentLocale"
    size="sm"
    class="w-20"
    :items="AVAILABLE_LOCALES"
    :ui="{
      base: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
      menu: 'bg-black/90 border-white/20',
      option: 'text-white hover:bg-white/10'
    }"
  />
</template>
