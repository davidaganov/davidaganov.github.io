import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/default.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeView.vue")
        }
      ]
    },
    {
      path: "/links",
      component: () => import("@/layouts/wide.vue"),
      children: [
        {
          path: "",
          name: "links",
          component: () => import("@/views/LinksView.vue")
        }
      ]
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth"
      }
    }
    return { top: 0 }
  }
})

export default router
