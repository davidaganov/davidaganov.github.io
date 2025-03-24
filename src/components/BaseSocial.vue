<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <ul class="social">
    <li class="item">
      <a
        href="https://github.com/davidaganov"
        class="link"
        :aria-label="$t('contacts.github')"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <title>GitHub</title>
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          />
        </svg>
      </a>
    </li>
    <li class="item">
      <a
        href="https://www.linkedin.com/in/david-aganov/"
        class="link"
        target="_blank"
        rel="noreferrer"
        :aria-label="$t('contacts.linkedin')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <title>LinkedIn</title>
          <path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
          />
          <rect
            x="2"
            y="9"
            width="4"
            height="12"
          />
          <circle
            cx="4"
            cy="4"
            r="2"
          />
        </svg>
      </a>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.social {
  @media (min-width: 1000px) {
    position: fixed;
    bottom: 50px;
    left: 0;
  }

  @media (max-width: 999px) {
    display: flex;
    align-items: center;
  }
}

.item {
  @media (min-width: 1000px) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;

    &::before {
      content: "";
      position: absolute;
      display: block;
      width: 23px;
      height: 1px;
      left: 0;
      background-color: var(--color-white-700);
    }
  }

  @media (max-width: 999px) {
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }
}

.link {
  display: block;
  width: 25px;
  height: 25px;
  color: var(--color-white-700);
  transition: all 0.3s;
  &:hover {
    color: var(--color-white);
  }
  &:focus-visible {
    color: var(--color-white);
    box-shadow: 0 0 0 1px var(--color-white);
    &:hover {
      background-color: var(--color-white);
      color: var(--color-black);
    }
  }
  @media (min-width: 1000px) {
    margin-left: 30px;
    z-index: 1;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
