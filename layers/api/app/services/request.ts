export interface ApiRequestOptions {
  headers?: Record<string, string>
}

export const request = {
  get: async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
    return $fetch<T>(url, {
      headers: options.headers
    })
  }
}
