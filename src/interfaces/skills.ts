export interface SkillTitle {
  ru: string
  en: string
  [key: string]: string
}

export interface SkillItem {
  id: number
  title: string | SkillTitle
  tags: string[]
}

export interface SkillCategory {
  id: number
  title: string | SkillTitle
  list: SkillItem[]
  icon?: string
}
