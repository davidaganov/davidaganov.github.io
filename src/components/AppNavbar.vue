<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { RouterLink } from "vue-router"
import BaseLanguageSwitcher from "@/components/BaseLanguageSwitcher.vue"
import type { NavLink } from "@/interfaces"

defineProps<{ list: NavLink[] }>()

const { locale } = useI18n()

const opened = ref(false)
const closeRef = ref<HTMLButtonElement | null>(null)

const openMenu = () => {
  closeRef.value?.focus()
  opened.value = !opened.value
}

const closeMenu = () => {
  if (window.innerWidth < 1020) {
    opened.value = false
  }
}

const handleCloseKeydown = (e: KeyboardEvent) => {
  if (e.key === "Tab" && e.shiftKey) {
    opened.value = false
  }
}

watch(opened, (newValue) => {
  if (newValue) {
    document.body.classList.add("no-scroll")
  } else {
    document.body.classList.remove("no-scroll")
  }
})
</script>

<template>
  <div class="navbar">
    <div class="container">
      <button
        class="burger"
        type="button"
        aria-label="Open navbar"
        :aria-expanded="opened"
        @click="openMenu"
      >
        <i class="mdi mdi-menu" />
      </button>

      <nav
        class="navbar__container"
        role="navigation"
        :class="{ opened }"
      >
        <button
          ref="closeRef"
          class="close"
          type="button"
          aria-label="Close navbar"
          @click="() => (opened = false)"
          @keydown="handleCloseKeydown"
        >
          <i class="mdi mdi-close" />
        </button>

        <ul class="menu">
          <li
            class="item"
            :key="i"
            v-for="(item, i) in list"
          >
            <span>0{{ i + 1 }}.</span>
            <RouterLink
              class="link inline-link inline-link--white"
              :to="item.link"
              @click="() => (opened = false)"
            >
              {{ locale === "en" ? item.title.en : item.title.ru }}
            </RouterLink>
          </li>
        </ul>

        <BaseLanguageSwitcher @close="closeMenu" />
      </nav>

      <button
        class="backdrop"
        type="button"
        tabindex="-1"
        :class="{ opened }"
        @click="() => (opened = false)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  min-height: 68px;

  &__container {
    top: 0;
    display: flex;

    @media (max-width: 1599px) and (min-width: 769px) {
      padding: 0 20px;
    }

    @media (min-width: 769px) {
      position: absolute;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      width: 100%;
      margin: 20px 0;
      left: 0;

      &:not(.opened) {
        right: auto;
      }

      &.opened {
        right: auto;
      }
    }

    @media (max-width: 768px) {
      position: fixed;
      flex-direction: column;
      height: 100%;
      padding: 15px 20px;
      right: 0;
      background-color: var(--color-black);
      border-left: 10px solid var(--color-accent);
      transition:
        right 0.4s,
        visibility 0.4s;
      z-index: 2;

      &:not(.opened) {
        visibility: hidden;
        right: -100%;
      }

      &.opened {
        visibility: visible;
        right: 0;
      }
    }

    @media (max-width: 768px) and (min-width: 376px) {
      width: 85%;
    }

    @media (max-width: 375px) {
      width: 100%;
    }
  }
}

.container {
  position: relative;
}

.burger,
.close {
  @media (min-width: 769px) {
    display: none;
  }
}

.burger {
  @media (max-width: 768px) {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    color: var(--color-white);
    transition: all 0.2s;
    cursor: pointer;

    &:focus-visible {
      color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent);
    }

    .mdi {
      font-size: 32px;
    }
  }
}

.close {
  @media (max-width: 768px) {
    position: absolute;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: var(--color-white);
    border: 2px solid var(--color-white);
    left: 20px;
    top: 20px;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;

    &:focus-visible {
      background-color: var(--color-white);
      color: var(--color-black);
    }

    .mdi {
      font-size: 24px;
    }
  }
}

.menu {
  display: flex;

  @media (min-width: 769px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: auto;
    z-index: 1;
  }
}

.item {
  @media (min-width: 769px) {
    &:not(:last-of-type) {
      margin-right: 50px;
    }
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
  }

  span {
    color: var(--color-accent);

    @media (min-width: 769px) {
      margin-right: 7px;
    }

    @media (max-width: 768px) {
      display: block;
      width: 60px;
      height: 3px;
      margin-left: 20px;
      background-color: var(--color-accent);
      font-size: 1px;
    }
  }
}

.link {
  @media (max-width: 768px) and (min-width: 376px) {
    font: 400 28px var(--main-font);
  }

  @media (max-width: 375px) {
    font: 400 24px var(--main-font);
  }
}

.backdrop {
  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(10, 25, 47, 0.6);
    transition: all 0.3s;
    cursor: pointer;
    z-index: 1;

    &:not(.opened) {
      opacity: 0;
      pointer-events: none;
    }

    &.opened {
      opacity: 1;
    }
  }
}
</style>
