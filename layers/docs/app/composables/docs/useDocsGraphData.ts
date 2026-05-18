import type { DocsGraphFile } from "@docs/types"

export const useDocsGraphData = () => {
  const { locale } = useI18n()

  return useAsyncData(
    () => `docs-graph-json:${locale.value}`,
    () => $fetch<DocsGraphFile>(`/api/docs/${locale.value}`),
    {
      watch: [locale],
      server: false
    }
  )
}
