<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href?: string
    class?: string
    disabled?: boolean
  }>(),
  {
    href: undefined,
    class: "",
    disabled: false
  }
)
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="['btn', props.class]"
    v-bind="$attrs"
  >
    <slot />
  </a>
  <button
    v-else
    :class="['btn', props.class]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-block;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  transition: all 0.3s;
  cursor: pointer;

  &:not(:disabled) {
    &:hover {
      transform: translateY(-1.5px);
      box-shadow: 2px 2px 0 1px var(--color-accent);
    }

    &:focus-visible {
      background-color: var(--color-accent);
      color: var(--color-white);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 576px) {
    padding: 15px 65px;
    font: 400 14px/19px var(--second-font);
  }

  @media (max-width: 575px) {
    padding: 15px 35px;
    font: 400 10px/15px var(--second-font);
  }
}
</style>
