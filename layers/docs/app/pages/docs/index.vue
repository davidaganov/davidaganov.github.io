<script setup lang="ts">
import { getFirstPathForFirstSection } from "@docs/utils/sections"

const localePath = useLocalePath()

await navigateTo(localePath(getFirstPathForFirstSection()), { replace: true })
</script>

<template>
  <div />
</template>
