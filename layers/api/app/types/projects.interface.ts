export interface ProjectStats {
  npm?: {
    version: string
    downloads: number
  }
  github?: {
    stars: number
    version?: string
    languages: Array<{ name: string; percentage: number; color: string }>
  }
}
