import { request } from "@api/services/request"
import { routes } from "@api/services/requests/links/routes"
import type { LinksGistContent } from "@api/types/links"

type GithubGistResponse = {
  files: Record<
    string,
    {
      content?: string
    }
  >
}

const normalizeLinks = (value: unknown): LinksGistContent => {
  const v = value as Partial<LinksGistContent> | null | undefined

  return {
    professional: Array.isArray(v?.professional) ? v.professional : [],
    personal: Array.isArray(v?.personal) ? v.personal : []
  }
}

export const getLinks = async (): Promise<LinksGistContent> => {
  const config = useRuntimeConfig()
  const gistId = String(config.public.linksGistId)
  const filename = String(config.public.linksGistFilename)

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json"
  }

  if (config.githubToken) {
    headers.Authorization = `Bearer ${config.githubToken}`
  }

  const gistData = await request.get<GithubGistResponse>(routes.gist(gistId), { headers })
  const content = gistData.files?.[filename]?.content

  if (!content) {
    return { professional: [], personal: [] }
  }

  const parsed = JSON.parse(content) as unknown
  return normalizeLinks(parsed)
}
