<script setup lang="ts">
import UIButton from "@/components/UIButton.vue"

const date = new Date().toLocaleDateString("ru-RU").split(".").reverse().join("-")
</script>

<template>
  <UIButton
    rel="noreferrer"
    :href="`/CV_DavidAganov.pdf?v=${date}`"
    :download="`CV_DavidAganov_${date}.pdf`"
  >
    <i class="mdi mdi-download" />
    {{ $t("about.download") }}
  </UIButton>
</template>

<style scoped lang="scss">
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  white-space: nowrap;

  .mdi {
    font-size: 22px;
  }
}
</style>
