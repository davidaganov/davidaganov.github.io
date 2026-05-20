<script setup lang="ts">
import { useResumeData } from "@base/composables/useResumeData"
import { RESUME_SKILL_TAGS } from "@base/types"

const props = defineProps<{
  class?: string
}>()

const { skills, skillTagLabel } = useResumeData()

const groupStyle: Record<(typeof RESUME_SKILL_TAGS)[number], { dot: string; label: string }> = {
  frontend: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    label: "text-emerald-800 dark:text-emerald-300/90"
  },
  backend: {
    dot: "bg-sky-500 dark:bg-sky-400",
    label: "text-sky-800 dark:text-sky-300/90"
  },
  tooling: {
    dot: "bg-violet-500 dark:bg-violet-400",
    label: "text-violet-800 dark:text-violet-300/90"
  }
}

const skillGroups = computed(() => {
  const assigned = new Set<string>()

  return RESUME_SKILL_TAGS.map((tag) => {
    const items = skills
      .filter((skill) => skill.tags.includes(tag))
      .map((skill) => skill.name)
      .filter((name) => {
        if (assigned.has(name)) return false
        assigned.add(name)
        return true
      })

    return {
      tag,
      label: skillTagLabel(tag),
      items,
      style: groupStyle[tag]
    }
  }).filter((group) => group.items.length > 0)
})
</script>

<template>
  <div
    class="divide-y divide-black/8 rounded-2xl border border-black/10 bg-white shadow-sm dark:divide-white/8 dark:border-white/10 dark:bg-white/2 dark:shadow-none"
    :class="props.class"
  >
    <section
      v-for="group in skillGroups"
      class="px-5 py-5 sm:px-6 sm:py-6"
      :key="group.tag"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div class="flex shrink-0 items-center gap-2 sm:w-32 sm:pt-0.5">
          <span
            class="size-1.5 shrink-0 rounded-full"
            aria-hidden="true"
            :class="group.style.dot"
          />
          <h3
            class="text-[11px] font-semibold tracking-[0.14em] uppercase"
            :class="group.style.label"
          >
            {{ group.label }}
          </h3>
        </div>

        <p class="min-w-0 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <span
            v-for="(item, index) in group.items"
            :key="item"
          >
            <span class="text-gray-800 dark:text-gray-200">{{ item }}</span>
            <span
              v-if="index < group.items.length - 1"
              class="text-gray-400 dark:text-gray-600"
            >
              ·
            </span>
          </span>
        </p>
      </div>
    </section>
  </div>
</template>
