import type { LocalizedFlexible, LocalizedRecord } from "./localized"

export const RESUME_SKILL_TAGS = ["frontend", "backend", "tooling"] as const

export type ResumeSkillTag = (typeof RESUME_SKILL_TAGS)[number]

export interface ResumeContacts {
  telegram: string
  telegramUrl: string
  email: string
  github: string
  habr: string
  npm: string
  site: string
}

export interface ResumeEmployment {
  format: LocalizedRecord
  type: LocalizedRecord
}

export interface ResumeSkill {
  name: string
  tags: ResumeSkillTag[]
}

export interface ResumeExperienceProject {
  name?: LocalizedFlexible
  subtitle?: LocalizedFlexible
  items: LocalizedFlexible[]
  stack?: LocalizedFlexible
}

export interface ResumeExperienceDates {
  start: string
  end: string | null
}

export interface ResumeExperienceEntry {
  company: LocalizedRecord
  role: LocalizedFlexible
  dates: ResumeExperienceDates
  location: LocalizedRecord
  intro?: LocalizedFlexible
  items?: LocalizedFlexible[]
  stack?: LocalizedFlexible
  projects?: ResumeExperienceProject[]
}

export interface ResumeExperienceView {
  company: string
  role: string
  period: string
  duration?: string
  location: string
  intro?: string
  items: string[]
  stack?: string
  projects: Array<{
    name?: string
    subtitle?: string
    items: string[]
    stack?: string
  }>
}

export interface ResumeLocaleContent {
  role: string
  summary: string
  copyText: string
}

export type ResumeLocaleContents = Record<string, ResumeLocaleContent>

export type ResumeData = {
  contacts: ResumeContacts
  employment: ResumeEmployment
  skills: ResumeSkill[]
  experience: ResumeExperienceEntry[]
} & ResumeLocaleContents
