export const routes = {
  package: (packageName: string) => `https://registry.npmjs.org/${packageName}`,
  downloads: (packageName: string) =>
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`
} as const
