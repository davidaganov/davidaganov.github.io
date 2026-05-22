export const RSS_FEED_FILENAME = "feed.xml"
export const RSS_CONTENT_PATH_PREFIXES = [
  "/about/projects/",
  "/guides/articles/",
  "/guides/templates/"
] as const

export const RSS_EXCLUDED_PATH_SEGMENT = "/changelog/"

export const RSS_COLLECTION_LABEL_KEYS: Record<
  string,
  { sectionLabelKey: string; collectionLabelKey: string }
> = {
  "about/projects": {
    sectionLabelKey: "layout.navigation.menu.about",
    collectionLabelKey: "layout.navigation.menu.projects"
  },
  "guides/articles": {
    sectionLabelKey: "layout.navigation.menu.guides",
    collectionLabelKey: "layout.navigation.menu.articles"
  },
  "guides/templates": {
    sectionLabelKey: "layout.navigation.menu.guides",
    collectionLabelKey: "layout.navigation.menu.templates"
  }
}
