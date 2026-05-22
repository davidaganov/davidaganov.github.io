import type { Column, Content, TDocumentDefinitions } from "pdfmake/interfaces"
import type { ResumeExperienceView, ResumePdfInput } from "@base/types"

const PDF_COLORS = {
  text: "#171717",
  muted: "#525252",
  faint: "#737373",
  rule: "#c4c4c4"
} as const

const BODY_SIZE = 9.5
const SECTION_SIZE = 9
const TITLE_SIZE = 18
const SUBTITLE_SIZE = 11
const JOB_TITLE_SIZE = 10.5
const SECTION_RULE_WIDTH = 140
const JOB_SEPARATOR_WIDTH = 340
const PROJECT_INDENT = 10

const stripResumeHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const sectionLabel = (text: string): Content[] => [
  {
    text,
    fontSize: SECTION_SIZE,
    bold: true,
    color: PDF_COLORS.text,
    margin: [0, 0, 0, 3]
  },
  {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: SECTION_RULE_WIDTH,
        y2: 0,
        lineWidth: 0.75,
        lineColor: PDF_COLORS.rule
      }
    ],
    margin: [0, 0, 0, 5]
  }
]

const jobSeparator = (): Content => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: JOB_SEPARATOR_WIDTH,
      y2: 0,
      lineWidth: 0.5,
      lineColor: PDF_COLORS.rule
    }
  ],
  margin: [0, 9, 0, 2]
})

const buildProjectBlocks = (project: ResumeExperienceView["projects"][number]): Content[] => {
  const blocks: Content[] = []
  const name = project.name?.trim()
  const subtitle = project.subtitle?.trim()

  if (name || subtitle) {
    blocks.push({
      text: subtitle
        ? [
            { text: name ?? "", bold: true, color: PDF_COLORS.muted },
            { text: ` — ${subtitle}`, color: PDF_COLORS.faint }
          ]
        : (name ?? ""),
      fontSize: BODY_SIZE - 0.5,
      margin: [PROJECT_INDENT, 3, 0, 1]
    })
  }

  if (project.items.length) {
    blocks.push({
      ul: project.items.map((item) => stripResumeHtml(item)),
      fontSize: BODY_SIZE,
      color: PDF_COLORS.text,
      margin: [PROJECT_INDENT, 0, 0, 2],
      lineHeight: 1.18
    })
  }

  return blocks
}

const buildJobBlocks = (job: ResumeExperienceView, index: number): Content[] => {
  const periodLocation = [job.period, job.location].filter(Boolean).join(" · ")

  const block: Content[] = [
    {
      columns: [
        {
          width: "*",
          text: [
            { text: job.company, bold: true, fontSize: JOB_TITLE_SIZE, color: PDF_COLORS.text },
            {
              text: periodLocation ? ` ${periodLocation}` : "",
              fontSize: BODY_SIZE,
              color: PDF_COLORS.faint
            }
          ]
        },
        {
          width: "auto",
          text: job.duration ?? "",
          alignment: "right",
          fontSize: BODY_SIZE,
          color: PDF_COLORS.faint
        }
      ],
      margin: [0, index === 0 ? 0 : 2, 0, 1]
    },
    {
      text: job.role,
      fontSize: BODY_SIZE,
      color: PDF_COLORS.muted,
      margin: [0, 0, 0, job.items.length || job.projects.length ? 2 : 0]
    }
  ]

  if (job.items.length) {
    block.push({
      ul: job.items.map((item) => stripResumeHtml(item)),
      fontSize: BODY_SIZE,
      color: PDF_COLORS.text,
      margin: [0, 0, 0, job.projects.length ? 2 : 0],
      lineHeight: 1.18
    })
  }

  for (const project of job.projects) {
    block.push(...buildProjectBlocks(project))
  }

  return block
}

const buildExperienceBlocks = (jobs: ResumeExperienceView[]): Content[] => {
  return jobs.flatMap((job, index) => {
    const blocks = buildJobBlocks(job, index)
    if (index < jobs.length - 1) blocks.push(jobSeparator())
    return blocks
  })
}

export const buildResumePdfDefinition = (input: ResumePdfInput): TDocumentDefinitions => {
  const contactLine = [
    input.contacts.telegram,
    input.contacts.email,
    input.contacts.github.replace(/^https?:\/\//, ""),
    input.contacts.site.replace(/^https?:\/\//, "")
  ].join(" · ")

  const metaLine = [
    input.frontendYearsLabel,
    input.backendYearsLabel,
    input.employmentFormat,
    input.employmentType
  ].join(" · ")

  const skillBlocks: Content[] = input.skillGroups.flatMap((group) => [
    {
      text: [
        { text: `${group.label}: `, bold: true, color: PDF_COLORS.muted },
        { text: group.items.join(", "), color: PDF_COLORS.text }
      ],
      fontSize: BODY_SIZE,
      lineHeight: 1.25,
      margin: [0, 0, 0, 4]
    }
  ])

  const leftColumn: Column = {
    width: "34%",
    stack: [
      ...sectionLabel(input.labels.summary),
      {
        text: input.summary,
        fontSize: BODY_SIZE,
        color: PDF_COLORS.text,
        lineHeight: 1.25,
        margin: [0, 0, 0, 9]
      },
      ...sectionLabel(input.labels.skills),
      ...skillBlocks
    ]
  }

  const rightColumn: Column = {
    width: "66%",
    stack: [...sectionLabel(input.labels.experience), ...buildExperienceBlocks(input.experience)]
  }

  return {
    pageSize: "A4",
    pageMargins: [28, 28, 32, 30],
    defaultStyle: {
      font: "Roboto",
      fontSize: BODY_SIZE,
      color: PDF_COLORS.text,
      lineHeight: 1.2
    },
    info: {
      title: `${input.name} — ${input.role}`,
      author: input.name
    },
    content: [
      { text: input.name, fontSize: TITLE_SIZE, bold: true, margin: [0, 0, 0, 2] },
      { text: input.role, fontSize: SUBTITLE_SIZE, color: PDF_COLORS.muted, margin: [0, 0, 0, 4] },
      { text: metaLine, fontSize: BODY_SIZE, color: PDF_COLORS.faint, margin: [0, 0, 0, 3] },
      { text: contactLine, fontSize: BODY_SIZE, color: PDF_COLORS.faint, margin: [0, 0, 0, 8] },
      {
        canvas: [
          { type: "line", x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 0.5, lineColor: PDF_COLORS.rule }
        ],
        margin: [0, 0, 0, 9]
      },
      {
        columns: [leftColumn, { text: "", width: 12 }, rightColumn],
        columnGap: 0
      }
    ]
  }
}
