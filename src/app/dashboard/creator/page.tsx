"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Youtube,
  Instagram,
  Twitter,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  fetchYouTubeAnalyticsBasic,
  fetchYouTubeData,
  getErrorMessage,
  assertValidYouTubeAuthUrl,
  getYouTubeConnectUrlWithRedirect,
} from "@/lib/api"
import { getCachedIdToken } from "@/lib/auth"
import type {
  AnalyticsRow,
  AnalyticsSection,
  YouTubeAnalyticsBasicResponse,
} from "@/lib/models"
import { toast } from "sonner"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Mock data
const creatorStats = {
  subscribers: 125000,
  avgViews: 45000,
  engagementRate: 5.8,
  totalEarnings: 23450,
  pendingEarnings: 3200,
  lifetimeEarnings: 67890,
}

const activeCampaigns = [
  {
    id: 1,
    brand: "TechCorp",
    title: "Product Review - Wireless Headphones",
    status: "in-progress",
    payment: 2500,
    deadline: "2026-02-15",
    progress: 60,
    deliverables: "1 YouTube video (10-15 min)",
  },
  {
    id: 2,
    brand: "FashionBrand",
    title: "Spring Collection Showcase",
    status: "pending",
    payment: 1800,
    deadline: "2026-02-20",
    progress: 0,
    deliverables: "3 Instagram posts + 2 Stories",
  },
  {
    id: 3,
    brand: "FitnessApp",
    title: "App Tutorial & Review",
    status: "in-progress",
    payment: 3000,
    deadline: "2026-02-10",
    progress: 85,
    deliverables: "1 YouTube video + 1 Short",
  },
]

const recentEarnings = [
  {
    id: 1,
    brand: "TechGear Inc",
    campaign: "Product Launch Campaign",
    amount: 2500,
    date: "2026-01-20",
    status: "paid",
  },
  {
    id: 2,
    brand: "StyleCo",
    campaign: "Winter Collection",
    amount: 1800,
    date: "2026-01-15",
    status: "paid",
  },
  {
    id: 3,
    brand: "FitLife",
    campaign: "New Year Challenge",
    amount: 3200,
    date: "2026-01-10",
    status: "paid",
  },
]

export default function CreatorDashboardPage() {
  const router = useRouter()
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState("")
  const [youtubeData, setYoutubeData] = useState<{
    channel?: {
      title?: string
      customUrl?: string
      subscriberCount?: number
      viewCount?: number
      videoCount?: number
      thumbnailUrl?: string
    }
    uploads?: Array<{
      id?: string
      videoId?: string
      title?: string
      publishedAt?: string
      thumbnailUrl?: string
    }>
  } | null>(null)
  const [analyticsBasic, setAnalyticsBasic] =
    useState<YouTubeAnalyticsBasicResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
  const [dataError, setDataError] = useState("")
  const [analyticsError, setAnalyticsError] = useState("")
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 28)
    return start.toISOString().slice(0, 10)
  })
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )

  useEffect(() => {
    const token = getCachedIdToken()
    if (!token) {
      setTokenError("No auth token found. Please log in.")
      return
    }
    setAuthToken(token)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const status = new URLSearchParams(window.location.search).get("youtube")
    if (status === "connected") {
      toast.success("YouTube connected successfully")
      router.replace("/dashboard/creator")
    }
  }, [router])

  const platformStatus = useMemo(
    () => [
      {
        name: "YouTube",
        connected: Boolean(youtubeData?.channel),
        icon: Youtube,
        handle: youtubeData?.channel?.customUrl ?? "",
        followers: youtubeData?.channel?.subscriberCount ?? 0,
      },
      {
        name: "Instagram",
        connected: false,
        icon: Instagram,
        handle: "",
        followers: 0,
      },
      {
        name: "Twitter",
        connected: false,
        icon: Twitter,
        handle: "",
        followers: 0,
      },
    ],
    [youtubeData],
  )

  const loadYouTubeData = async (token: string) => {
    setIsLoadingData(true)
    setDataError("")
    try {
      const data = await fetchYouTubeData(token)
      const mapped = {
        channel: data.channel
          ? {
              title: data.channel.snippet?.title,
              customUrl: data.channel.snippet?.customUrl,
              subscriberCount: data.channel.statistics?.subscriberCount
                ? Number(data.channel.statistics.subscriberCount)
                : undefined,
              viewCount: data.channel.statistics?.viewCount
                ? Number(data.channel.statistics.viewCount)
                : undefined,
              videoCount: data.channel.statistics?.videoCount
                ? Number(data.channel.statistics.videoCount)
                : undefined,
              thumbnailUrl:
                data.channel.snippet?.thumbnails?.high?.url ??
                data.channel.snippet?.thumbnails?.medium?.url ??
                data.channel.snippet?.thumbnails?.default?.url,
            }
          : undefined,
        uploads: data.uploads?.map((upload) => ({
          id: upload.id,
          videoId: upload.contentDetails?.videoId,
          title: upload.snippet?.title,
          publishedAt:
            upload.contentDetails?.videoPublishedAt ?? upload.snippet?.publishedAt,
          thumbnailUrl:
            upload.snippet?.thumbnails?.high?.url ??
            upload.snippet?.thumbnails?.medium?.url ??
            upload.snippet?.thumbnails?.default?.url,
        })),
      }
      setYoutubeData(mapped)
    } catch (error) {
      setDataError(getErrorMessage(error))
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadAnalytics = async (token: string) => {
    setIsLoadingAnalytics(true)
    setAnalyticsError("")
    try {
      const data = await fetchYouTubeAnalyticsBasic(token, startDate, endDate)
      setAnalyticsBasic(data)
    } catch (error) {
      setAnalyticsError(getErrorMessage(error))
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  const analyticsDerived = useMemo(() => {
    const raw = analyticsBasic
    if (!raw?.column_headers?.length || !raw.rows?.length) return null
    const names = raw.column_headers.map((h) => h?.name ?? "").filter(Boolean)
    const rowsAsObjects: AnalyticsSection = raw.rows.map((row) => {
      const obj: AnalyticsRow = {}
      names.forEach((name, i) => {
        obj[name] = row[i] ?? null
      })
      return obj
    })
    const numericKeys = names.filter(
      (n) =>
        n !== "day" &&
        ["views", "estimatedMinutesWatched", "averageViewDuration", "subscribersGained", "subscribersLost", "likes", "comments", "shares"].includes(n),
    )
    const summaryRow: AnalyticsRow = { Period: "Total" }
    numericKeys.forEach((key) => {
      const values = rowsAsObjects
        .map((r) => r[key])
        .filter((v): v is number => typeof v === "number")
      if (key === "averageViewDuration" && values.length > 0) {
        summaryRow[key] = Math.round(
          values.reduce((a, b) => a + b, 0) / values.length,
        )
      } else {
        summaryRow[key] = values.reduce((a, b) => a + b, 0)
      }
    })
    return {
      summary: [summaryRow],
      by_day: rowsAsObjects,
      daily: rowsAsObjects,
    }
  }, [analyticsBasic])

  const analytics = useMemo(
    () =>
      analyticsDerived
        ? {
            summary: analyticsDerived.summary,
            by_day: analyticsDerived.by_day,
            by_country: undefined as AnalyticsSection | undefined,
            by_traffic_source: undefined as AnalyticsSection | undefined,
            by_device: undefined as AnalyticsSection | undefined,
            by_playback_location: undefined as AnalyticsSection | undefined,
            by_subscribed_status: undefined as AnalyticsSection | undefined,
            by_gender_age: undefined as AnalyticsSection | undefined,
            by_video: undefined as AnalyticsSection | undefined,
            by_video_country: undefined as AnalyticsSection | undefined,
            by_video_playback_location: undefined as AnalyticsSection | undefined,
            audience_retention_by_video: undefined as AnalyticsSection | undefined,
          }
        : null,
    [analyticsDerived],
  )

  useEffect(() => {
    if (!authToken) return
    loadYouTubeData(authToken)
    loadAnalytics(authToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  const handleConnect = async () => {
    if (!authToken) {
      setTokenError("Please log in to connect YouTube.")
      return
    }
    try {
      const redirect = `${window.location.origin}/dashboard/creator?youtube=connected`
      const response = await getYouTubeConnectUrlWithRedirect(authToken, redirect)
      const authUrl = assertValidYouTubeAuthUrl(response.auth_url ?? "")
      window.location.href = authUrl
    } catch (error) {
      setTokenError(getErrorMessage(error))
    }
  }

  const renderTable = (rows: AnalyticsSection | undefined) => {
    if (!rows || rows.length === 0) {
      return (
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          No data available.
        </p>
      )
    }

    const columns = Object.keys(rows[0] ?? {})

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, 10).map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {row[column] !== null && row[column] !== undefined
                    ? String(row[column])
                    : "—"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const formatDate = (value?: string) => {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toISOString().slice(0, 10)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Creator Dashboard</h1>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">
                Manage your campaigns and track your earnings
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Switch to Brand View</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Platform Connection Status */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connected Platforms</h2>
          <div className="mb-4">
            <Badge variant={authToken ? "default" : "secondary"}>
              {authToken ? "Token loaded" : "No token"}
            </Badge>
            {tokenError && (
              <p className="text-sm text-[hsl(var(--destructive))] mt-2">
                {tokenError}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {platformStatus.map((platform) => (
              <Card
                key={platform.name}
                className={`${
                  platform.connected
                    ? "border-[hsl(var(--foreground))]"
                    : "border-[hsl(var(--border))]"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[hsl(var(--muted))]">
                        <platform.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {platform.name}
                        </CardTitle>
                        {platform.connected && (
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {platform.handle}
                          </p>
                        )}
                      </div>
                    </div>
                    {platform.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-[hsl(var(--foreground))]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {platform.connected ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                          Followers
                        </span>
                        <span className="font-semibold">
                          {platform.followers.toLocaleString('en-US')}
                        </span>
                      </div>
                      <Link href="/dashboard/creator/connect-youtube">
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={platform.name === "YouTube" ? handleConnect : undefined}
                      disabled={platform.name === "YouTube" ? isLoadingData : true}
                    >
                      {platform.name === "YouTube"
                        ? "Connect YouTube"
                        : `Connect ${platform.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* YouTube Channel Data */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">YouTube Channel Data</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => authToken && loadYouTubeData(authToken)}
                disabled={!authToken || isLoadingData}
              >
                {isLoadingData ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Link href="/dashboard/creator/connect-youtube">
                <Button variant="outline" size="sm">
                  Manage Connection
                </Button>
              </Link>
            </div>
          </div>
          {dataError && (
            <p className="text-sm text-[hsl(var(--destructive))] mb-4">
              {dataError}
            </p>
          )}
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Channel Info</CardTitle>
                <CardDescription>Overview of your channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Title
                  </span>
                  <span className="font-medium">
                    {youtubeData?.channel?.title ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Handle
                  </span>
                  <span className="font-medium">
                    {youtubeData?.channel?.customUrl ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Subscribers
                  </span>
                  <span className="font-medium">
                    {youtubeData?.channel?.subscriberCount ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Views
                  </span>
                  <span className="font-medium">
                    {youtubeData?.channel?.viewCount ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Videos
                  </span>
                  <span className="font-medium">
                    {youtubeData?.channel?.videoCount ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Latest Uploads</CardTitle>
                <CardDescription>Recent videos from your channel</CardDescription>
              </CardHeader>
              <CardContent>
                {youtubeData?.uploads?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Video</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {youtubeData.uploads.slice(0, 8).map((upload) => (
                        <TableRow key={upload.id ?? upload.title}>
                          <TableCell>{upload.title ?? "Untitled"}</TableCell>
                          <TableCell>
                            {formatDate(upload.publishedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            {upload.videoId ? (
                              <a
                                href={`https://www.youtube.com/watch?v=${upload.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[hsl(var(--primary))] hover:underline"
                              >
                                Open
                              </a>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No uploads data available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* YouTube Analytics */}
        <section>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">YouTube Analytics</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Analytics from {startDate} to {endDate}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="startDate" className="text-[hsl(var(--muted-foreground))]">
                  Start
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setStartDate(event.target.value)
                  }
                  className="w-[140px]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="endDate" className="text-[hsl(var(--muted-foreground))]">
                  End
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setEndDate(event.target.value)
                  }
                  className="w-[140px]"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => authToken && loadAnalytics(authToken)}
                disabled={!authToken || isLoadingAnalytics}
              >
                {isLoadingAnalytics ? "Loading..." : "Refresh Analytics"}
              </Button>
            </div>
          </div>

          {analyticsError && (
            <p className="text-sm text-[hsl(var(--destructive))] mb-4">
              {analyticsError}
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Key metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.summary ? (
                  Array.isArray(analytics.summary) ? (
                    renderTable(analytics.summary)
                  ) : (
                    renderTable([analytics.summary])
                  )
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No summary data available.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Views by Day</CardTitle>
                <CardDescription>Daily performance trend</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px]">
                {analytics?.by_day?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.by_day}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#111" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No daily data available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-1 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily breakdown</CardTitle>
                <CardDescription>
                  Day-by-day metrics (views, watch time, engagement)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsDerived?.daily?.length
                  ? renderTable(analyticsDerived.daily)
                  : (
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      No daily data available.
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>By Country</CardTitle>
                <CardDescription>Top countries</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px]">
                {analytics?.by_country?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.by_country}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#111" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No country data available.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By Traffic Source</CardTitle>
                <CardDescription>Where viewers come from</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_traffic_source)}</CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>By Device</CardTitle>
                <CardDescription>Device breakdown</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_device)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By Playback Location</CardTitle>
                <CardDescription>Playback sources</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_playback_location)}</CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>By Subscribed Status</CardTitle>
                <CardDescription>Subscriber breakdown</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_subscribed_status)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By Gender & Age</CardTitle>
                <CardDescription>Audience demographics</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_gender_age)}</CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>By Video</CardTitle>
                <CardDescription>Top video analytics</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_video)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By Video Country</CardTitle>
                <CardDescription>Video view locations</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(analytics?.by_video_country)}</CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>By Video Playback Location</CardTitle>
                <CardDescription>Playback by video</CardDescription>
              </CardHeader>
              <CardContent>
                {renderTable(analytics?.by_video_playback_location)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audience Retention by Video</CardTitle>
                <CardDescription>Retention highlights</CardDescription>
              </CardHeader>
              <CardContent>
                {renderTable(analytics?.audience_retention_by_video)}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Creator Stats */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Subscribers
                  </CardTitle>
                  <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(creatorStats.subscribers / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+2.4K</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Avg Views
                  </CardTitle>
                  <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(creatorStats.avgViews / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {creatorStats.engagementRate}%
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+0.3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${creatorStats.totalEarnings.toLocaleString('en-US')}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>
                      Your ongoing brand partnerships
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{activeCampaigns.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="bg-[hsl(var(--muted))]">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">
                                {campaign.title}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  {campaign.brand.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{campaign.brand}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              campaign.status === "in-progress"
                                ? "default"
                                : "outline"
                            }
                          >
                            {campaign.status === "in-progress"
                              ? "In Progress"
                              : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Payment
                            </p>
                            <p className="font-semibold">
                              ${campaign.payment.toLocaleString('en-US')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Deadline
                            </p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <p className="font-semibold">
                                {formatDate(campaign.deadline)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            Deliverables: {campaign.deliverables}
                          </p>
                        </div>

                        {campaign.status === "in-progress" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[hsl(var(--muted-foreground))]">
                                Progress
                              </span>
                              <span className="font-medium">
                                {campaign.progress}%
                              </span>
                            </div>
                            <Progress value={campaign.progress} />
                          </div>
                        )}

                        <Button className="w-full" size="sm">
                          View Details
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Your payment overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted))]">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Pending
                      </p>
                      <p className="text-2xl font-bold">
                        ${creatorStats.pendingEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-black text-white">
                    <div>
                      <p className="text-sm opacity-80">This Month</p>
                      <p className="text-2xl font-bold">
                        ${creatorStats.totalEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 opacity-80" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--border))]">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Lifetime Total
                      </p>
                      <p className="text-xl font-bold">
                        ${creatorStats.lifetimeEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                <Button className="w-full">Withdraw Earnings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEarnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-start justify-between pb-3 border-b border-[hsl(var(--border))] last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{earning.brand}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {formatDate(earning.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${earning.amount.toLocaleString('en-US')}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
