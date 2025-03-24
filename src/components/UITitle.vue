<script setup lang="ts">
import { RouterLink } from "vue-router"

interface TitleProps {
  title: string
  className?: string
  link: string
  direction?: "ltr" | "rtl"
}

const props = withDefaults(defineProps<TitleProps>(), {
  direction: "ltr",
  className: ""
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch (err) {
    console.error("Failed to copy: ", err)
  }
}
</script>

<template>
  <div
    :class="[
      'title',
      props.className,
      { rtl: props.direction === 'rtl', ltr: props.direction === 'ltr' }
    ]"
    @click="copyLink"
  >
    <RouterLink
      class="link"
      :to="props.link"
    >
      <h2>{{ props.title }}</h2>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.title {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--color-white);
  cursor: pointer;
  &:hover a {
    opacity: 1;
  }
}

.link {
  display: block;
  margin: 0 10px;
  font: inherit;
  font-weight: normal;
  text-transform: uppercase;
  color: var(--color-white);
  @media (min-width: 576px) {
    font: bold 25px/30px var(--second-font);
  }
  @media (max-width: 575px) {
    font: bold 17px/22px var(--second-font);
  }
  &:focus-visible {
    color: var(--color-accent);
    opacity: 1;
  }

  h2 {
    display: inline-block;
  }
}

.ltr {
  padding-left: 60px;
  &:hover::after {
    opacity: 1;
  }
  &::after {
    content: "#";
    color: var(--color-white-700);
    opacity: 0;
    transition: opacity 0.1s;
    @media (min-width: 576px) {
      font: normal 18px/23px var(--second-font);
    }
    @media (max-width: 575px) {
      font: normal 15px/20px var(--second-font);
    }
  }
  &::before {
    position: absolute;
    display: block;
    content: "";
    width: 50px;
    height: 2px;
    bottom: 10px;
    left: 0;
    background-color: var(--color-accent);
  }
  h2::before {
    margin-right: 20px;
    content: "0" counter(section-counter) ".";
    color: var(--color-accent);
    @media (min-width: 576px) {
      font: normal 18px/23px var(--second-font);
    }
    @media (max-width: 575px) {
      font: normal 15px/20px var(--second-font);
    }
  }
}

.rtl {
  justify-content: flex-end;
  padding-right: 60px;
  text-align: right;
  &:hover::before {
    opacity: 1;
  }
  &::before {
    content: "#";
    color: var(--color-white-700);
    opacity: 0;
    transition: opacity 0.2s;
    @media (min-width: 576px) {
      font: normal 18px/23px var(--second-font);
    }
    @media (max-width: 575px) {
      font: normal 15px/20px var(--second-font);
    }
  }
  &::after {
    position: absolute;
    display: block;
    content: "";
    width: 50px;
    height: 2px;
    bottom: 10px;
    right: 0;
    background-color: var(--color-accent);
  }
  h2::after {
    margin-left: 20px;
    content: "0" counter(section-counter) ".";
    color: var(--color-accent);
    @media (min-width: 576px) {
      font: normal 18px/23px var(--second-font);
    }
    @media (max-width: 575px) {
      font: normal 15px/20px var(--second-font);
    }
  }
}
</style>
