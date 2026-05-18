declare module "d3-force-3d" {
  export function forceX(x?: number): any
  export function forceY(y?: number): any
  export function forceCenter(x?: number, y?: number, z?: number): any
  export function forceManyBody(): any
  export function forceLink(links?: any[]): any
  export function forceCollide(radius?: number): any
}
