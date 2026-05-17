export interface ArticleMeta {
  icon?: string
  habrUrl?: string
  publishedAt?: string
  readingTime?: string
  tags?: string[]
  hasArchive?: boolean
}

export interface ArticleItem {
  title: string
  description: string
  path: string
  meta?: ArticleMeta
}
