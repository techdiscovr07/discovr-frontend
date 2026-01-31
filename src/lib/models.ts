export type AuthRole = "brand" | "creator"

export type AnalyticsRow = Record<string, string | number | null>

export type AnalyticsSection = AnalyticsRow[]

export type AnalyticsSummary = AnalyticsRow | AnalyticsRow[]

export interface YouTubeChannel {
  id?: string
  title?: string
  description?: string
  customUrl?: string
  publishedAt?: string
  subscriberCount?: number
  viewCount?: number
  videoCount?: number
  thumbnails?: {
    default?: { url?: string; width?: number; height?: number }
    medium?: { url?: string; width?: number; height?: number }
    high?: { url?: string; width?: number; height?: number }
  }
}

export interface YouTubeUpload {
  id?: string
  videoId?: string
  title?: string
  description?: string
  publishedAt?: string
  thumbnails?: {
    default?: { url?: string; width?: number; height?: number }
    medium?: { url?: string; width?: number; height?: number }
    high?: { url?: string; width?: number; height?: number }
    standard?: { url?: string; width?: number; height?: number }
    maxres?: { url?: string; width?: number; height?: number }
  }
  channelTitle?: string
}

export interface YouTubeDataResponse {
  channel?: {
    id?: string
    snippet?: {
      title?: string
      description?: string
      customUrl?: string
      publishedAt?: string
      thumbnails?: YouTubeChannel["thumbnails"]
    }
    statistics?: {
      subscriberCount?: string
      viewCount?: string
      videoCount?: string
    }
  }
  uploads?: Array<{
    id?: string
    snippet?: {
      title?: string
      description?: string
      publishedAt?: string
      channelTitle?: string
      thumbnails?: YouTubeUpload["thumbnails"]
    }
    contentDetails?: {
      videoId?: string
      videoPublishedAt?: string
    }
  }>
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

export interface YouTubeAnalyticsBasicResponse {
  column_headers?: Array<{
    columnType?: string
    dataType?: string
    name?: string
  }>
  start_date?: string
  end_date?: string
  rows?: Array<Array<string | number | null>>
}
