import {
  type SpotlightCardVariant,
  type SpotlightPalette,
  spotlightProximityConfig
} from "@ui/utils/spotlightColors"

const FADE_DISTANCE_PX = 160

export interface SpotlightCardEntry {
  root: HTMLElement
  glow: HTMLElement
  variant: SpotlightCardVariant
  getColors: () => SpotlightPalette
}

const entries = new Set<SpotlightCardEntry>()
let listenerAttached = false

const distanceOutsideRect = (rect: DOMRect, clientX: number, clientY: number): number => {
  const dx = Math.max(rect.left - clientX, 0, clientX - rect.right)
  const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom)
  return Math.hypot(dx, dy)
}

const proximityOpacity = (distance: number): number => {
  if (distance <= 0) return 1
  const t = 1 - distance / FADE_DISTANCE_PX
  return Math.max(0, t * t)
}

const applyRingBackground = (
  root: HTMLElement,
  palette: SpotlightPalette,
  variant: SpotlightCardVariant
) => {
  const { gradientSizePx, gradientStopPercent } = spotlightProximityConfig[variant]
  root.style.setProperty("--spot-ring", palette.ring)
  root.style.setProperty("--spot-edge", palette.edge)
  root.style.background = `radial-gradient(${gradientSizePx}px circle at var(--xPos) var(--yPos), var(--spot-edge), var(--spot-ring) ${gradientStopPercent}%)`
}

const updateEntry = (entry: SpotlightCardEntry, clientX: number, clientY: number) => {
  const { root, glow, variant, getColors } = entry
  const proximity = spotlightProximityConfig[variant]
  const rect = root.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top
  const distance = distanceOutsideRect(rect, clientX, clientY)
  const opacity = proximityOpacity(distance) * proximity.maxGlowOpacity
  const palette = getColors()

  root.style.setProperty("--xPos", `${x}px`)
  root.style.setProperty("--yPos", `${y}px`)
  applyRingBackground(root, palette, variant)

  glow.style.width = `${proximity.glowSizePx}px`
  glow.style.height = `${proximity.glowSizePx}px`
  glow.style.left = `${x}px`
  glow.style.top = `${y}px`
  glow.style.opacity = String(opacity)
  glow.style.background = `radial-gradient(circle, ${palette.glow} 0%, transparent 72%)`
}

const onDocumentMove = (event: MouseEvent) => {
  for (const entry of entries) {
    updateEntry(entry, event.clientX, event.clientY)
  }
}

const attachListener = () => {
  if (listenerAttached || import.meta.server) return
  listenerAttached = true
  document.addEventListener("mousemove", onDocumentMove, { passive: true })
}

export const registerSpotlightCard = (entry: SpotlightCardEntry): (() => void) => {
  const palette = entry.getColors()
  entry.root.style.setProperty("--xPos", "-200px")
  entry.root.style.setProperty("--yPos", "-200px")
  applyRingBackground(entry.root, palette, entry.variant)

  entries.add(entry)
  attachListener()

  return () => {
    entries.delete(entry)
  }
}
