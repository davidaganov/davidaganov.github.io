<script setup lang="ts">
import { computed } from "vue"
import type { Repo } from "@/interfaces"

const props = defineProps<{
  card: Repo
  class?: string
}>()

const clearName = computed(() => props.card.name.replace(/[.\-/\\\s]/g, " "))
</script>

<template>
  <li class="card">
    <h3
      class="title"
      lang="en"
    >
      {{ clearName }}
    </h3>

    <p
      class="description"
      lang="en"
    >
      {{ card.description }}
    </p>

    <div class="bottom">
      <a
        class="link inline-link"
        target="_blank"
        rel="noreferrer"
        :href="card.html_url"
      >
        {{ $t("repositories.go_repo") }}
        <span
          lang="en"
          class="sr-only"
        >
          {{ clearName }}
        </span>
      </a>

      <a
        v-if="card.homepage"
        class="link link--live inline-link"
        target="_blank"
        rel="noreferrer"
        :href="card.homepage"
        :aria-label="`${$t('repositories.go_demo')} ${clearName}`"
      >
        {{ $t("repositories.go_demo") }}
        <span
          lang="en"
          class="sr-only"
        >
          {{ clearName }}
        </span>
      </a>

      <ul class="tags">
        <li
          lang="en"
          :key="i"
          v-for="(tag, i) in card.topics"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-accent);
  padding: 25px 20px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1.5px);
    box-shadow: 3.5px 3.5px 0 0.5px var(--color-accent);
  }

  @media (min-width: 769px) {
    height: 230px;
  }
}

.title {
  text-transform: capitalize;
  font: bold 20px var(--main-font);
  color: var(--color-accent);
}

.description {
  margin: 10px 0 20px;
  color: var(--color-white-700);

  @media (min-width: 769px) {
    word-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.bottom {
  margin-top: auto;
}

.link {
  margin-left: -2px;

  &--live {
    position: relative;
    margin-left: 18px;

    &::before {
      position: absolute;
      content: "";
      width: 6px;
      height: 6px;
      left: -13px;
      top: 1px;
      bottom: 0;
      margin: auto 0;
      border-radius: 10px;
      background-color: var(--color-white-700);
    }
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 15px;

  li {
    padding: 7px;
    text-transform: uppercase;
    font: normal 8px var(--second-font);
    border: 1.5px solid var(--color-white-500);
    color: var(--color-white-500);
  }
}
</style>
