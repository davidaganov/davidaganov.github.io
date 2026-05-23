import type { ArticleMeta } from "@docs/types"

export interface RssChannelMeta {
  title: string
  description: string
  link: string
  language: string
  feedUrl: string
  imageUrl?: string
}

export interface RssPostItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
  imageUrl?: string
  categories?: string[]
  creator?: string
  readingTime?: string
  tags?: string[]
  contentHtml?: string
}

export interface RssSiteLinks {
  feedUrl: string
  articlesIndexUrl: string
}

export interface RssAssetChannel {
  title: string
  description: string
  creator: string
}

export interface ContentRssEntry {
  title?: string | null
  description?: string | null
  path?: string | null
  meta?: ArticleMeta | null
  seo?: {
    ogImage?: string
    image?: string
  } | null
  rssCategories?: string[]
}

export interface RssAssetFile {
  channel: RssAssetChannel
  entries: ContentRssEntry[]
}

export interface ServeRssFeedOptions {
  locale: string
}

export interface RssContentPathMeta {
  sectionId: string
  collectionSource: string
  sectionLabelKey: string
  collectionLabelKey: string
}
