<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: "RSS feed",
    description: "Subscribe to updates from aganov.dev."
  }
)
</script>

<template>
  <div class="relative flex h-screen w-full bg-[#0b0b0b] text-center font-[Inter] text-slate-50">
    <div class="absolute top-0 left-0 flex h-screen w-full">
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            id="grid"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(249, 115, 22, 0.18)"
              stroke-width="1"
            />
          </pattern>

          <radialGradient
            cx="50%"
            cy="50%"
            r="50%"
            id="vignette"
          >
            <stop
              offset="40%"
              stop-color="#0b0b0b"
              stop-opacity="0"
            />
            <stop
              offset="100%"
              stop-color="#0b0b0b"
              stop-opacity="0.95"
            />
          </radialGradient>

          <radialGradient
            cx="100%"
            cy="0%"
            r="70%"
            id="feedGlow"
          >
            <stop
              offset="0%"
              stop-color="rgba(249, 115, 22, 0.28)"
            />
            <stop
              offset="100%"
              stop-color="rgba(249, 115, 22, 0)"
            />
          </radialGradient>
        </defs>

        <rect
          width="1200"
          height="630"
          fill="url(#grid)"
        />
        <rect
          width="1200"
          height="630"
          fill="url(#vignette)"
        />
        <rect
          width="1200"
          height="630"
          fill="url(#feedGlow)"
        />
      </svg>
    </div>

    <div
      class="absolute top-0 left-0 flex h-screen w-full flex-col items-center justify-center p-14"
    >
      <div
        class="relative flex flex-col items-center"
        style="margin-top: -20px"
      >
        <div
          class="mb-8 flex items-center rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-base font-medium text-orange-200"
        >
          RSS
        </div>
        <div class="flex text-8xl leading-tight font-bold tracking-tight">
          {{ props.title }}
        </div>
        <div class="mt-6 flex max-w-[800px] text-4xl leading-snug text-slate-400">
          {{ props.description }}
        </div>
      </div>
    </div>
  </div>
</template>
