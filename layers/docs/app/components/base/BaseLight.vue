<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    light?: number
  }>(),
  {
    light: 0.3
  }
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    class="text-primary pointer-events-none absolute top-26 -z-10 w-full shrink-0 transition-opacity duration-500 ease-in-out"
    viewBox="0 0 1440 181"
    :style="{ opacity: props.light }"
  >
    <mask
      fill="#fff"
      id="c"
    >
      <path d="M0 0h1440v181H0z" />
    </mask>
    <path
      fill="url(#a)"
      fill-opacity=".22"
      d="M0 0h1440v181H0z"
    />
    <path
      fill="url(#b)"
      d="M0 2h1440v-4H0z"
      mask="url(#c)"
    />
    <defs>
      <linearGradient
        x1="720"
        x2="720"
        y1="0"
        y2="181"
        gradientUnits="userSpaceOnUse"
        id="a"
      >
        <stop stop-color="currentColor" />
        <stop
          offset="1"
          stop-color="currentColor"
          stop-opacity="0"
        />
      </linearGradient>
      <linearGradient
        x1="0"
        x2="1440"
        y1="90.5"
        y2="90.5"
        gradientUnits="userSpaceOnUse"
        id="b"
      >
        <stop
          stop-color="currentColor"
          stop-opacity="0"
        />
        <stop
          offset=".4"
          stop-color="currentColor"
        />
        <stop
          offset="1"
          stop-color="currentColor"
          stop-opacity="0"
        />
      </linearGradient>
    </defs>
  </svg>
</template>
