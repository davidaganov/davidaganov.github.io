<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: "",
    description: ""
  }
)

const slots = useSlots()
const { t } = useI18n()

const hasTitleSlot = computed(() => Boolean(slots.title))
const hasPreviewSlot = computed(() => Boolean(slots.preview))
const hasCodeSlot = computed(() => Boolean(slots.code))

const tabItems = computed(() => [
  {
    label: t("components.playground.preview"),
    slot: "preview"
  },
  {
    label: t("components.playground.code"),
    slot: "code"
  }
])
</script>

<template>
  <div>
    <div class="flex flex-col gap-4">
      <div v-if="props.title || props.description || hasTitleSlot">
        <slot name="title">
          <h2
            v-if="props.title"
            class="text-xl font-semibold text-white"
          >
            {{ props.title }}
          </h2>
          <p
            v-if="props.description"
            class="text-muted mt-1 text-sm"
          >
            {{ props.description }}
          </p>
        </slot>
      </div>

      <ProseTabs
        default-value="0"
        class="w-full"
        :items="tabItems"
      >
        <template #preview>
          <div class="mt-2">
            <slot name="preview">
              <div
                v-if="!hasPreviewSlot"
                class="text-muted text-sm"
              >
                {{ $t("components.playground.previewEmpty") }}
              </div>
            </slot>
          </div>
        </template>

        <template #code>
          <div class="mt-2">
            <slot name="code" />
            <div
              v-if="!hasCodeSlot"
              class="text-muted text-sm"
            >
              {{ $t("components.playground.codeEmpty") }}
            </div>
          </div>
        </template>
      </ProseTabs>
    </div>
  </div>
</template>
