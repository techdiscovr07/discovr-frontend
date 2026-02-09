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
const LOCAL_BACKEND_URL = "http://localhost:8080"

const resolveApiBaseUrl = () => {

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return LOCAL_BACKEND_URL
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

const requestForm = async <T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
    },
    body: body as FormData | undefined,
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
  role?: AuthRole
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

export const fetchBrandCampaigns = (token: string) =>
  requestJson<Record<string, unknown>>("/brand/campaigns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const createBrandCampaign = (
  token: string,
  payload: {
    name: string
    description: string
    creator_categories: string[]
    total_budget: number
    creator_count: number
    go_live_date: string
  },
) =>
  requestJson<Record<string, unknown>>("/brand/campaigns", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  })

export const uploadBrandCampaignBrief = (token: string, formData: FormData) =>
  requestForm<Record<string, unknown>>("/brand/campaigns/brief", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

export const fetchBrandCampaignCreators = (
  token: string,
  campaignId: string,
  filters?: {
    min_followers?: number
    max_followers?: number
    min_commercial?: number
    max_commercial?: number
    status?: string
  }
) => {
  const params = new URLSearchParams({ campaign_id: campaignId })
  if (filters) {
    if (filters.min_followers) params.append("min_followers", filters.min_followers.toString())
    if (filters.max_followers) params.append("max_followers", filters.max_followers.toString())
    if (filters.min_commercial) params.append("min_commercial", filters.min_commercial.toString())
    if (filters.max_commercial) params.append("max_commercial", filters.max_commercial.toString())
    if (filters.status) params.append("status", filters.status)
  }
  return requestJson<Record<string, unknown>>(
    `/brand/campaigns/creators?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const respondToCampaignCreators = (
  token: string,
  payload: {
    campaign_id: string
    updates: Array<{
      creator_id: string
      status: "pending" | "accepted" | "rejected" | "negotiated"
      comment?: string
    }>
  },
) =>
  requestJson<Record<string, unknown>>("/brand/campaigns/creators/respond", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  })

export const uploadBrandCreatorsSheet = (token: string, formData: FormData) =>
  requestForm<Record<string, unknown>>("/brand/campaigns/creators/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

export const fetchBrandProfile = (token: string) =>
  requestJson<Record<string, unknown>>("/brand/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
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

// Creator API functions – link by creator_token (from email) or by matching signup email to campaign_creator email
export const linkCreatorToCampaign = (
  token: string,
  campaignId: string,
  creatorToken?: string | null,
) =>
  requestJson<{ message: string; campaign_id: string }>(
    "/creator/campaigns/link",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { campaign_id: campaignId, ...(creatorToken ? { creator_token: creatorToken } : {}) },
    },
  )

export const fetchCreatorCampaigns = (token: string) =>
  requestJson<{ campaigns: Array<{
    campaign_id: string
    campaign_name: string
    status: string
    bid_amount?: number
    final_amount?: number
    has_brief: boolean
    has_content: boolean
    go_live_date: string
  }>}>("/creator/campaigns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const submitCreatorBid = (
  token: string,
  campaignId: string,
  bidAmount: number,
) =>
  requestJson<{
    creator_id: string
    bid_amount: number
    status: string
    bid_submitted_at: string
    message: string
  }>(`/creator/campaigns/bid?campaign_id=${encodeURIComponent(campaignId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { bid_amount: bidAmount },
  })

export const fetchCreatorCampaignBrief = (token: string, campaignId: string) =>
  requestJson<{
    campaign: {
      id: string
      name: string
      description?: string
      video_title?: string
      primary_focus?: string
      secondary_focus?: string
      dos?: string
      donts?: string
      cta?: string
      sample_video_url?: string
      go_live_date?: string
    }
    final_amount: number
    status: string
  }>(`/creator/campaigns/brief?campaign_id=${encodeURIComponent(campaignId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const uploadCreatorContent = (
  token: string,
  campaignId: string,
  file: File,
  liveUrl?: string,
) => {
  const formData = new FormData()
  formData.append("file", file)
  if (liveUrl) {
    formData.append("live_url", liveUrl)
  }
  return requestForm<{
    creator_id: string
    content_url: string
    status: string
    content_submitted_at: string
    message: string
  }>(`/creator/campaigns/content?campaign_id=${encodeURIComponent(campaignId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
}

export const creatorGoLive = (
  token: string,
  campaignId: string,
  liveUrl: string,
) =>
  requestJson<{
    creator_id: string
    status: string
    went_live_at: string
    live_url: string
    message: string
  }>(`/creator/campaigns/go-live?campaign_id=${encodeURIComponent(campaignId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { live_url: liveUrl },
  })

// Brand bidding API functions
export const fetchBrandCreatorBids = (token: string, campaignId: string) =>
  requestJson<{
    creators: Array<{
      creator_id: string
      name: string
      email: string
      instagram: string
      bid_amount: number
      status: string
      bid_submitted_at: string
      final_amount?: number
      proposed_amount?: number
      negotiation_deadline?: string
    }>
  }>(`/brand/campaigns/bids?campaign_id=${encodeURIComponent(campaignId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const finalizeCreatorAmounts = (
  token: string,
  campaignId: string,
  updates: Array<{
    creator_id: string
    action: "accept" | "negotiate" | "reject"
    proposed_amount?: number
  }>,
) =>
  requestJson<{
    campaign_id: string
    finalized_count: number
    negotiated_count: number
    rejected_count: number
    message: string
  }>(`/brand/campaigns/finalize-amounts?campaign_id=${encodeURIComponent(campaignId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { updates },
  })

export const fetchBrandCreatorContent = (token: string, campaignId: string) =>
  requestJson<{
    creators: Array<{
      creator_id: string
      name: string
      email: string
      instagram: string
      content_url: string
      content_submitted_at: string
      status: string
      content_feedback?: string
      live_url?: string
      went_live_at?: string
    }>
  }>(`/brand/campaigns/content?campaign_id=${encodeURIComponent(campaignId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const reviewCreatorContent = (
  token: string,
  campaignId: string,
  updates: Array<{
    creator_id: string
    action: "approve" | "reject" | "request_revision"
    feedback?: string
  }>,
) =>
  requestJson<{
    campaign_id: string
    approved_count: number
    rejected_count: number
    revision_requested_count: number
    message: string
  }>(`/brand/campaigns/review-content?campaign_id=${encodeURIComponent(campaignId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { updates },
  })

export { ApiError, getErrorMessage }
