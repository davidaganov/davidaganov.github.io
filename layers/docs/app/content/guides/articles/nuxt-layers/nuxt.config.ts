export default defineNuxtConfig({
  extends: ["./layers/base", "./layers/ui", "./layers/order", "./layers/user", "./layers/chat"],
  alias: {
    "@": "./",
    "@base": "~/layers/base",
    "@ui": "~/layers/ui",
    "@order": "~/layers/order",
    "@user": "~/layers/user",
    "@chat": "~/layers/chat"
  }
})
