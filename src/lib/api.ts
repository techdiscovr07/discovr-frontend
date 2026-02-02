import type {
  AuthRole,
  YouTubeAnalyticsBasicResponse,
  YouTubeAnalyticsResponse,
  YouTubeDataResponse,
} from "@/lib/models"

const isLocalhostUrl = (value: string) => {
  try {
    const parsed = new URL(value)
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "0.0.0.0"
    )
  } catch {
    return value.includes("localhost") || value.includes("127.0.0.1")
  }
}

const STATIC_BACKEND_URL = "https://discovr-backend.onrender.com"

const resolveApiBaseUrl = () => {

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return ""
  }
  return STATIC_BACKEND_URL
}

const API_BASE_URL = resolveApiBaseUrl()

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

const parseJsonSafely = (text: string) => {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const requestJson = async <T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  const data = parseJsonSafely(text)

  if (!response.ok) {
    const message =
      (isRecord(data) && typeof data.message === "string" && data.message) ||
      response.statusText ||
      "Request failed"
    throw new ApiError(message, response.status)
  }

  return (data ?? ({} as T)) as T
}

const pickString = (...values: unknown[]): string | null => {
  const found = values.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  )
  return found ?? null
}

export const extractIdToken = (payload: unknown) => {
  if (typeof payload === "string" && payload.length > 0) {
    return payload
  }

  if (!isRecord(payload)) return null

  return pickString(
    payload.idToken,
    payload.token,
    payload.accessToken,
    payload.id_token,
    payload.access_token,
    payload.firebaseIdToken,
    payload.firebase_id_token,
    isRecord(payload.token) ? payload.token.idToken : null,
    isRecord(payload.data) ? payload.data.idToken : null,
    isRecord(payload.data) ? payload.data.token : null,
    isRecord(payload.data) ? payload.data.accessToken : null,
    isRecord(payload.data) ? payload.data.id_token : null,
    isRecord(payload.data) ? payload.data.access_token : null,
    isRecord(payload.data) ? payload.data.firebaseIdToken : null,
    isRecord(payload.data) ? payload.data.firebase_id_token : null,
    isRecord(payload.data) && isRecord(payload.data.token)
      ? payload.data.token.idToken
      : null,
  )
}

export const signup = (payload: {
  email: string
  password: string
  name: string
  role: AuthRole
}) => requestJson("/auth/signup", { method: "POST", body: payload })

export const loginWithPassword = (payload: {
  email: string
  password: string
  role: AuthRole
}) => requestJson("/auth/login/password", { method: "POST", body: payload })

export const loginWithIdToken = (payload: { idToken: string; role: AuthRole }) =>
  requestJson("/auth/login", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${payload.idToken}`,
    },
    body: { role: payload.role },
  })

export const fetchProfile = (idToken: string) =>
  requestJson("/api/profile", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

export const getYouTubeConnectUrl = async (idToken: string) => {
  const response = await requestJson<{ auth_url?: string }>(
    "/integrations/youtube/connect",
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  )
  return response
}

export const assertValidYouTubeAuthUrl = (authUrl: string) => {
  if (!authUrl) {
    throw new Error("No auth URL returned from server.")
  }
  let redirectUri: string | null = null
  try {
    const parsed = new URL(authUrl)
    redirectUri = parsed.searchParams.get("redirect_uri")
  } catch {
    if (authUrl.includes("localhost") || authUrl.includes("127.0.0.1")) {
      throw new Error(
        "YouTube OAuth is misconfigured: backend returned a localhost auth URL. Update the backend base URL / redirect URI to use your public backend domain, then try again.",
      )
    }
    return authUrl
  }

  if (redirectUri && isLocalhostUrl(redirectUri)) {
    throw new Error(
      `YouTube OAuth is misconfigured: backend returned redirect_uri=${redirectUri}. Update the backend base URL / redirect URI to use your public backend domain, then try again.`,
    )
  }

  return authUrl
}

export const getYouTubeConnectUrlWithRedirect = async (
  idToken: string,
  redirect: string,
) => {
  const params = new URLSearchParams({ redirect })
  return requestJson<{ auth_url?: string }>(
    `/integrations/youtube/connect?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  )
}

export const fetchYouTubeData = (idToken: string) =>
  requestJson<YouTubeDataResponse>("/integrations/youtube/data", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

export const fetchYouTubeAnalytics = (
  idToken: string,
  startDate: string,
  endDate: string,
) => {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  })
  return requestJson<YouTubeAnalyticsResponse>(
    `/integrations/youtube/analytics/all?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  )
}

export const fetchYouTubeAnalyticsBasic = (
  idToken: string,
  startDate: string,
  endDate: string,
) => {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  })
  return requestJson<YouTubeAnalyticsBasicResponse>(
    `/integrations/youtube/analytics?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  )
}

export { ApiError, getErrorMessage }
