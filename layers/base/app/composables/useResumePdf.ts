import type { TCreatedPdf } from "pdfmake/interfaces"
import { useExperience } from "@base/composables/useExperience"
import { useResumeData } from "@base/composables/useResumeData"
import { buildResumePdfDefinition } from "@base/utils/resumePdfDefinition"
import { type PdfMakeVfsModule, RESUME_SKILL_TAGS } from "@base/types"

const getPdfMake = async () => {
  const pdfMakeModule = await import("pdfmake/build/pdfmake")
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts")

  const pdfMake = pdfMakeModule.default
  const pdfFonts = pdfFontsModule as PdfMakeVfsModule
  const vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.default?.pdfMake?.vfs

  if (vfs) (pdfMake as unknown as { vfs: Record<string, string> }).vfs = vfs

  return pdfMake
}

export const useResumePdf = () => {
  const { t } = useI18n()
  const { frontendYears, backendYears } = useExperience()
  const { content, employmentFormat, employmentType, experience, contacts, skills, skillTagLabel } =
    useResumeData()

  const isGenerating = ref(false)

  const skillGroups = computed(() => {
    const assigned = new Set<string>()

    return RESUME_SKILL_TAGS.map((tag) => {
      const items = skills
        .filter((skill) => skill.tags.includes(tag))
        .map((skill) => skill.name)
        .filter((name) => {
          if (assigned.has(name)) return false
          assigned.add(name)
          return true
        })

      return {
        label: skillTagLabel(tag),
        items
      }
    }).filter((group) => group.items.length > 0)
  })

  const downloadPdf = async () => {
    if (!import.meta.client || isGenerating.value) return

    isGenerating.value = true

    try {
      const pdfMake = await getPdfMake()
      const definition = buildResumePdfDefinition({
        name: t("global.name"),
        role: content.value.role,
        summary: content.value.summary,
        employmentFormat: employmentFormat.value,
        employmentType: employmentType.value,
        frontendYearsLabel: `${t("pages.resume.experienceFrontend")}: ${t("pages.resume.years", { count: frontendYears.value })}`,
        backendYearsLabel: `${t("pages.resume.experienceBackend")}: ${t("pages.resume.years", { count: backendYears.value })}`,
        contacts,
        skillGroups: skillGroups.value,
        experience: experience.value,
        labels: {
          skills: t("pages.resume.sections.skills"),
          summary: t("pages.resume.sections.summary"),
          experience: t("pages.resume.sections.experience")
        }
      })

      const pdf: TCreatedPdf = pdfMake.createPdf(definition)
      pdf.download("CV_David_Aganov.pdf")
    } finally {
      isGenerating.value = false
    }
  }

  return { isGenerating, downloadPdf }
}
