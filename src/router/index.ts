import { createRouter, createWebHashHistory } from "vue-router"
import defaultLayout from "@/layouts/default.vue"
import wideLayout from "@/layouts/wide.vue"
import homeView from "@/views/HomeView.vue"
import linksView from "@/views/LinksView.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/",
      component: defaultLayout,
      children: [
        {
          path: "",
          name: "home",
          component: homeView
        }
      ]
    },
    {
      path: "/links",
      component: wideLayout,
      children: [
        {
          path: "",
          name: "links",
          component: linksView
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
