import { LOCALE } from "@base/types/enums"

export const USERNAME = "davidaganov"
export const WORK_EMAIL = `${USERNAME}21@gmail.com`
export const GITHUB_REPO = `${USERNAME}/${USERNAME}.github.io`
export const HABR_LINK = `https://habr.com/ru/users/${USERNAME}`
export const GITHUB_LINK = `https://github.com/${USERNAME}`

export const AVAILABLE_LOCALES = [
  { label: "RU", value: LOCALE.RU },
  { label: "EN", value: LOCALE.EN }
]

export const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: GITHUB_LINK,
    icon: "i-simple-icons-github"
  },
  {
    label: "Telegram",
    href: `https://t.me/${USERNAME}`,
    icon: "i-simple-icons-telegram"
  },
  {
    label: "Email",
    href: `mailto:${WORK_EMAIL}`,
    icon: "i-lucide-mail"
  }
]
