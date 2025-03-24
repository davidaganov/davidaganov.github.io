export interface SkillItem {
  id: number
  title: string
  tags: string[]
}

export interface SkillCategory {
  id: number
  title: string
  list: SkillItem[]
}
