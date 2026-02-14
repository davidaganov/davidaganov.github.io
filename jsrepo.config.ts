import { defineConfig } from "jsrepo"

export default defineConfig({
  registries: ["https://vue-bits.dev/r"],
  paths: {
    default: "./layers/ui/app/components/bits"
  }
})
