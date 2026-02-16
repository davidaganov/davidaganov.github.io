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

const API_CONFIG = {
  timeout: 10000
}

const buildURL = (url: string, params?: Record<string, string | number | boolean>): string => {
  if (!params || Object.keys(params).length === 0) return url

  const urlObj = new URL(url, typeof window !== "undefined" ? window.location.origin : undefined)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, String(value))
    }
  })

  return urlObj.toString()
}

export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { method = "GET", params, body, timeout = API_CONFIG.timeout } = options

  const fullUrl = buildURL(url, params)

  const headers: Record<string, string> = {
    ...options.headers
  }

  if (body) {
    headers["Content-Type"] = "application/json"
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
        statusText: response.statusText,
        data: errorText
      } as ApiError
    }

    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      return (await response.json()) as T
    } else {
      return (await response.text()) as unknown as T
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw {
          message: "Request timeout",
          status: 408,
          statusText: "Request Timeout"
        } as ApiError
      }

      throw {
        message: error.message,
        status: 0,
        statusText: "Network Error"
      } as ApiError
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export const request = {
  get: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PUT", body }),

  patch: <T>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(url, { ...options, method: "PATCH", body }),

  delete: <T>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(url, { ...options, method: "DELETE" })
}
