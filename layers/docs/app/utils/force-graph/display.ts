import { lerp } from "@docs/utils/force-graph/theme"

export const mapLabelFadeMinAlpha = (value: number): number => {
  if (value <= 0) return 0
  return lerp(0, 0.92, value / 100)
}

export const mapIndexLabelAlpha = (value: number): number => {
  if (value <= 0) return 0
  return lerp(0, 0.98, value / 100)
}

export const mapNodeRelSize = (value: number): number => lerp(2, 8, value / 100)
export const mapBaseLinkWidth = (value: number): number => lerp(0.4, 2, value / 100)
