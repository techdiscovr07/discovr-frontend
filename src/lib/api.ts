const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://discovr-backend.onrender.com"

export type AuthRole = "brand" | "creator"

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

const pickString = (...values: unknown[]) =>
  values.find((value) => typeof value === "string" && value.length > 0) ?? null

export const extractIdToken = (payload: unknown) => {
  if (!isRecord(payload)) return null

  return pickString(
    payload.idToken,
    payload.token,
    payload.accessToken,
    isRecord(payload.data) ? payload.data.idToken : null,
    isRecord(payload.data) ? payload.data.token : null,
    isRecord(payload.data) ? payload.data.accessToken : null,
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

export { ApiError, getErrorMessage }
