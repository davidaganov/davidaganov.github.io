export interface LinkName {
  en: string
  ru: string
}

export interface LinkDescription {
  en: string
  ru: string
}

export interface Link {
  name: LinkName
  description?: LinkDescription
  url: string
  icon: string
  customStyle?: string
}

export interface LinksGistContent {
  professional: Link[]
  personal: Link[]
}
