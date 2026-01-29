export type AuthRole = "brand" | "creator"

export type AnalyticsRow = Record<string, string | number | null>

export type AnalyticsSection = AnalyticsRow[]

export type AnalyticsSummary = AnalyticsRow | AnalyticsRow[]

export interface YouTubeChannel {
  id?: string
  title?: string
  description?: string
  customUrl?: string
  country?: string
  publishedAt?: string
  subscriberCount?: number
  viewCount?: number
  videoCount?: number
  thumbnailUrl?: string
  handle?: string
}

export interface YouTubeUpload {
  id?: string
  title?: string
  description?: string
  publishedAt?: string
  thumbnailUrl?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
}

export interface YouTubeDataResponse {
  channel?: YouTubeChannel
  uploads?: YouTubeUpload[]
}

export interface YouTubeAnalyticsResponse {
  summary?: AnalyticsSummary
  by_day?: AnalyticsSection
  by_country?: AnalyticsSection
  by_traffic_source?: AnalyticsSection
  by_traffic_source_detail?: AnalyticsSection
  by_device?: AnalyticsSection
  by_playback_location?: AnalyticsSection
  by_subscribed_status?: AnalyticsSection
  by_gender_age?: AnalyticsSection
  by_video?: AnalyticsSection
  by_video_country?: AnalyticsSection
  by_video_playback_location?: AnalyticsSection
  audience_retention_by_video?: AnalyticsSection
}
