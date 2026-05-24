import { ROUTE_PATH } from "@base/types"

export interface SiteSearchPageConfig {
  path: string
  titleKey: string
  descriptionKey: string
  icon: string
}

export const SITE_SEARCH_PAGES: SiteSearchPageConfig[] = [
  {
    path: ROUTE_PATH.RESUME,
    titleKey: "pages.resume.seoTitle",
    descriptionKey: "pages.resume.seoDescription",
    icon: "i-lucide-user-round"
  },
  {
    path: ROUTE_PATH.FEED,
    titleKey: "pages.feed.seoTitle",
    descriptionKey: "pages.feed.seoDescription",
    icon: "i-lucide-rss"
  }
]

export const findSiteSearchPage = (path: string): SiteSearchPageConfig | null => {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return SITE_SEARCH_PAGES.find((page) => page.path === normalized) ?? null
}
