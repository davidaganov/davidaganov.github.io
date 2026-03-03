<script setup lang="ts">
const props = defineProps<{
  type: "frontend" | "backend"
}>()

const { frontendYears, backendYears } = useExperience()

const value = computed(() => (props.type === "frontend" ? frontendYears.value : backendYears.value))

// Format: whole numbers shown as integers (e.g. 5), halves as decimals (e.g. 1.5)
const formatted = computed(() =>
  Number.isInteger(value.value) ? String(value.value) : value.value.toFixed(1)
)
</script>

<template>
  <span>{{ formatted }}</span>
</template>
