import type { DocsPageMeta, DocsBreadcrumbItem } from "@docs/types/docs"
import { TYPE_PAGE } from "@docs/types/enums"

interface StructuredDataOptions {
  pageTitle: string
  pageDescription: string | undefined
  canonicalUrl: string
  siteUrl: string
  seoImage: string | undefined
  language: string
  pageType: TYPE_PAGE
  isCollectionPage: boolean
  meta: DocsPageMeta
  breadcrumbs: DocsBreadcrumbItem[]
  currentPath: string
  authorName: string
}

const buildBreadcrumbSchema = (
  breadcrumbs: DocsBreadcrumbItem[],
  pageTitle: string,
  currentPath: string,
  siteUrl: string
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [...breadcrumbs, { label: pageTitle, to: currentPath }].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${siteUrl}${item.to || currentPath}`
  }))
})

export const buildStructuredData = (opts: StructuredDataOptions): string => {
  const breadcrumbSchema = buildBreadcrumbSchema(
    opts.breadcrumbs,
    opts.pageTitle,
    opts.currentPath,
    opts.siteUrl
  )

  if (opts.isCollectionPage) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: opts.pageTitle,
      description: opts.pageDescription,
      url: opts.canonicalUrl,
      inLanguage: opts.language
    }
    return JSON.stringify([schema, breadcrumbSchema])
  }

  if (opts.pageType === TYPE_PAGE.PROJECT) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: opts.pageTitle,
      description: opts.pageDescription,
      url: opts.canonicalUrl,
      codeRepository: opts.meta.githubUrl,
      inLanguage: opts.language
    }
    return JSON.stringify([schema, breadcrumbSchema])
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.pageTitle,
    description: opts.pageDescription,
    url: opts.canonicalUrl,
    image: opts.seoImage,
    datePublished: opts.meta.publishedAt,
    inLanguage: opts.language,
    author: {
      "@type": "Person",
      name: opts.authorName
    }
  }
  return JSON.stringify([schema, breadcrumbSchema])
}
