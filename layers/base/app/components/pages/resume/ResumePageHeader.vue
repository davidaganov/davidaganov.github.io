<script setup lang="ts">
import { useExperience } from "@base/composables/useExperience"
import { useResumeData } from "@base/composables/useResumeData"
import { useResumePdf } from "@base/composables/useResumePdf"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"
import { ROUTE_PATH } from "@base/types"

const localePath = useLocalePath()
const { frontendYears, backendYears } = useExperience()
const { content, employmentFormat, employmentType, contacts } = useResumeData()
const { isGenerating, downloadPdf } = useResumePdf()

const contactLinks = computed(() => [
  { label: "GitHub", href: contacts.github, icon: "i-simple-icons-github" },
  { label: "Email", href: `mailto:${contacts.email}`, icon: "i-lucide-mail" },
  { label: "Habr", href: contacts.habr, icon: "i-simple-icons-habr" },
  { label: "NPM", href: contacts.npm, icon: "i-simple-icons-npm" }
])
</script>

<template>
  <header class="space-y-6 border-b border-black/10 pb-8 dark:border-white/10">
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:flex-wrap">
      <NuxtLink
        class="-order-1 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 sm:inline-flex dark:text-gray-400 dark:hover:text-gray-200"
        :to="localePath(ROUTE_PATH.HOME)"
      >
        <UIcon
          name="i-lucide-arrow-left"
          aria-hidden="true"
          class="size-5"
        />
        {{ $t("pages.resume.backToSite") }}
      </NuxtLink>
      <div>
        <h1
          class="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white"
        >
          {{ $t("global.name") }}
        </h1>
        <p class="mt-1 text-lg text-gray-600 dark:text-gray-300">
          {{ content.role }}
        </p>
      </div>
      <div class="-order-1 flex items-center gap-3">
        <span
          class="inline-flex h-8 items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300"
        >
          {{ $t("pages.home.badge") }}
        </span>
        <UiThemeToggle />
      </div>
    </div>

    <dl class="grid max-w-96 gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="text-gray-500 dark:text-gray-400">
          {{ $t("pages.resume.employmentFormat") }}
        </dt>
        <dd class="font-medium text-gray-900 dark:text-gray-100">{{ employmentFormat }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 dark:text-gray-400">{{ $t("pages.resume.employmentType") }}</dt>
        <dd class="font-medium text-gray-900 dark:text-gray-100">{{ employmentType }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 dark:text-gray-400">
          {{ $t("pages.resume.experienceFrontend") }}
        </dt>
        <dd class="font-medium text-gray-900 dark:text-gray-100">
          {{ $t("pages.resume.years", { count: frontendYears }) }}
        </dd>
      </div>
      <div>
        <dt class="text-gray-500 dark:text-gray-400">
          {{ $t("pages.resume.experienceBackend") }}
        </dt>
        <dd class="font-medium text-gray-900 dark:text-gray-100">
          {{ $t("pages.resume.years", { count: backendYears }) }}
        </dd>
      </div>
    </dl>

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <UButton
        size="lg"
        color="primary"
        variant="solid"
        icon="i-simple-icons-telegram"
        target="_blank"
        rel="noopener noreferrer"
        :href="contacts.telegramUrl"
        :label="contacts.telegram"
      />
      <UButton
        size="lg"
        color="neutral"
        variant="outline"
        icon="i-lucide-download"
        :loading="isGenerating"
        :disabled="isGenerating"
        :label="isGenerating ? $t('pages.resume.generatingPdf') : $t('global.actions.download')"
        @click="downloadPdf"
      />
    </div>

    <nav
      class="flex flex-wrap gap-x-4 gap-y-2 text-sm"
      aria-label="Contacts"
    >
      <a
        v-for="link in contactLinks"
        class="inline-flex items-center gap-1.5 font-medium text-gray-600 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
        :key="link.label"
        :href="link.href"
      >
        <UIcon
          aria-hidden="true"
          class="size-3.5"
          :name="link.icon"
        />
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>
