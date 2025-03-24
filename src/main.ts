import { createApp } from "vue"
import { createPinia } from "pinia"

import "./assets/styles/main.scss"

import App from "./App.vue"
import router from "./router"
import { setupI18n } from "@/setupI18n"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(setupI18n())

app.mount("#app")
