<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

import en from "@/locales/en.json"
import ru from "@/locales/ru.json"

interface Props {
  close?: () => void
}

interface Language {
  lang: string
  aria: string
}

const props = defineProps<Props>()
const { t, locale, setLocaleMessage } = useI18n()

// Убедимся, что сообщения для каждой локали загружены
setLocaleMessage("en", en)
setLocaleMessage("ru", ru)

const languagesList: Language[] = [
  { lang: "en", aria: t("navbar.selectLang.en") },
  { lang: "ru", aria: t("navbar.selectLang.ru") }
]

const htmlAttrChange = (lang: string) => {
  document.documentElement.setAttribute("lang", lang)
}

onMounted(() => {
  // При монтировании компонента устанавливаем язык из localStorage или по умолчанию
  const savedLocale = localStorage.getItem("locale") || "en"
  changeLanguage(savedLocale)
})

const changeLanguage = (lang: string) => {
  // Сохраняем выбранный язык в localStorage
  localStorage.setItem("locale", lang)
  // Меняем локаль
  locale.value = lang
  // Обновляем атрибут lang в HTML
  htmlAttrChange(lang)
}

const closeNavbar = (e: KeyboardEvent, index: number) => {
  if (e.key === "Tab" && !e.shiftKey && languagesList.length === index + 1) {
    props.close?.()
  }
}
</script>

<template>
  <div
    class="switcher"
    role="listbox"
  >
    <span
      class="sr-only"
      id="selectLang"
    >
      {{ $t("navbar.selectLang.title") }}
    </span>

    <button
      type="button"
      role="option"
      :id="`lang-${lang}`"
      :key="lang"
      :class="['btn', { btnActive: locale === lang }]"
      :aria-label="aria"
      :aria-selected="locale === lang"
      :aria-labelledby="`selectLang lang-${lang}`"
      @click="() => changeLanguage(lang)"
      @keydown="(e) => closeNavbar(e, index)"
      v-for="({ lang, aria }, index) in languagesList"
    >
      {{ lang }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.switcher {
  display: flex;
  gap: 6px;
  z-index: 1;

  @media (max-width: 768px) {
    justify-content: flex-end;
    margin-top: 50px;
  }
}

.btn {
  display: block;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  transition: all 0.3s;
  cursor: pointer;

  &:not(.btnActive) {
    &:hover {
      transform: translateY(-1.5px);
      box-shadow: 2px 2px 0 1px var(--color-accent);
    }

    &:focus-visible {
      background-color: var(--color-accent);
      color: var(--color-white);
      box-shadow: 2px 2px 0 1px var(--color-white);
    }
  }

  &:focus-visible {
    transform: translateY(-1.5px);
  }

  @media (min-width: 769px) {
    font: 400 10px/15px var(--second-font);
    padding: 5px 10px;
  }

  @media (max-width: 768px) {
    font: 400 12px/17px var(--second-font);
    padding: 10px 30px;
  }
}

.btnActive {
  background-color: var(--color-accent);
  color: var(--color-white);

  &:focus-visible {
    box-shadow: 2px 2px 0 1px var(--color-white);
  }
}
</style>
