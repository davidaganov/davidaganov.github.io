<template>
  <div class="min-h-dvh bg-white text-gray-900 dark:bg-[#060a15] dark:text-gray-100">
    <AppStandaloneTopbar />
    <main
      id="main-content"
      tabindex="-1"
      class="mt-4 outline-none"
    >
      <slot />
    </main>
  </div>
</template>
