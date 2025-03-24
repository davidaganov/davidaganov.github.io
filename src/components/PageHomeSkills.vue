<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import UITitle from "@/components/UITitle.vue"
import { DIRECTION } from "@/enums/directionEnum"
import type { SkillCategory } from "@/interfaces"

const { t, locale } = useI18n()

const openCategories = ref<string[]>([])
const skillsList = ref<SkillCategory[]>([])

const loadLocaleData = async () => {
  try {
    const localeData = await import(`@/locales/${locale.value}.json`)
    skillsList.value = localeData.default.skills.data as SkillCategory[]
  } catch (error) {
    console.error(`Failed to load locale data for ${locale.value}:`, error)
    skillsList.value = []
  }
}

const toggleCategory = (id: string) => {
  if (openCategories.value.includes(id)) {
    openCategories.value = openCategories.value.filter((item) => item !== id)
  } else {
    openCategories.value.push(id)
  }
}

const getIconSrc = (title: string) => {
  switch (title) {
    case "HTML":
      return "mdi-language-html5"
    case "CSS":
      return "mdi-language-css3"
    case "JavaScript":
      return "mdi-language-javascript"
    default:
      return "mdi-dots-horizontal-circle"
  }
}

watch(locale, () => {
  loadLocaleData()
})

onMounted(() => {
  loadLocaleData()
})
</script>

<template>
  <section
    class="skills"
    id="skills"
  >
    <div class="container">
      <UITitle
        link="#skills"
        :title="t('skills.title')"
        :direction="DIRECTION.RTL"
      />

      <div
        v-if="skillsList.length"
        class="accordion"
      >
        <div
          v-for="category in skillsList"
          :key="category.id"
          class="item"
          v-show="category.list?.length > 0"
        >
          <span
            @click="toggleCategory(String(category.id))"
            @keydown.enter="toggleCategory(String(category.id))"
            tabindex="0"
            :id="`trigger-${category.id}`"
            role="button"
            :class="{ 'is-open': openCategories.includes(String(category.id)) }"
            :aria-expanded="openCategories.includes(String(category.id))"
          >
            <h3>
              {{ category.title }}
              <i :class="['mdi', getIconSrc(category.title)]" />
            </h3>
          </span>

          <transition
            name="collapse"
            :duration="350"
          >
            <div
              v-show="openCategories.includes(String(category.id))"
              :id="`content-${category.id}`"
            >
              <ul class="list">
                <li
                  v-for="skill in category.list"
                  :key="skill.id"
                  class="content"
                >
                  <p class="title">{{ skill.title }}</p>
                  <ul class="listNested">
                    <li
                      v-for="tag in skill.tags"
                      :key="tag"
                      class="listNestedItem"
                    >
                      {{ tag }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
      <p
        v-else
        class="empty"
      >
        Not found
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.35s ease-in-out;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 650px;
}

.skills {
  @media (min-width: 1000px) {
    margin-top: 80px;
    padding-top: 30px;
  }
  @media (max-width: 999px) {
    margin-top: 50px;
    padding-top: 15px;
  }
}

.accordion {
  margin-top: 50px;
}

.item {
  position: relative;
  padding-bottom: 10px;
  color: var(--color-white);
  &::before {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: var(--color-accent-300);
  }
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: right;
    color: var(--color-white);
    cursor: pointer;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      color: tomato;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23B87EEF' d='M9.75 3v6.75H3v4.5h6.75V21h4.5v-6.75H21v-4.5h-6.75V3h-4.5Z'/%3E%3C/svg%3E");
      transition: transform 0.2s;
    }
    &:focus-visible {
      color: var(--color-accent);
      text-decoration: underline;
    }
    h3 {
      display: flex;
      align-items: center;
      margin-left: auto;
      user-select: none;
      @media (min-width: 576px) {
        font: bold 24px var(--main-font);
      }
      @media (max-width: 575px) {
        font: bold 20px var(--main-font);
      }
    }
    .mdi {
      margin-left: 25px;
      font-size: 32px;
      color: var(--color-accent);
    }
  }
}

.list {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 30px 20px 20px 0;
  padding-right: 25px;
  text-align: right;
  &::after {
    position: absolute;
    content: "";
    right: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: var(--color-accent);
  }
}

.content {
  &:not(:last-of-type) {
    margin-bottom: 22px;
  }
}

.title {
  font: 600 20px var(--main-font);
}

.listNested {
  display: flex;
  justify-content: flex-end;
}

.listNestedItem {
  margin-top: 5px;
  font: normal 18px var(--main-font);
  color: var(--color-white-700);
  &:not(:last-of-type) {
    margin-right: 7px;
    &::after {
      content: ", ";
    }
  }
}

.empty {
  margin-top: 50px;
  text-align: right;
  font: normal 20px var(--second-font);
  color: var(--color-white-700);
}
</style>
