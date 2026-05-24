const encodePackage = (packageName: string): string => encodeURIComponent(packageName)

export const routes = {
  package: (packageName: string) => `https://registry.npmjs.org/${encodePackage(packageName)}`,
  downloadsPoint: (packageName: string, period: string) => {
    return `https://api.npmjs.org/downloads/point/${period}/${encodePackage(packageName)}`
  }
} as const
