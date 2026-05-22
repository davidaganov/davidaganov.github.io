import { z } from "zod"
import { localizedFlexibleSchema, localizedRecordSchema } from "@base/utils/localizedRecord"
import { getSiteLocaleCodes } from "@base/constants/siteLocaleCodes"
import { RESUME_SKILL_TAGS, type ResumeData } from "@base/types"

const skillTagSchema = z.enum(RESUME_SKILL_TAGS)

const localeContentSchema = z.object({
  role: z.string().min(1),
  summary: z.string().min(1)
})

const localeContentsShape = Object.fromEntries(
  getSiteLocaleCodes().map((code) => [code, localeContentSchema])
)

const experienceProjectSchema = z.object({
  name: localizedFlexibleSchema.optional(),
  subtitle: localizedFlexibleSchema.optional(),
  items: z.array(localizedFlexibleSchema).min(1),
  stack: localizedFlexibleSchema.optional()
})

const experienceDatesSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable()
})

const experienceEntrySchema = z
  .object({
    company: localizedRecordSchema,
    role: localizedFlexibleSchema,
    dates: experienceDatesSchema,
    location: localizedRecordSchema,
    intro: localizedFlexibleSchema.optional(),
    items: z.array(localizedFlexibleSchema).optional(),
    stack: localizedFlexibleSchema.optional(),
    projects: z.array(experienceProjectSchema).optional()
  })
  .refine((entry) => Boolean(entry.intro || entry.items?.length || entry.projects?.length), {
    message: "experience entry must have intro, items, or projects"
  })

export const resumeDataSchema = z
  .object({
    contacts: z.object({
      telegram: z.string().min(1),
      telegramUrl: z.string().url(),
      email: z.string().email(),
      github: z.string().url(),
      habr: z.string().url(),
      npm: z.string().url(),
      site: z.string().url()
    }),
    employment: z.object({
      format: localizedRecordSchema,
      type: localizedRecordSchema
    }),
    skills: z
      .array(
        z.object({
          name: z.string().min(1),
          tags: z.array(skillTagSchema).min(1)
        })
      )
      .min(1),
    experience: z.array(experienceEntrySchema),
    ...localeContentsShape
  })
  .strict()

export const parseResumeData = (raw: unknown): ResumeData => {
  const result = resumeDataSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
    throw new Error(`Invalid layers/base/app/data/resume.json: ${issues}`)
  }
  return result.data as ResumeData
}
