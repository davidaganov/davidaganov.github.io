import type { DocsGraphNode } from "@docs/types"

export interface HslColor {
  h: number
  s: number
  l: number
  a: number
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const baseNodeHsl = (node: DocsGraphNode): HslColor => ({
  h: (node.hueIndex * 53 + 265) % 360,
  s: node.kind === "index" ? 72 : 48,
  l: node.kind === "index" ? 58 : 50,
  a: 1
})

export const dimmedNodeHsl = (node: DocsGraphNode): HslColor => ({
  h: (node.hueIndex * 53 + 265) % 360,
  s: 24,
  l: 36,
  a: 1
})

export const toHsla = (color: HslColor): string => {
  if (color.a >= 0.999) return `hsl(${color.h}, ${color.s}%, ${color.l}%)`
  return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`
}

export const nodeBaseVal = (kind: DocsGraphNode["kind"]): number => (kind === "index" ? 2.6 : 1)

export const graphLabelFill = (alpha: number, isDark: boolean): string => {
  return isDark ? `rgba(248, 250, 252, ${alpha})` : `rgba(17, 24, 39, ${alpha})`
}
