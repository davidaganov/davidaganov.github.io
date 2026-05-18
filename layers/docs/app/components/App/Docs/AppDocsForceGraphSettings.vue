<script setup lang="ts">
const attraction = defineModel<number>("attraction", { default: 70 })
const repulsion = defineModel<number>("repulsion", { default: 70 })
const linkPull = defineModel<number>("linkPull", { default: 70 })
const nodeGap = defineModel<number>("nodeGap", { default: 25 })

const items = [
  {
    key: "attraction" as const,
    labelKey: "docs.graph.forcesAttraction"
  },
  {
    key: "repulsion" as const,
    labelKey: "docs.graph.forcesRepulsion"
  },
  {
    key: "linkPull" as const,
    labelKey: "docs.graph.forcesLink"
  },
  {
    key: "nodeGap" as const,
    labelKey: "docs.graph.forcesDistance"
  }
]

const models = {
  attraction,
  repulsion,
  linkPull,
  nodeGap
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0">
    <div
      class="pointer-events-auto absolute top-5 right-5 z-20 w-[min(18rem,calc(100%-1.5rem))] overflow-x-hidden overflow-y-hidden rounded-xl border border-black/15 bg-(--ui-bg)/88 shadow-lg backdrop-blur-md dark:border-white/12 dark:bg-(--ui-bg)/80"
    >
      <UCollapsible
        class="px-2 py-3"
        :default-open="true"
      >
        <template #default="{ open }">
          <div
            class="flex w-full cursor-pointer items-center justify-between gap-2 px-2 text-xs font-semibold tracking-wide text-gray-800 dark:text-gray-100"
          >
            {{ $t("docs.graph.forcesTitle") }}
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400"
              :class="[open && 'rotate-180']"
            />
          </div>
        </template>
        <template #content>
          <div class="mt-3 space-y-4 px-2 pb-2">
            <div
              v-for="item in items"
              :key="item.key"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <label class="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                  {{ $t(item.labelKey) }}
                </label>
                <span class="text-[10px] text-gray-400">{{ models[item.key].value }}%</span>
              </div>
              <USlider
                v-model="models[item.key].value"
                :min="0"
                :max="100"
              />
            </div>
          </div>
        </template>
      </UCollapsible>
    </div>
  </div>
</template>
