export interface ContentMapping {
  path: string
  sectionId: string
  collectionSource?: string
  collectionLabel?: string
  isCollectionItem: boolean
}

export interface DocsCollectionDescriptor {
  collectionKey: string
  sectionId: string
  source: string
  contentPathPrefix: string
  indexPublicPath: string
  titleKey: string
}
