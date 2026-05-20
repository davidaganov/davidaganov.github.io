import {
  SPOTLIGHT_SURFACE,
  SPOTLIGHT_SURFACE_ARTICLE,
  type SpotlightCardVariant
} from "@ui/utils/spotlightColors"

export interface SpotlightCardPreset {
  frame: string
  surface: string
}

const surfaceFill = `h-full w-full ${SPOTLIGHT_SURFACE.light} ${SPOTLIGHT_SURFACE.dark}`
const articleSurfaceFill = `h-full w-full ${SPOTLIGHT_SURFACE_ARTICLE.light} ${SPOTLIGHT_SURFACE_ARTICLE.dark}`

export const spotlightCardVariants: Record<SpotlightCardVariant, SpotlightCardPreset> = {
  resume: {
    frame: "rounded-2xl",
    surface: `h-full w-full bg-white dark:bg-[#0a0d18] border border-black/10 shadow-sm dark:border-white/10 dark:shadow-none rounded-[calc(1rem-2px)] py-4 px-5`
  },
  link: {
    frame: "rounded-xl",
    surface: `${surfaceFill} rounded-[calc(0.75rem-2px)] py-4 px-5`
  },
  linkCta: {
    frame: "rounded-xl",
    surface: `${surfaceFill} rounded-[calc(0.75rem-2px)] py-4 px-5`
  },
  article: {
    frame: "rounded-xl",
    surface: `${articleSurfaceFill} rounded-[calc(0.75rem-2px)] py-4 px-5`
  }
}
