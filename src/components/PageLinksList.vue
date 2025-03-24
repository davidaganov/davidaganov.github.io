<script setup lang="ts">
import { useLinks } from "@/composables/useLinks"
import BaseBlob from "@/components/BaseBlob.vue"
import BaseDownloadCV from "@/components/BaseDownloadCV.vue"
import { LINKS_MODE } from "@/enums/linksModeEnum"

const { mode, links, toggleMode } = useLinks()
</script>

<template>
  <section
    class="links"
    id="links"
  >
    <div class="container">
      <div class="content">
        <BaseBlob />
        <h1 class="links__title">{{ $t("links.title") }}</h1>

        <div class="mode-toggle">
          <div class="mode-toggle__container">
            <button
              type="button"
              class="mode-toggle__option"
              :class="{ active: mode === LINKS_MODE.PROFESSIONAL }"
              @click="toggleMode(LINKS_MODE.PROFESSIONAL)"
            >
              {{ $t("links.modes.professional").toUpperCase() }}
            </button>
            <button
              type="button"
              class="mode-toggle__option"
              :class="{ active: mode === LINKS_MODE.PERSONAL }"
              @click="toggleMode(LINKS_MODE.PERSONAL)"
            >
              {{ $t("links.modes.personal").toUpperCase() }}
            </button>

            <div
              class="mode-toggle__slider"
              :class="{ right: mode === LINKS_MODE.PERSONAL }"
            />
          </div>
        </div>

        <BaseDownloadCV
          class="btn"
          v-if="mode === LINKS_MODE.PROFESSIONAL"
        />

        <ul class="links-grid">
          <li
            class="link-card"
            :key="link.name"
            v-for="link in links"
          >
            <a
              class="link-card__inner"
              target="_blank"
              rel="noreferrer"
              :href="link.url"
            >
              <span class="link-card__icon">
                <i
                  v-if="link.icon"
                  :class="['mdi', link.icon]"
                  :style="link.customStyle"
                />
              </span>
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.links {
  position: relative;
  min-height: 100vh;
  min-height: 850px;
  overflow: hidden;

  &__title {
    position: relative;
    margin-bottom: 40px;
    font-family: var(--second-font);
    text-align: center;
    font-size: 3.5rem;
    color: var(--color-white);
    letter-spacing: 4px;

    &::after {
      content: "";
      display: block;
      width: 80px;
      height: 4px;
      margin: 20px auto 0;
      background-color: var(--color-accent);
    }

    @media (max-width: 575px) {
      margin-bottom: 30px;
      font-size: 2.5rem;
    }
  }
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 68px auto 40px;
}

.content {
  position: relative;
  max-width: 420px;
  width: 100%;
  margin: auto;
}

.btn {
  margin-bottom: 25px;
  height: 62px;
}

.mode-toggle {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;

  &__container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    height: 60px;
    border: 2px solid var(--color-accent);
    overflow: hidden;
    font-family: var(--second-font);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;

    @media (max-width: 575px) {
      height: 45px;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    z-index: 1;
    transition: color 0.3s ease;
    user-select: none;
    font-family: var(--second-font);
    cursor: pointer;
    font-size: 14px;
    z-index: 2;

    @media (max-width: 575px) {
      font-size: 13px;
    }

    &.active {
      color: var(--color-black);
      font-weight: bold;
    }

    &:not(.active) {
      color: var(--color-accent);
    }
  }

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: var(--color-accent);
    transition: transform 0.3s;
    z-index: 0;
    background-size: 8px 8px;

    &.right {
      transform: translateX(100%);
    }
  }
}

.links-grid {
  display: grid;
  gap: 25px;
}

.link-card {
  &__inner {
    position: relative;
    display: flex;
    align-items: center;
    height: 62px;
    padding-inline: 20px;
    border: 2px solid var(--color-accent);
    color: var(--color-white);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: var(--second-font);
    text-decoration: none;
    background-color: var(--color-black-400);
    transition: all 0.2s;
    overflow: hidden;

    &:hover {
      transform: translateY(-3px) translateX(-1px);
      box-shadow: 3px 3px 0 var(--color-accent);

      .link-card__icon {
        transform: scale(1.2);
        .mdi {
          color: var(--color-accent);
        }
      }
    }

    @media (max-width: 767px) {
      font-size: 15px;
    }

    @media (max-width: 575px) {
      font-size: 16px;
    }
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    margin-right: 15px;
    color: var(--color-white-700);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &::after {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      width: 8px;
      height: 8px;
      border-top: 2px solid var(--color-accent);
      border-left: 2px solid var(--color-accent);
      opacity: 0.7;
    }

    .mdi {
      font-size: 22px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @media (max-width: 767px) {
      width: 35px;
      height: 35px;
      margin-right: 10px;
    }
  }
}
</style>
