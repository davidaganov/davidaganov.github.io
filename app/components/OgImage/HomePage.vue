<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: "Portfolio",
    description: "Frontend Developer — 5 years of commercial experience."
  }
)
</script>

<template>
  <div
    class="relative flex h-screen w-full bg-[#0b0b0b] text-center font-[Inter,Segoe_UI,Arial,sans-serif] text-slate-50"
  >
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
              stroke="rgba(184, 126, 239, 0.15)"
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

          <!-- Unique gradient for Home Page -->
          <radialGradient
            cx="0%"
            cy="0%"
            r="80%"
            id="homeGlow"
          >
            <stop
              offset="0%"
              stop-color="rgba(184, 126, 239, 0.25)"
            />
            <stop
              offset="100%"
              stop-color="rgba(184, 126, 239, 0)"
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
          fill="url(#homeGlow)"
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
          class="mb-8 flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-base font-medium text-slate-300"
        >
          <span class="mr-2.5 h-3 w-3 rounded-full bg-[#b87eef]" />
          aganov.dev
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
