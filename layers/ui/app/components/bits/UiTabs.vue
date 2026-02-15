<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue"

interface TabItem {
  value: string
  label?: string
  icon?: string
}

const props = defineProps<{
  modelValue: string
  items: TabItem[]
  disabled?: boolean
  hideLabel?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const itemsRef = ref<Map<string, HTMLElement>>(new Map())
const pillStyle = ref({
  width: "0px",
  transform: "translateX(0px)"
})

const setItemRef = (el: any, key: string) => {
  if (el) itemsRef.value.set(key, el as HTMLElement)
}

const updatePill = () => {
  if (!props.modelValue) return

  const activeEl = itemsRef.value.get(props.modelValue)
  if (activeEl && rootRef.value) {
    const left = activeEl.offsetLeft
    const width = activeEl.offsetWidth

    pillStyle.value = {
      width: `${width}px`,
      transform: `translateX(${left}px)`
    }
  }
}

const handleUpdate = (value: string) => {
  if (props.disabled) return
  emit("update:modelValue", value)
}

watch(
  () => props.modelValue,
  () => {
    nextTick(updatePill)
  }
)

watch(
  () => props.items,
  () => {
    nextTick(updatePill)
  },
  { deep: true }
)

onMounted(() => {
  updatePill()
  window.addEventListener("resize", updatePill)
})

onUnmounted(() => {
  window.removeEventListener("resize", updatePill)
})
</script>

<template>
  <div
    class="relative inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md"
    role="tablist"
    ref="rootRef"
  >
    <!-- Background Pill -->
    <div
      class="absolute top-1 left-0 h-[calc(100%-8px)] rounded-[18px] bg-white/10 transition-all will-change-transform"
      :style="pillStyle"
    />

    <!-- Tab Buttons -->
    <button
      v-for="item in items"
      type="button"
      class="relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none"
      :class="[
        modelValue === item.value ? 'text-white' : 'text-gray-400 hover:text-white',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      ]"
      :disabled="disabled"
      :key="item.value"
      :ref="(el) => setItemRef(el, item.value)"
      @click="handleUpdate(item.value)"
    >
      <div class="flex items-center justify-center gap-2">
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          :class="hideLabel ? 'size-5' : 'size-4'"
        />
        <span v-if="item.label && !hideLabel">{{ item.label }}</span>
        <span
          v-else-if="item.label && hideLabel"
          class="sr-only"
        >
          {{ item.label }}
        </span>
      </div>
    </button>
  </div>
</template>
