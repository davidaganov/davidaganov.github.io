import type { forceX, forceY } from "d3-force-3d"
import type { ForceGraphRuntime, ForceGraphSettings } from "@docs/types"

export const applyForceGraphPhysics = (
  graph: ForceGraphRuntime,
  settings: ForceGraphSettings,
  pullX: ReturnType<typeof forceX>,
  pullY: ReturnType<typeof forceY>
): void => {
  const center = graph.d3Force("center") as { strength?: (value: number) => unknown } | undefined
  const centerStrength = 0.01 + (settings.attraction / 100) * 0.24
  center?.strength?.(centerStrength)

  const charge = graph.d3Force("charge") as { strength?: (value: number) => unknown } | undefined
  const chargeStrength = -30 - (settings.repulsion / 100) * 370
  charge?.strength?.(chargeStrength)

  const pullStrength = 0.005 + (settings.attraction / 100) * 0.045
  pullX.strength(pullStrength)
  pullY.strength(pullStrength)

  const link = graph.d3Force("link") as
    | {
        strength?: (value: number) => unknown
        distance?: (value: number) => unknown
      }
    | undefined

  link?.strength?.(0.05 + (settings.linkPull / 100) * 0.55)
  link?.distance?.(30 + (settings.nodeGap / 100) * 170)

  graph.d3ReheatSimulation()
}
