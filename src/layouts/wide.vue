<script setup lang="ts">
import { RouterView } from "vue-router"
import AppNavbar from "@/components/AppNavbar.vue"
import AppFooter from "@/components/AppFooter.vue"

const list = [
  { link: "/#about", title: { en: "About", ru: "Обо мне" } },
  { link: "/#skills", title: { en: "Skills", ru: "Скиллы" } },
  { link: "/#repositories", title: { en: "Repositories", ru: "Репозитории" } }
]
</script>

<template>
  <div class="wrapper">
    <AppNavbar :list="list" />
    <RouterView />
    <AppFooter />
  </div>
</template>
