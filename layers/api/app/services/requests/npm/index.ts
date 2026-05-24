import { request } from "@api/services/request"
import { routes } from "@api/services/requests/npm/routes"
import { getNpmDownloadChunks, getNpmDownloadsStartDate } from "@api/utils/npm-downloads"
import type { NpmDownloadsData, NpmPackageData } from "@api/types"

export const getPackage = async (packageName: string): Promise<NpmPackageData | null> => {
  try {
    return await request.get<NpmPackageData>(routes.package(packageName))
  } catch {
    return null
  }
}

const getDownloadsForPeriod = async (packageName: string, period: string): Promise<number> => {
  const data = await request.get<NpmDownloadsData>(routes.downloadsPoint(packageName, period))
  return data?.downloads ?? 0
}

export const getDownloads = async (packageName: string): Promise<NpmDownloadsData | null> => {
  try {
    const packageData = await getPackage(packageName)
    const end = new Date()
    const start = getNpmDownloadsStartDate(packageData?.time?.created, end)
    const chunks = getNpmDownloadChunks(start, end)

    const totals = await Promise.all(
      chunks.map((chunk) => getDownloadsForPeriod(packageName, `${chunk.start}:${chunk.end}`))
    )

    return { downloads: totals.reduce((sum, count) => sum + count, 0) }
  } catch {
    return null
  }
}
