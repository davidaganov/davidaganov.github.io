export interface ProjectStats {
  npm?: {
    version: string
    downloads: number
  }
  github?: {
    stars: number
    lastCommit: string
    version?: string
    languages: Array<{ name: string; percentage: number; color: string }>
  }
}
