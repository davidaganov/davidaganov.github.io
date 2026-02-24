<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    section?: string
    collection?: string
  }>(),
  {
    title: "Documentation and notes",
    description: "Practical notes, guides, and tools from my portfolio.",
    section: "Documentation",
    collection: ""
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

          <linearGradient
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
            id="baseLightFade"
          >
            <stop
              offset="0%"
              stop-color="rgba(184, 126, 239, 0.15)"
            />
            <stop
              offset="100%"
              stop-color="rgba(184, 126, 239, 0)"
            />
          </linearGradient>

          <linearGradient
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
            id="baseLightLine"
          >
            <stop
              offset="0%"
              stop-color="rgba(184, 126, 239, 0)"
            />
            <stop
              offset="40%"
              stop-color="rgba(184, 126, 239, 0.4)"
            />
            <stop
              offset="60%"
              stop-color="rgba(184, 126, 239, 0.4)"
            />
            <stop
              offset="100%"
              stop-color="rgba(184, 126, 239, 0)"
            />
          </linearGradient>
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
          height="181"
          fill="url(#baseLightFade)"
        />

        <rect
          width="1200"
          height="4"
          fill="url(#baseLightLine)"
        />
      </svg>
    </div>

    <div
      class="absolute top-0 left-0 flex h-screen w-full flex-col items-center justify-between p-14"
    >
      <div />
      <div
        class="relative flex flex-col items-center"
        style="margin-top: -50px"
      >
        <div
          class="mb-6 flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300"
        >
          <span class="mr-2 h-2.5 w-2.5 rounded-full bg-[#b87eef]" />
          aganov.dev
        </div>
        <div class="flex text-7xl leading-tight font-bold">
          {{ props.title }}
        </div>
        <div class="mt-4 flex text-3xl leading-snug text-slate-400">
          {{ props.description }}
        </div>
      </div>
      <div class="relative flex items-center text-xl text-slate-400">
        <span>{{ props.section }}</span>
        <span
          v-if="props.collection"
          class="mx-3 opacity-40"
        >
          /
        </span>
        <span
          v-if="props.collection"
          class="text-slate-200"
        >
          {{ props.collection }}
        </span>
      </div>
    </div>
  </div>
</template>
