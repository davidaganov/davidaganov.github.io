export interface ProjectMeta {
  icon?: string
  githubRepo?: string
  githubUrl?: string
  npmPackage?: string
  npmUrl?: string
  publishedAt?: string
  tags?: string[]
}

export interface ProjectItem {
  title: string
  description: string
  path: string
  meta?: ProjectMeta
}
