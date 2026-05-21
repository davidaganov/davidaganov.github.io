<script setup lang="ts">
import { useExperience } from "@base/composables/useExperience"

const props = defineProps<{
  type: "frontend" | "backend"
}>()

const { frontendYears, backendYears } = useExperience()

const value = computed(() => (props.type === "frontend" ? frontendYears.value : backendYears.value))

const formatted = computed(() => {
  return Number.isInteger(value.value) ? String(value.value) : value.value.toFixed(1)
})
</script>

<template>
  <span>{{ formatted }}</span>
</template>
