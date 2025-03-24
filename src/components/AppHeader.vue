<script setup lang="ts">
import UIButton from "@/components/UIButton.vue"
import BaseBlob from "@/components/BaseBlob.vue"
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="content">
        <BaseBlob />

        <p class="subtitle">{{ $t("header.subtitle") }}</p>
        <h1 class="title">{{ $t("header.name") }}</h1>
        <p class="description">{{ $t("header.description") }}</p>
        <UIButton
          href="/#/links?mode=professional"
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

.container {
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
</style>
