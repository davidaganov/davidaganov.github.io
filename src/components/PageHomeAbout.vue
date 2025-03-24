<script setup lang="ts">
import UITitle from "@/components/UITitle.vue"
import UIButton from "@/components/UIButton.vue"

const date = new Date().toLocaleDateString("ru-RU").split(".").reverse().join("-")
</script>

<template>
  <section
    class="about"
    id="about"
  >
    <div class="inner">
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
          <p v-html="$t('resume.about')" />
          <UIButton
            class="btn"
            rel="noreferrer"
            :href="`/CV_DavidAganov.pdf?v=${date}`"
            :download="`CV_DavidAganov_${date}.pdf`"
          >
            {{ $t("about.download") }}
          </UIButton>
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

.btn {
  margin-top: 40px;
  @media (max-width: 575px) {
    width: 100%;
    text-align: center;
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
