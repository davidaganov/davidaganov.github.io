export type SpotlightCardVariant = "resume" | "link" | "linkCta" | "article"

export interface SpotlightPalette {
  edge: string
  glow: string
  ring: string
}

export const SPOTLIGHT_SURFACE = { light: "bg-zinc-50", dark: "dark:bg-[#0a0d18]" }
export const SPOTLIGHT_SURFACE_ARTICLE = { light: "bg-[#f8f6fc]", dark: "dark:bg-[#131524]" }

const darkShared = {
  edge: "rgba(184, 126, 239, 0.92)",
  glow: "rgba(184, 126, 239, 0.11)"
}

const lightShared = {
  edge: "rgba(124, 58, 237, 0.85)",
  glow: "rgba(139, 92, 246, 0.09)"
}

const spotlightPalettes = {
  dark: {
    resume: { ...darkShared, ring: "rgba(255, 255, 255, 0.15)" },
    link: { ...darkShared, ring: "rgba(255, 255, 255, 0.15)" },
    linkCta: { ...darkShared, ring: "rgba(184, 126, 239, 0.28)" },
    article: { ...darkShared, ring: "rgba(184, 126, 239, 0.15)" }
  },
  light: {
    resume: { ...lightShared, ring: "rgba(0, 0, 0, 0.12)" },
    link: { ...lightShared, ring: "rgba(0, 0, 0, 0.12)" },
    linkCta: { ...lightShared, ring: "rgba(124, 58, 237, 0.2)" },
    article: { ...lightShared, ring: "rgba(0, 0, 0, 0.12)" }
  }
} satisfies Record<"light" | "dark", Record<SpotlightCardVariant, SpotlightPalette>>

export const getSpotlightColors = (
  variant: SpotlightCardVariant,
  isDark: boolean
): SpotlightPalette => spotlightPalettes[isDark ? "dark" : "light"][variant]

export interface SpotlightProximityPreset {
  gradientSizePx: number
  gradientStopPercent: number
  glowSizePx: number
  maxGlowOpacity: number
}

export const spotlightProximityConfig: Record<SpotlightCardVariant, SpotlightProximityPreset> = {
  resume: { gradientSizePx: 250, gradientStopPercent: 80, glowSizePx: 500, maxGlowOpacity: 1 },
  link: { gradientSizePx: 250, gradientStopPercent: 80, glowSizePx: 500, maxGlowOpacity: 1 },
  linkCta: { gradientSizePx: 250, gradientStopPercent: 80, glowSizePx: 500, maxGlowOpacity: 1 },
  article: { gradientSizePx: 250, gradientStopPercent: 80, glowSizePx: 500, maxGlowOpacity: 1 }
}
