export interface LinkName {
  en: string
  ru: string
}

export interface Link {
  name?: LinkName
  description?: LinkName
  url: string
  icon: string
  customStyle?: string | Record<string, string>
  isCta?: boolean
}

export interface LinksGistContent {
  professional: Link[]
  personal: Link[]
}
