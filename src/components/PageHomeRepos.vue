<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useGithubService } from "@/services/githubService"
import UITitle from "@/components/UITitle.vue"
import UIButton from "@/components/UIButton.vue"
import BaseReposList from "@/components/BaseReposList.vue"
import type { Repo } from "@/interfaces"

const { error, getRepos } = useGithubService()
const { t } = useI18n()

const reposList = ref<Repo[]>([])
const reposLoading = ref(false)

const onRequest = async () => {
  const newRepos = await getRepos({ ignoreTopics: ["site"] })
  reposList.value = newRepos
  reposLoading.value = false
}

onMounted(() => {
  onRequest()
})
</script>

<template>
  <section
    class="work"
    id="repositories"
  >
    <div class="container">
      <UITitle
        link="#repositories"
        :title="t('repositories.title')"
      />

      <div class="body">
        <h3
          v-if="error"
          class="error"
        >
          Repos not found
        </h3>
        <BaseReposList :repos="reposList" />

        <UIButton
          v-if="!error"
          href="https://github.com/davidaganov?tab=repositories"
          target="_blank"
          rel="noreferrer"
          class="btn"
        >
          {{ t("repositories.go_github") }}
        </UIButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.work {
  @media (min-width: 1000px) {
    margin-top: 80px;
    padding-top: 30px;
  }
  @media (max-width: 999px) {
    margin-top: 50px;
    padding-top: 15px;
  }
}

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 40px;
}

.title {
  margin-top: 20px;
  font: bold 24px var(--main-font);
  color: var(--color-white);
}

.projects {
  display: grid;
  gap: 30px;
  width: 100%;
  margin-top: 20px;
  @media (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.error {
  margin: 40px 0 20px;
  font: normal 30px var(--main-font);
  color: var(--color-white);
}

.btn {
  margin-top: 40px;
  @media (max-width: 575px) {
    width: 100%;
    text-align: center;
  }
}

.skeleton {
  position: relative;
  height: 230px;
  margin: 10px;
  border: 1px solid var(--color-accent);
  box-shadow: 1px 1px 0 1px var(--color-accent);
  background-color: #0c1e38;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      #0c1e38 0,
      var(--color-accent-300) 140px,
      #0c1e38 180px
    );
    background-size: cover;
    animation: shine-lines 1.5s infinite linear;
  }
}

@keyframes shine-lines {
  0% {
    left: -50%;
  }
  100% {
    left: 100%;
  }
}
</style>
