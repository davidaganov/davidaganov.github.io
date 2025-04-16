export interface LinkName {
  en: string
  ru: string
}

export interface Link {
  name: LinkName
  url: string
  icon: string
  customStyle?: string
}
