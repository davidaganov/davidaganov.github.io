<script setup lang="ts">
import AppRightSidebarCard from "@docs/components/app/right-sidebar/AppRightSidebarCard.vue"
import { useAvatar } from "@base/composables/useAvatar"
import { USERNAME } from "@base/constants/config"

const props = withDefaults(
  defineProps<{
    platformUrl: string
    platformLabel: string
    platformIcon: string
    platformBg: string
    iconColorClass?: string
    statsCols?: number
    stats: {
      label: string
      value: string
      icon: string
      href?: string
      external?: boolean
    }[]
  }>(),
  {
    iconColorClass: "size-2 text-white",
    statsCols: 2
  }
)

const { avatarUrl } = useAvatar()
</script>

<template>
  <AppRightSidebarCard>
    <div class="flex items-center gap-3">
      <div class="relative">
        <img
          alt="Avatar"
          class="size-12 rounded-full"
          :src="avatarUrl"
        />
        <div
          class="absolute right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full"
          :class="props.platformBg"
        >
          <UIcon
            :name="props.platformIcon"
            :class="props.iconColorClass"
          />
        </div>
      </div>
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {{ $t("global.name") }}
        </div>
        <div class="text-muted truncate text-xs">@{{ USERNAME }}</div>
      </div>
    </div>

    <hr class="my-3 border-black/15 dark:border-white/10" />

    <div
      class="grid gap-2"
      :class="props.statsCols === 2 ? 'grid-cols-2' : ''"
    >
      <UiBadge
        v-for="stat in props.stats"
        class="col-span-1"
        :icon="stat.icon"
        :external="stat.external"
        :label="stat.label"
        :value="stat.value"
        :href="stat.href"
        :key="stat.label"
      />
    </div>

    <UButton
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      variant="soft"
      class="mt-3"
      block
      :icon="props.platformIcon"
      :href="props.platformUrl"
    >
      {{ props.platformLabel }}
    </UButton>
  </AppRightSidebarCard>
</template>
