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
  s: 72,
  l: 58,
  a: node.kind === "index" ? 0.95 : 0.42
})

export const dimmedNodeHsl = (node: DocsGraphNode): HslColor => ({
  h: (node.hueIndex * 53 + 265) % 360,
  s: 28,
  l: 42,
  a: 0.16
})

export const toHsla = (color: HslColor): string => {
  return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`
}

export const nodeBaseVal = (kind: DocsGraphNode["kind"]): number => (kind === "index" ? 2.6 : 1)
