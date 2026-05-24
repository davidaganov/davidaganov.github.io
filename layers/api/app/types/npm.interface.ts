export interface NpmPackageData {
  "dist-tags": {
    latest: string
  }
  time?: {
    created?: string
    modified?: string
  }
}

export interface NpmDownloadsData {
  downloads: number
}
