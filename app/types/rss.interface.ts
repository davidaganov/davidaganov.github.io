import type { ArticleMeta } from "@docs/types"

export interface RssChannelMeta {
  title: string
  description: string
  link: string
  language: string
  feedUrl: string
}

export interface RssPostItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
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
}

export interface ServeRssFeedOptions {
  locale: string
  channelTitle: string
  channelDescription: string
}
