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

const hasTitleSlot = computed(() => Boolean(slots.title))
const hasPreviewSlot = computed(() => Boolean(slots.preview))
const hasCodeSlot = computed(() => Boolean(slots.code))

const tabsUi = {
  root: "gap-3",
  list: "inline-flex w-fit self-start rounded-xl border border-white/10 bg-white/5 p-1",
  indicator: "rounded-lg bg-primary/20",
  trigger:
    "rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-white data-[state=active]:bg-primary/15 data-[state=active]:text-primary",
  content: "mt-2"
}
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
        :ui="tabsUi"
      >
        <ProseTabsItem :label="$t('tools.playground.preview')">
          <div class="mt-2">
            <slot name="preview">
              <div
                v-if="!hasPreviewSlot"
                class="text-muted text-sm"
              >
                {{ $t("tools.playground.previewEmpty") }}
              </div>
            </slot>
          </div>
        </ProseTabsItem>

        <ProseTabsItem :label="$t('tools.playground.code')">
          <div class="mt-2">
            <slot name="code" />
            <div
              v-if="!hasCodeSlot"
              class="text-muted text-sm"
            >
              {{ $t("tools.playground.codeEmpty") }}
            </div>
          </div>
        </ProseTabsItem>
      </ProseTabs>
    </div>
  </div>
</template>
