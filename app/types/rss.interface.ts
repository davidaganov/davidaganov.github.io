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
  category?: string
  readingTime?: string
  tags?: string[]
  contentHtml?: string
}

export interface RssSiteLinks {
  feedUrl: string
  articlesIndexUrl: string
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
}

export interface ServeRssFeedOptions {
  locale: string
  channelTitle: string
  channelDescription: string
}

export interface RssContentPathMeta {
  sectionId: string
  collectionSource: string
  sectionLabelKey: string
  collectionLabelKey: string
}

export interface DocsRssOgImageInput {
  pagePath: string
  title: string
  description: string
  section: string
  collection: string
}

export interface BuildRssFeedFileOptions {
  locale: string
  siteUrl?: string
  channelTitle: string
  channelDescription: string
}

export interface ContentRssPrerenderRow {
  path: string
  title: string | null
  description: string | null
}
