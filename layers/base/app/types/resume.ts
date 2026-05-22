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

export interface ResumeExperienceProjectView {
  name?: string
  subtitle?: string
  items: string[]
  stack?: string
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
  projects: ResumeExperienceProjectView[]
}

export interface ResumePdfSkillGroup {
  label: string
  items: string[]
}

export interface ResumePdfLabels {
  skills: string
  summary: string
  experience: string
}

export interface ResumePdfInput {
  name: string
  role: string
  summary: string
  employmentFormat: string
  employmentType: string
  frontendYearsLabel: string
  backendYearsLabel: string
  contacts: ResumeContacts
  skillGroups: ResumePdfSkillGroup[]
  experience: ResumeExperienceView[]
  labels: ResumePdfLabels
}

export interface PdfMakeVfsModule {
  pdfMake?: { vfs: Record<string, string> }
  default?: { pdfMake?: { vfs: Record<string, string> } }
}

export interface ResumeLocaleContent {
  role: string
  summary: string
}

export type ResumeLocaleContents = Record<string, ResumeLocaleContent>

export type ResumeData = {
  contacts: ResumeContacts
  employment: ResumeEmployment
  skills: ResumeSkill[]
  experience: ResumeExperienceEntry[]
} & ResumeLocaleContents
