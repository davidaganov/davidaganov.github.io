export const routes = {
  gist: (gistId: string) => `https://api.github.com/gists/${gistId}`
} as const
