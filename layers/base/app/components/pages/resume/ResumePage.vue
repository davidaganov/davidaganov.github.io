<script setup lang="ts">
import { useResumeData } from "@base/composables/useResumeData"
import ResumeExperienceJob from "@base/components/pages/resume/ResumeExperienceJob.vue"
import ResumePageHeader from "@base/components/pages/resume/ResumePageHeader.vue"
import ResumeSkillsPanel from "@base/components/pages/resume/ResumeSkillsPanel.vue"

const { content, experience } = useResumeData()
</script>

<template>
  <article class="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
    <ResumePageHeader />

    <section class="mt-10 space-y-3">
      <h2 class="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
        {{ $t("pages.resume.sections.summary") }}
      </h2>
      <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
        {{ content.summary }}
      </p>
    </section>

    <section class="mt-10 pb-4">
      <h2 class="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
        {{ $t("pages.resume.sections.skills") }}
      </h2>

      <ResumeSkillsPanel class="mt-5" />
    </section>

    <section class="mt-10 space-y-6">
      <h2 class="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
        {{ $t("pages.resume.sections.experience") }}
      </h2>

      <div class="space-y-8">
        <ResumeExperienceJob
          v-for="(job, index) in experience"
          :key="index"
          :job="job"
        />
      </div>
    </section>
  </article>
</template>
