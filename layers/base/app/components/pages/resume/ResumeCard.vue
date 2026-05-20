<script setup lang="ts">
import type { ResumeExperienceView } from "@base/types"

const props = defineProps<{
  project: ResumeExperienceView["projects"][number]
}>()
</script>

<template>
  <UiSpotlightCard
    variant="resume"
    content-class="space-y-3"
  >
    <div v-if="props.project.name || props.project.subtitle">
      <p
        v-if="props.project.name"
        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
      >
        {{ props.project.name }}
        <span
          v-if="props.project.subtitle"
          class="font-normal text-gray-500 dark:text-gray-400"
        >
          — {{ props.project.subtitle }}
        </span>
      </p>
      <p
        v-else-if="props.project.subtitle"
        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
      >
        {{ props.project.subtitle }}
      </p>
    </div>
    <ul class="space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      <li
        v-for="(item, index) in props.project.items"
        class="flex gap-3"
        :key="index"
      >
        <span
          class="mt-2 size-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-gray-500"
          aria-hidden="true"
        />
        <span
          v-html="item"
          class="resume-html min-w-0 flex-1 leading-relaxed text-inherit [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100"
        />
      </li>
    </ul>
    <p
      v-if="props.project.stack"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      <span class="font-medium text-gray-600 dark:text-gray-300">
        {{ $t("pages.resume.stack") }}:
      </span>
      {{ props.project.stack }}
    </p>
  </UiSpotlightCard>
</template>
