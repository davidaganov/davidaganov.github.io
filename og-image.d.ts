declare module "#og-image/components" {
  export interface OgImageComponents {
    HomePage: {
      title?: string
      description?: string
    }
    DocsPage: {
      title?: string
      description?: string
      section?: string
      collection?: string
    }
    FeedPage: {
      title?: string
      description?: string
    }
    ResumePage: {
      title?: string
      description?: string
      role?: string
    }
  }
}
