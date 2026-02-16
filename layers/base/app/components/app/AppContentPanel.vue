<template>
  <main class="flex-1 pt-8 pb-14 lg:pl-8">
    <div
      class="relative min-h-[50vh] rounded-xl border border-white/5 bg-white/2 p-6 shadow-2xl backdrop-blur-sm lg:p-10"
    >
      <div
        class="via-primary-500/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
      <slot />
    </div>
  </main>
</template>
