<script setup lang="ts">
interface ProseTabItem {
  label: string
  value?: string
  slot?: string
  content?: string
}

const props = withDefaults(
  defineProps<{
    items?: ProseTabItem[]
    defaultValue?: string
    modelValue?: string
    ui?: Record<string, string>
  }>(),
  {
    defaultValue: "0",
    modelValue: undefined,
    items: () => [],
    ui: () => ({})
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const tabItems = computed(() =>
  props.items.map((item, index) => ({
    ...item,
    value: item.value ?? String(index),
    slot: item.slot ?? `tab-${index}`
  }))
)

const internalValue = ref(props.defaultValue)

const activeValue = computed({
  get: () => props.modelValue ?? internalValue.value,
  set: (value) => {
    if (props.modelValue === undefined) {
      internalValue.value = value
    }
    emit("update:modelValue", value)
  }
})

const tabsUi = computed(() => ({
  list: "rounded-lg w-fit border mr-auto border-white/8 bg-white/2 py-0.5 px-1",
  trigger:
    "rounded-md px-3 py-2 text-xs font-medium data-[state=active]:text-white data-[state=inactive]:text-muted data-[state=inactive]:hover:text-white",
  indicator: "rounded-md bg-white/8",
  ...props.ui
}))
</script>

<template>
  <div class="w-full">
    <UTabs
      v-model="activeValue"
      :items="tabItems"
      :ui="tabsUi"
    >
      <template
        v-for="item in tabItems"
        #[item.slot]="slotProps"
        :key="`slot-${item.value}`"
      >
        <slot
          :name="item.slot"
          v-bind="slotProps"
        >
          <div
            v-if="item.content"
            class="text-muted text-sm"
          >
            {{ item.content }}
          </div>
        </slot>
      </template>
    </UTabs>
  </div>
</template>
