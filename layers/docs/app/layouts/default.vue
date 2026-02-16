<script setup lang="ts">
import AppContentPanel from "@docs/components/app/AppContentPanel.vue"
import AppLeftSidebar from "@docs/components/app/AppLeftSidebar.vue"
import AppFooter from "@base/components/app/AppFooter.vue"
import AppHeader from "@base/components/app/AppHeader.vue"

const { toggle, close } = useCommandPalette()

defineShortcuts({
  meta_k: () => {
    toggle()
  },
  ctrl_k: () => {
    toggle()
  },
  escape: {
    usingInput: true,
    handler: () => close()
  }
})
</script>

<template>
  <div>
    <AppHeader />
    <svg
      viewBox="0 0 1440 181"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="text-primary pointer-events-none absolute top-18 -z-10 w-full shrink-0 opacity-30"
    >
      <mask
        fill="white"
        id="path-1-inside-1_414_5526"
      >
        <path d="M0 0H1440V181H0V0Z" />
      </mask>
      <path
        d="M0 0H1440V181H0V0Z"
        fill="url(#paint0_linear_414_5526)"
        fill-opacity="0.22"
      />
      <path
        d="M0 2H1440V-2H0V2Z"
        fill="url(#paint1_linear_414_5526)"
        mask="url(#path-1-inside-1_414_5526)"
      />
      >
      <defs>
        <linearGradient
          x1="720"
          y1="0"
          x2="720"
          y2="181"
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_414_5526"
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
          y1="90.5"
          x2="1440"
          y2="90.5"
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_414_5526"
        >
          <stop
            stop-color="currentColor"
            stop-opacity="0"
          />
          <stop
            offset="0.395"
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

    <div class="container">
      <div class="flex">
        <AppLeftSidebar />
        <div class="flex flex-1">
          <AppContentPanel>
            <slot />
          </AppContentPanel>

          <div
            class="hidden w-[300px] shrink-0 lg:block lg:pl-8"
            id="app-right-sidebar-root"
          />
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
