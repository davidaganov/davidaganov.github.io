import { request } from "@api/services/request"
import { routes } from "@api/services/requests/npm/routes"
import type { NpmDownloadsData, NpmPackageData } from "@api/types/npm"

export const getPackage = async (packageName: string): Promise<NpmPackageData | null> => {
  try {
    return await request.get<NpmPackageData>(routes.package(packageName))
  } catch {
    return null
  }
}

export const getDownloads = async (packageName: string): Promise<NpmDownloadsData | null> => {
  try {
    return await request.get<NpmDownloadsData>(routes.downloads(packageName))
  } catch {
    return null
  }
}
