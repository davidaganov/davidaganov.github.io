import { pickLocalized, pickRecordByLocale, resolveLocalized } from "@base/utils/localizedRecord"
import { formatExperienceDuration, formatExperiencePeriod } from "@base/utils/resumeExperienceDates"
import { parseResumeData } from "@base/utils/resumeSchema"
import { normalizeSiteLocale } from "@base/utils/siteLocale"
import type {
  ResumeExperienceView,
  ResumeLocaleContent,
  ResumeLocaleContents,
  ResumeSkillTag
} from "@base/types"
import rawResume from "@base/data/resume.json"

const resumeData = parseResumeData(rawResume)

export const useResumeData = () => {
  const { locale, t } = useI18n()

  const localeCode = computed(() => normalizeSiteLocale(locale.value))

  const content = computed((): ResumeLocaleContent => {
    return pickRecordByLocale(localeCode.value, resumeData as ResumeLocaleContents)
  })

  const employmentFormat = computed(() => {
    return pickLocalized(localeCode.value, resumeData.employment.format)
  })

  const employmentType = computed(() => pickLocalized(localeCode.value, resumeData.employment.type))

  const experience = computed((): ResumeExperienceView[] => {
    const code = localeCode.value
    return resumeData.experience.map((entry) => ({
      company: resolveLocalized(code, entry.company),
      role: resolveLocalized(code, entry.role),
      period: formatExperiencePeriod(entry.dates, code),
      duration: formatExperienceDuration(entry.dates, code),
      location: resolveLocalized(code, entry.location),
      intro: entry.intro ? resolveLocalized(code, entry.intro) : undefined,
      items: entry.items?.map((item) => resolveLocalized(code, item)) ?? [],
      stack: entry.stack ? resolveLocalized(code, entry.stack) : undefined,
      projects:
        entry.projects?.map((project) => ({
          name: project.name ? resolveLocalized(code, project.name) : undefined,
          subtitle: project.subtitle ? resolveLocalized(code, project.subtitle) : undefined,
          items: project.items.map((item) => resolveLocalized(code, item)),
          stack: project.stack ? resolveLocalized(code, project.stack) : undefined
        })) ?? []
    }))
  })

  const skillTagLabel = (tag: ResumeSkillTag): string => t(`pages.resume.skillTags.${tag}`)

  return {
    data: resumeData,
    content,
    employmentFormat,
    employmentType,
    experience,
    skills: resumeData.skills,
    contacts: resumeData.contacts,
    skillTagLabel
  }
}
