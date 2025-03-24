<script setup lang="ts">
import UITitle from "@/components/UITitle.vue"
import BaseDownloadCV from "@/components/BaseDownloadCV.vue"
</script>

<template>
  <section
    class="about"
    id="about"
  >
    <div class="container">
      <UITitle
        :link="'#about'"
        :title="$t('about.title')"
      />

      <div class="content">
        <div class="left">
          <img
            class="picture"
            src="/images/avatar.png"
            alt="My avatar"
            width="350"
            height="350"
          />
          <p v-html="$t('about.description')" />

          <div class="btn-wrapper">
            <BaseDownloadCV class="btn" />
          </div>
        </div>
        <div class="right">
          <img
            class="picture"
            src="/images/avatar.png"
            alt="My avatar"
            width="350"
            height="350"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about {
  padding-top: 30px;
}

.content {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  @media (max-width: 999px) {
    flex-direction: column-reverse;
  }
}

.left {
  color: var(--color-white-700);
  p:not(:last-of-type) {
    margin-bottom: 20px;
  }
  strong {
    color: var(--color-accent);
  }
  @media (min-width: 1000px) {
    margin-bottom: 20px;
  }
  strong {
    color: var(--color-accent);
  }
  @media (min-width: 1000px) {
    width: 54%;
    .picture {
      display: none;
    }
  }
  @media (max-width: 999px) and (min-width: 576px) {
    max-width: 95%;
  }
  @media (max-width: 575px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.btn-wrapper {
  margin-top: 40px;

  @media (min-width: 576px) {
    display: flex;
  }

  @media (max-width: 575px) {
    width: 100%;
  }
}

.right {
  @media (max-width: 999px) {
    display: none;
  }
}

.picture {
  @media (min-width: 1000px) {
    width: 350px;
  }
  @media (max-width: 999px) and (min-width: 576px) {
    max-width: 130px;
    max-height: 130px;
    margin: 7px 20px 10px 0;
    float: left;
  }
  @media (max-width: 575px) {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }
}
</style>
