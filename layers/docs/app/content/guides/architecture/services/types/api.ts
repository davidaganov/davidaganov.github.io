export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  body?: unknown
  timeout?: number
}

export interface ApiError {
  message: string
  status: number
  statusText: string
  data?: string
}
