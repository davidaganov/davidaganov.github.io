import { absoluteUrl } from "@app/utils/seo"
import { type DocsBreadcrumbItem, type DocsPageMeta, TYPE_PAGE } from "@docs/types"

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
  "@type": "BreadcrumbList",
  itemListElement: [...breadcrumbs, { label: pageTitle, to: currentPath }].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: absoluteUrl(siteUrl, item.to || currentPath)
  }))
})

export const buildStructuredDataNodes = (
  opts: StructuredDataOptions
): Record<string, unknown>[] => {
  const breadcrumbSchema = buildBreadcrumbSchema(
    opts.breadcrumbs,
    opts.pageTitle,
    opts.currentPath,
    opts.siteUrl
  )

  if (opts.isCollectionPage) {
    const schema = {
      "@type": "CollectionPage",
      "@id": `${opts.canonicalUrl}#webpage`,
      name: opts.pageTitle,
      description: opts.pageDescription,
      url: opts.canonicalUrl,
      inLanguage: opts.language,
      isPartOf: {
        "@id": `${opts.siteUrl}/#website`
      }
    }
    return [schema, breadcrumbSchema]
  }

  if (opts.pageType === TYPE_PAGE.PROJECT) {
    const schema = {
      "@type": "SoftwareSourceCode",
      "@id": `${opts.canonicalUrl}#software-source-code`,
      name: opts.pageTitle,
      description: opts.pageDescription,
      url: opts.canonicalUrl,
      codeRepository: opts.meta.githubUrl,
      inLanguage: opts.language,
      author: {
        "@id": `${opts.siteUrl}/#person`
      },
      isPartOf: {
        "@id": `${opts.siteUrl}/#website`
      }
    }
    return [schema, breadcrumbSchema]
  }

  const schema = {
    "@type": "Article",
    "@id": `${opts.canonicalUrl}#article`,
    mainEntityOfPage: {
      "@id": `${opts.canonicalUrl}#webpage`
    },
    headline: opts.pageTitle,
    description: opts.pageDescription,
    url: opts.canonicalUrl,
    image: opts.seoImage,
    datePublished: opts.meta.publishedAt,
    inLanguage: opts.language,
    author: {
      "@id": `${opts.siteUrl}/#person`,
      "@type": "Person",
      name: opts.authorName
    },
    isPartOf: {
      "@id": `${opts.siteUrl}/#website`
    }
  }
  return [schema, breadcrumbSchema]
}
