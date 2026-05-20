<script setup lang="ts">
import ResumeCard from "@base/components/pages/resume/ResumeCard.vue"
import type { ResumeExperienceView } from "@base/types"

const resumeHtmlClass =
  "resume-html min-w-0 flex-1 leading-relaxed text-inherit [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100"

defineProps<{
  job: ResumeExperienceView
}>()
</script>

<template>
  <article
    class="space-y-3 border-b border-black/10 pb-8 last:border-b-0 last:pb-0 dark:border-white/8"
  >
    <div class="space-y-1">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
          {{ job.company }}
        </h3>
        <span
          v-if="job.duration"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ job.duration }}
        </span>
      </div>
      <p class="text-base text-gray-700 dark:text-gray-300">
        {{ job.role }}
      </p>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        <span class="inline-flex items-center gap-1.5">
          <UIcon
            name="i-lucide-calendar"
            aria-hidden="true"
            class="size-3.5 shrink-0"
          />
          {{ job.period }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <UIcon
            name="i-lucide-map-pin"
            aria-hidden="true"
            class="size-3.5 shrink-0"
          />
          {{ job.location }}
        </span>
      </div>
    </div>

    <div
      v-if="job.intro"
      v-html="job.intro"
      :class="resumeHtmlClass"
    />

    <ul
      v-if="job.items.length"
      class="space-y-2 text-base text-gray-700 dark:text-gray-300"
    >
      <li
        v-for="(item, itemIndex) in job.items"
        class="flex gap-3 leading-relaxed"
        :key="itemIndex"
      >
        <span
          class="mt-2.5 size-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-gray-500"
          aria-hidden="true"
        />
        <span
          v-html="item"
          :class="resumeHtmlClass"
        />
      </li>
    </ul>

    <p
      v-if="job.stack"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      <span class="font-medium text-gray-600 dark:text-gray-300">
        {{ $t("pages.resume.stack") }}:
      </span>
      {{ job.stack }}
    </p>

    <div
      v-if="job.projects.length"
      class="space-y-4"
    >
      <ResumeCard
        v-for="(project, projectIndex) in job.projects"
        :key="projectIndex"
        :project="project"
      />
    </div>
  </article>
</template>
