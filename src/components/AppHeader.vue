<script setup lang="ts">
import UIButton from "@/components/UIButton.vue"
</script>

<template>
  <header class="header">
    <div class="inner">
      <div class="content">
        <div class="blob first"></div>
        <div class="blob second"></div>
        <div class="blob third"></div>

        <p class="subtitle">{{ $t("header.subtitle") }}</p>
        <h1 class="title">{{ $t("header.name") }}</h1>
        <p class="description">{{ $t("header.description") }}</p>
        <UIButton
          href="#footer"
          class="btn"
        >
          {{ $t("header.contact") }}
        </UIButton>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: relative;
  height: 100vh;
  max-height: 1080px;
  min-height: 600px;
  overflow: hidden;
}

.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  position: relative;
  margin: auto 0;
  transform: translateY(-68px);
}

.title {
  margin-top: 15px;
  letter-spacing: -0.03em;
  color: var(--color-white);
}

.subtitle {
  color: var(--color-accent);
  font: 400 11px/19px var(--second-font);
  text-transform: uppercase;
}

.description {
  position: relative;
  margin-top: 20px;
  color: var(--color-white-700);

  @media (min-width: 769px) {
    max-width: 650px;
    padding-left: 20px;
  }

  @media (max-width: 768px) {
    max-width: 500px;
    padding-left: 10px;
  }

  &::before {
    position: absolute;
    content: "";
    width: 2px;
    height: 100%;
    top: 0;
    left: 0;
    background-color: var(--color-accent);
  }
}

.link-icon {
  width: 18px;
  height: 18px;
  margin: 0 5px -2px 0;
  opacity: 0.8;
}

.btn {
  margin-top: 60px;
  @media (max-width: 575px) {
    width: 100%;
    text-align: center;
  }
}

.blob {
  position: absolute;
  background-color: var(--color-accent);
  border-radius: 30% 50% 20% 40%;
  opacity: 0.15;
  z-index: -1;
}

.first {
  height: 200px;
  width: 200px;
  left: 70%;
  top: 80%;
  animation:
    transform 20s ease-in-out infinite both alternate,
    movement_one 40s ease-in-out infinite both;
}

.second {
  top: -50px;
  transform: rotate(-180deg);
  animation:
    transform 30s ease-in-out infinite both alternate,
    movement_two 60s ease-in-out infinite both;

  @media (min-width: 1000px) {
    height: 500px;
    width: 500px;
    left: -150px;
  }

  @media (max-width: 999px) and (min-width: 576px) {
    width: 400px;
    height: 400px;
    left: -50px;
  }

  @media (max-width: 575px) {
    width: 350px;
    height: 350px;
    left: -100px;
  }
}

.third {
  @media (min-width: 769px) {
    height: 450px;
    width: 450px;
    left: 500px;
    top: -60px;
    transform: rotate(-180deg);
    animation:
      transform 30s ease-in-out infinite both alternate,
      movement_two 60s ease-in-out infinite both;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

@keyframes transform {
  0%,
  100% {
    border-radius: 33% 67% 70% 30% / 30% 30% 70% 70%;
  }
  20% {
    border-radius: 37% 63% 51% 49% / 37% 65% 35% 63%;
  }
  40% {
    border-radius: 36% 64% 64% 36% / 64% 48% 52% 36%;
  }
  60% {
    border-radius: 37% 63% 51% 49% / 30% 30% 70% 70%;
  }
  80% {
    border-radius: 40% 60% 42% 58% / 41% 51% 49% 59%;
  }
}

@keyframes movement_one {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: translate(-50%, 20%) rotateY(10deg) scale(1.2);
  }
}

@keyframes movement_two {
  0%,
  500% {
    transform: none;
  }
  50% {
    transform: translate(30%, 10%) rotate(-200deg) scale(1.2);
  }
}
</style>
