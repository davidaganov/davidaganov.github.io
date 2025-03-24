<script setup lang="ts">
import { RouterView, useRouter } from "vue-router"
import { onMounted } from "vue"

const router = useRouter()

onMounted(() => {
  // Проверяем наличие данных о перенаправлении из 404.html
  const redirect = sessionStorage.getItem("redirect")
  if (redirect) {
    // Удаляем информацию о перенаправлении
    sessionStorage.removeItem("redirect")

    // Извлекаем путь из URL
    const url = new URL(redirect)
    const path = url.pathname

    // Перенаправляем на нужный маршрут
    if (path && path !== "/") {
      router.push(path)
    }
  }
})
</script>

<template>
  <RouterView />
</template>
