<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    blur?: boolean
  }>(),
  {
    blur: false
  }
)

const { t } = useI18n()
const colorMode = useColorMode()

const preference = computed({
  get: () => colorMode.preference,
  set: (val) => (colorMode.preference = val as "system" | "light" | "dark")
})

const themeItems = computed(() => [
  {
    value: "system" as const,
    icon: "i-lucide-monitor",
    a11yLabel: t("components.themeToggle.system")
  },
  { value: "light" as const, icon: "i-lucide-sun", a11yLabel: t("components.themeToggle.light") },
  { value: "dark" as const, icon: "i-lucide-moon", a11yLabel: t("components.themeToggle.dark") }
])

const setPreference = (val: "system" | "light" | "dark") => {
  preference.value = val
}
</script>

<template>
  <div
    role="toolbar"
    class="flex h-8 shrink-0 items-center gap-0.5 rounded-lg border border-black/10 bg-black/5 p-0.5 dark:border-white/20 dark:bg-white/10"
    :aria-label="$t('components.themeToggle.aria')"
    :class="props.blur ? 'backdrop-blur-sm' : ''"
  >
    <button
      v-for="opt in themeItems"
      type="button"
      class="focus-visible:ring-primary-500 flex size-6.5 shrink-0 items-center justify-center rounded-md p-0 text-gray-700 ring-offset-(--ui-bg) transition-colors outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-2 dark:text-white"
      :class="
        preference === opt.value
          ? 'text-primary-500 dark:text-primary-400 bg-white shadow-sm dark:bg-white/15'
          : 'hover:text-primary-500 dark:hover:text-primary-400'
      "
      :aria-pressed="preference === opt.value"
      :aria-label="opt.a11yLabel"
      :key="opt.value"
      @click="setPreference(opt.value)"
    >
      <UIcon
        class="size-4"
        aria-hidden="true"
        :name="opt.icon"
      />
    </button>
  </div>
</template>
