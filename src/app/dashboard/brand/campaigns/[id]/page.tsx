"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Instagram, Loader2, RefreshCcw, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  fetchBrandCampaignCreators,
  fetchBrandCampaigns,
  getErrorMessage,
  respondToCampaignCreators,
  uploadBrandCampaignBrief,
  fetchBrandCreatorBids,
  finalizeCreatorAmounts,
  fetchBrandCreatorScripts,
  reviewCreatorScript,
  fetchBrandCreatorContent,
  reviewCreatorContent,
} from "@/lib/api"
import { getBrandAuthToken } from "@/lib/auth"
import { toast } from "sonner"
import { AIReviewDialog } from "@/components/AIReviewDialog"

type CampaignDetail = {
  id: string
  name: string
  description?: string
  creatorCategories?: string[]
  totalBudget?: number
  creatorCount?: number
  goLiveDate?: string
  status?: string
  reviewStatus?: string
  negotiationRounds?: number
  briefCompleted?: boolean
  sampleVideoUrl?: string
  sampleVideoToken?: string
  creatorSheetToken?: string
  primaryFocus?: string
  secondaryFocus?: string
  dos?: string
  donts?: string
  cta?: string
  creatorSheetUrl?: string
}

type CreatorRow = {
  id: string
  name: string
  instagram?: string
  followers?: number
  avgViews?: number
  commercial?: string
  status?: string
  comment?: string
}

type CreatorStatus = "pending" | "accepted" | "rejected"

const normalizeCreators = (payload: Record<string, unknown>) => {
  const list =
    (payload.creators as Array<Record<string, unknown>> | undefined) ||
    (payload.data as Array<Record<string, unknown>> | undefined) ||
    (payload.items as Array<Record<string, unknown>> | undefined) ||
    []
  return list.map((creator) => ({
    id:
      (creator.creator_id as string) ||
      (creator.id as string) ||
      (creator._id as string) ||
      "",
    name:
      (creator.name as string) ||
      (creator.full_name as string) ||
      (creator.display_name as string) ||
      "Creator",
    instagram:
      (creator.instagram as string) ||
      (creator.instagram_id as string) ||
      (creator.handle as string) ||
      undefined,
    followers:
      typeof creator.followers === "number"
        ? (creator.followers as number)
        : typeof creator.follower_count === "number"
        ? (creator.follower_count as number)
        : undefined,
    avgViews:
      typeof creator.avg_views === "number"
        ? (creator.avg_views as number)
        : typeof creator.avgViews === "number"
        ? (creator.avgViews as number)
        : undefined,
    commercial:
      (creator.commercial as string) ||
      (creator.rate as string) ||
      undefined,
    status:
      (creator.status as string) ||
      (creator.creator_status as string) ||
      undefined,
    comment:
      (creator.comment as string) ||
      (creator.creator_comment as string) ||
      undefined,
  }))
}

const normalizeDownloadToken = (value?: string) => {
  if (!value) return undefined
  const token = value.split(",")[0]?.trim()
  return token || undefined
}

const buildFirebaseDownloadUrl = (rawUrl?: string, token?: string) => {
  if (!rawUrl) return undefined
  if (rawUrl.includes("token=")) return rawUrl

  const appendToken = (url: string) =>
    token
      ? `${url}${url.includes("?") ? "&" : "?"}alt=media&token=${token}`
      : url

  if (rawUrl.startsWith("gs://")) {
    const withoutScheme = rawUrl.replace("gs://", "")
    const [bucket, ...rest] = withoutScheme.split("/")
    const path = rest.join("/")
    if (!bucket || !path) return rawUrl
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      path,
    )}`
    return appendToken(url)
  }

  if (rawUrl.includes("storage.googleapis.com/")) {
    const [bucket, ...rest] = rawUrl.split("storage.googleapis.com/")[1].split("/")
    const path = rest.join("/")
    if (!bucket || !path) return rawUrl
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      path,
    )}`
    return appendToken(url)
  }

  return appendToken(rawUrl)
}

export default function BrandCampaignDetailPage() {
  const params = useParams()
  const campaignId = typeof params?.id === "string" ? params.id : ""
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [creators, setCreators] = useState<CreatorRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [avgViewsBounds, setAvgViewsBounds] = useState<[number, number]>([0, 0])
  const [commercialBounds, setCommercialBounds] = useState<[number, number]>([0, 0])
  const [avgViewsRange, setAvgViewsRange] = useState<[number, number]>([0, 0])
  const [commercialRange, setCommercialRange] = useState<[number, number]>([0, 0])
  const [rangeReady, setRangeReady] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, { status: string; comment: string }>>({})
  const [submittingReview, setSubmittingReview] = useState(false)
  const [videoTitle, setVideoTitle] = useState("")
  const [primaryFocus, setPrimaryFocus] = useState("")
  const [secondaryFocus, setSecondaryFocus] = useState("")
  const [bids, setBids] = useState<Array<{
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
  }>>([])
  const [loadingBids, setLoadingBids] = useState(false)
  const [finalizingAmounts, setFinalizingAmounts] = useState(false)
  const [bidActions, setBidActions] = useState<Record<string, { proposedAmount?: string }>>({})
  const [creatorScripts, setCreatorScripts] = useState<Array<{
    creator_id: string
    name: string
    email: string
    instagram: string
    script_content: string
    script_submitted_at: string
    status: string
    script_feedback?: string
  }>>([])
  const [loadingScripts, setLoadingScripts] = useState(false)
  const [reviewingScript, setReviewingScript] = useState(false)
  const [scriptActions, setScriptActions] = useState<Record<string, { action: "approve" | "reject" | "request_revision"; feedback?: string }>>({})
  const [scriptDialogOpen, setScriptDialogOpen] = useState(false)
  const [selectedScript, setSelectedScript] = useState<{ name: string; script_content: string; script_submitted_at: string } | null>(null)
  const [aiReviewOpen, setAiReviewOpen] = useState(false)
  const [aiReviewScriptIndex, setAiReviewScriptIndex] = useState(0)
  const [creatorContent, setCreatorContent] = useState<Array<{
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
  }>>([])
  const [loadingContent, setLoadingContent] = useState(false)
  const [reviewingContent, setReviewingContent] = useState(false)
  const [contentActions, setContentActions] = useState<Record<string, { action: "approve" | "reject" | "request_revision"; feedback?: string }>>({})
  const [dos, setDos] = useState("")
  const [donts, setDonts] = useState("")
  const [cta, setCta] = useState("")
  const [sampleVideo, setSampleVideo] = useState<File | null>(null)
  const [sampleVideoUrl, setSampleVideoUrl] = useState("")
  const [uploadingBrief, setUploadingBrief] = useState(false)

  const normalizeCampaign = (campaign: Record<string, unknown>): CampaignDetail => {
    const metadata = campaign.sample_video_metadata as
      | { downloadTokens?: string }
      | undefined
    const sampleVideoToken = normalizeDownloadToken(
      (campaign.sample_video_token as string) ||
        (campaign.sampleVideoToken as string) ||
        (campaign.download_token as string) ||
        (campaign.downloadTokens as string) ||
        (metadata?.downloadTokens as string) ||
        undefined,
    )
    const rawSampleVideoUrl =
      (campaign.sample_video_url as string) ||
      (campaign.sampleVideoUrl as string) ||
      undefined
    const sheetMetadata = campaign.creator_sheet_metadata as
      | { downloadTokens?: string }
      | undefined
    const creatorSheetToken = normalizeDownloadToken(
      (campaign.creator_sheet_token as string) ||
        (campaign.creatorSheetToken as string) ||
        (campaign.creator_sheet_download_token as string) ||
        (campaign.creatorSheetDownloadToken as string) ||
        (sheetMetadata?.downloadTokens as string) ||
        undefined,
    )
    const rawCreatorSheetUrl =
      (campaign.creator_sheet_url as string) ||
      (campaign.creatorSheetUrl as string) ||
      undefined

    return {
      id:
        (campaign.id as string) ||
        (campaign._id as string) ||
        (campaign.campaign_id as string) ||
        "",
      name:
        (campaign.name as string) ||
        (campaign.title as string) ||
        "Untitled Campaign",
      description: (campaign.description as string) || undefined,
      creatorCategories:
        (campaign.creator_categories as string[]) ||
        (campaign.creatorCategories as string[]) ||
        undefined,
      totalBudget:
        typeof campaign.total_budget === "number"
          ? (campaign.total_budget as number)
          : typeof campaign.totalBudget === "number"
          ? (campaign.totalBudget as number)
          : undefined,
      creatorCount:
        typeof campaign.creator_count === "number"
          ? (campaign.creator_count as number)
          : typeof campaign.creatorCount === "number"
          ? (campaign.creatorCount as number)
          : undefined,
      goLiveDate:
        (campaign.go_live_date as string) ||
        (campaign.goLiveDate as string) ||
        undefined,
      status:
        (campaign.status as string) ||
        (campaign.campaign_status as string) ||
        undefined,
      reviewStatus:
        (campaign.review_status as string) ||
        (campaign.reviewStatus as string) ||
        undefined,
      negotiationRounds:
        typeof campaign.negotiation_rounds === "number"
          ? (campaign.negotiation_rounds as number)
          : typeof campaign.negotiationRounds === "number"
          ? (campaign.negotiationRounds as number)
          : 0,
      briefCompleted:
        typeof campaign.brief_completed === "boolean"
          ? (campaign.brief_completed as boolean)
          : typeof campaign.briefCompleted === "boolean"
          ? (campaign.briefCompleted as boolean)
          : undefined,
      sampleVideoToken,
      creatorSheetToken,
      sampleVideoUrl: buildFirebaseDownloadUrl(rawSampleVideoUrl, sampleVideoToken),
      primaryFocus:
        (campaign.primary_focus as string) ||
        (campaign.primaryFocus as string) ||
        undefined,
      secondaryFocus:
        (campaign.secondary_focus as string) ||
        (campaign.secondaryFocus as string) ||
        undefined,
      dos: (campaign.dos as string) || undefined,
      donts: (campaign.donts as string) || undefined,
      cta: (campaign.cta as string) || undefined,
      creatorSheetUrl: buildFirebaseDownloadUrl(rawCreatorSheetUrl, creatorSheetToken),
    }
  }

  const loadCampaign = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    const response = await fetchBrandCampaigns(token)
    const list = Array.isArray(response?.campaigns)
      ? response.campaigns
      : Array.isArray(response)
      ? response
      : []
    const found = list.find((item) => {
      const id = (item.id as string) || (item._id as string) || (item.campaign_id as string)
      return id === campaignId
    })
    setCampaign(found ? normalizeCampaign(found) : null)
  }

  const loadCreators = async () => {
    setIsLoading(true)
    setError("")
    try {
      const token = getBrandAuthToken()
      if (!token || !campaignId) return
      await loadCampaign()
      const response = await fetchBrandCampaignCreators(token, campaignId)
      setCreators(normalizeCreators(response))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      (creator.instagram ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || (creator.status ?? "pending") === statusFilter
    const avgViewsValue =
      typeof creator.avgViews === "number" ? creator.avgViews : Number(creator.avgViews)
    const commercialValue =
      typeof creator.commercial === "number" ? creator.commercial : Number(creator.commercial)

    const matchesAvgViews =
      avgViewsRange[0] === avgViewsRange[1] ||
      (avgViewsValue >= avgViewsRange[0] && avgViewsValue <= avgViewsRange[1])
    const matchesCommercial =
      commercialRange[0] === commercialRange[1] ||
      (commercialValue >= commercialRange[0] && commercialValue <= commercialRange[1])

    return matchesSearch && matchesStatus && matchesAvgViews && matchesCommercial
  })

  const loadBids = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    setLoadingBids(true)
    try {
      const response = await fetchBrandCreatorBids(token, campaignId)
      setBids(response.creators || [])
    } catch (err) {
      // Silently fail - bids might not be available yet
    } finally {
      setLoadingBids(false)
    }
  }

  const loadScripts = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    setLoadingScripts(true)
    try {
      const response = await fetchBrandCreatorScripts(token, campaignId)
      setCreatorScripts(response.creators || [])
    } catch (err) {
      // Silently fail
    } finally {
      setLoadingScripts(false)
    }
  }

  const loadContent = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    setLoadingContent(true)
    try {
      const response = await fetchBrandCreatorContent(token, campaignId)
      setCreatorContent(response.creators || [])
    } catch (err) {
      // Silently fail - content might not be available yet
    } finally {
      setLoadingContent(false)
    }
  }

  useEffect(() => {
    loadCreators()
    if (campaign?.reviewStatus === "creators_are_final") {
      loadBids()
    }
    if (campaign?.briefCompleted) {
      loadScripts()
      loadContent()
    }
  }, [campaignId, campaign?.reviewStatus, campaign?.briefCompleted])

  const handleSubmitReview = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    if (!canEdit) {
      toast.error("Creator review is locked for this campaign.")
      return
    }

    const allowedStatuses: CreatorStatus[] = [
      "pending",
      "accepted",
      "rejected",
      // "negotiated",
    ]

    const updates = creators
      .map((creator) => {
        const draft = drafts[creator.id]
        if (!draft) return null
        const status = draft.status as CreatorStatus
        if (!allowedStatuses.includes(status)) return null
        return {
          creator_id: creator.id,
          status,
          comment: draft.comment,
        }
      })
      .filter(Boolean) as Array<{
      creator_id: string
      status: CreatorStatus
      comment: string
    }>

    if (updates.length === 0) {
      toast.error("No updates to submit.")
      return
    }

    setSubmittingReview(true)
    setError("")
    try {
      await respondToCampaignCreators(token, {
        campaign_id: campaignId,
        updates,
      })

      await loadCampaign()
      await loadCreators()
      toast.success("Creators are in review. Admin will finalize the list shortly.")
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleUploadBrief = async () => {
    const token = getBrandAuthToken()
    if (!token || !campaignId) return
    if (campaign?.reviewStatus !== "creators_are_final") {
      toast.error("Creators must be finalized before uploading the brief.")
      return
    }
    setUploadingBrief(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("campaign_id", campaignId)
      formData.append("video_title", videoTitle)
      formData.append("primary_focus", primaryFocus)
      formData.append("secondary_focus", secondaryFocus)
      formData.append("dos", dos)
      formData.append("donts", donts)
      formData.append("cta", cta)
      if (sampleVideoUrl.trim()) {
        formData.append("sample_video_url", sampleVideoUrl.trim())
      }
      if (sampleVideo) {
        formData.append("sample_video", sampleVideo)
      }
      await uploadBrandCampaignBrief(token, formData)
      await loadCampaign()
      toast.success("Brief uploaded successfully.")
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setUploadingBrief(false)
    }
  }

  const statusLabel = useMemo(
    () => (value?: string) => value?.replace(/_/g, " ") ?? "pending",
    [],
  )

  useEffect(() => {
    if (creators.length === 0) {
      setDrafts({})
      return
    }
    const nextDrafts: Record<string, { status: string; comment: string }> = {}
    creators.forEach((creator) => {
      nextDrafts[creator.id] = {
        status: creator.status ?? "pending",
        comment: creator.comment ?? "",
      }
    })
    setDrafts(nextDrafts)
  }, [creators])

  useEffect(() => {
    if (!creators.length || rangeReady) return
    const avgViewsValues = creators
      .map((creator) =>
        typeof creator.avgViews === "number" ? creator.avgViews : Number(creator.avgViews),
      )
      .filter((value) => Number.isFinite(value))
    const commercialValues = creators
      .map((creator) =>
        typeof creator.commercial === "number" ? creator.commercial : Number(creator.commercial),
      )
      .filter((value) => Number.isFinite(value))

    const avgMin = avgViewsValues.length ? Math.min(...avgViewsValues) : 0
    const avgMax = avgViewsValues.length ? Math.max(...avgViewsValues) : 0
    const commMin = commercialValues.length ? Math.min(...commercialValues) : 0
    const commMax = commercialValues.length ? Math.max(...commercialValues) : 0

    setAvgViewsBounds([avgMin, avgMax])
    setCommercialBounds([commMin, commMax])
    setAvgViewsRange([avgMin, avgMax])
    setCommercialRange([commMin, commMax])
    setRangeReady(true)
  }, [creators, rangeReady])

  const canEdit = campaign?.reviewStatus === "creators_pending"

  const extractInstagramHandle = (value?: string) => {
    if (!value) return null
    if (value.startsWith("http://") || value.startsWith("https://")) {
      try {
        const parsed = new URL(value)
        const path = parsed.pathname.replace(/^\/+/, "").split("/")[0]
        return path ? path.replace(/^@/, "") : null
      } catch {
        return value.replace(/^@/, "")
      }
    }
    return value.replace(/^@/, "")
  }

  const buildInstagramUrl = (value?: string) => {
    const handle = extractInstagramHandle(value)
    if (!handle) return undefined
    return `https://www.instagram.com/${handle}`
  }

  const statusBadgeClass = (status?: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "negotiated":
        return "bg-amber-100 text-amber-700"
      case "script_pending":
        return "bg-blue-100 text-blue-700"
      case "script_approved":
        return "bg-emerald-100 text-emerald-700"
      case "script_rejected":
        return "bg-red-100 text-red-700"
      case "script_revision_requested":
        return "bg-amber-100 text-amber-700"
      case "content_pending":
        return "bg-blue-100 text-blue-700"
      case "content_approved":
        return "bg-emerald-100 text-emerald-700"
      case "content_rejected":
        return "bg-red-100 text-red-700"
      case "content_revision_requested":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-zinc-100 text-zinc-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {campaign?.name ?? "Campaign Creators"}
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Campaign ID: {campaignId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCreators} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/dashboard/brand/campaigns">
            <Button variant="outline">Back to Campaigns</Button>
          </Link>
        </div>
      </div>

      {campaign && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-[hsl(var(--muted-foreground))]">
            {campaign.status === "searching_creators" && !campaign.reviewStatus && (
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm text-[hsl(var(--foreground))]">
                We are finding the best creators for you within 12–14 hours. Please
                give us some time.
              </div>
            )}
            {campaign.reviewStatus === "creators_pending" && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                Creators are ready for review. Update their status and add comments below.
              </div>
            )}
            {campaign.reviewStatus === "creators_in_review" && (
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm text-[hsl(var(--foreground))]">
                Creators are in review. Admin will finalize the list shortly.
              </div>
            )}
            {campaign.reviewStatus === "creators_are_final" && (
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm text-[hsl(var(--foreground))]">
                Creators are finalized for this campaign.
              </div>
            )}
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Description:</span>{" "}
              {campaign.description ?? "—"}
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Categories:</span>{" "}
              {campaign.creatorCategories?.join(", ") ?? "—"}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="font-medium text-[hsl(var(--foreground))]">Budget:</span>{" "}
                {campaign.totalBudget !== undefined ? `₹${campaign.totalBudget}` : "—"}
              </div>
              <div>
                <span className="font-medium text-[hsl(var(--foreground))]">Creators:</span>{" "}
                {campaign.creatorCount ?? "—"}
              </div>
              <div>
                <span className="font-medium text-[hsl(var(--foreground))]">Go live:</span>{" "}
                {campaign.goLiveDate ?? "—"}
              </div>
              <div>
                <span className="font-medium text-[hsl(var(--foreground))]">Status:</span>{" "}
                {campaign.status ?? "—"}
              </div>
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Primary focus:</span>{" "}
              {campaign.primaryFocus ?? "—"}
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Secondary focus:</span>{" "}
              {campaign.secondaryFocus ?? "—"}
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Do&apos;s:</span>{" "}
              {campaign.dos ?? "—"}
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">Don&apos;ts:</span>{" "}
              {campaign.donts ?? "—"}
            </div>
            <div>
              <span className="font-medium text-[hsl(var(--foreground))]">CTA:</span>{" "}
              {campaign.cta ?? "—"}
            </div>
            {campaign.sampleVideoUrl && (
              <a
                className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
                href={campaign.sampleVideoUrl}
                target="_blank"
                rel="noreferrer"
              >
                View sample video
              </a>
            )}
            {!canEdit && campaign.reviewStatus === "creators_are_final" && (
              <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                Creator review is finalized by admin.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {campaign && !campaign.briefCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.reviewStatus !== "creators_are_final" ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Creators must be finalized before you can upload the brief.
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Input
                    placeholder="Video title"
                    value={videoTitle}
                    onChange={(event) => setVideoTitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    placeholder="Primary focus"
                    value={primaryFocus}
                    onChange={(event) => setPrimaryFocus(event.target.value)}
                  />
                  <Input
                    placeholder="Secondary focus"
                    value={secondaryFocus}
                    onChange={(event) => setSecondaryFocus(event.target.value)}
                  />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <Textarea
                    placeholder="Do's"
                    value={dos}
                    onChange={(event) => setDos(event.target.value)}
                  />
                  <Textarea
                    placeholder="Don'ts"
                    value={donts}
                    onChange={(event) => setDonts(event.target.value)}
                  />
                </div>
                <Input
                  placeholder="CTA"
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setSampleVideo(event.target.files?.[0] ?? null)}
                />
                <Input
                  placeholder="Or paste a sample video URL"
                  value={sampleVideoUrl}
                  onChange={(event) => setSampleVideoUrl(event.target.value)}
                />
                <Button onClick={handleUploadBrief} disabled={uploadingBrief}>
                  {uploadingBrief ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Submit Brief"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Creators</CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Update creator status and comments for admin review.
              </p>
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={!canEdit || submittingReview}
              className="gap-2"
            >
              {submittingReview ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit review"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Search creators..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="negotiated">Negotiated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setStatusFilter("all")
                setAvgViewsRange(avgViewsBounds)
                setCommercialRange(commercialBounds)
              }}
            >
              Clear filters
            </Button>
          </div>
          <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <div className="flex items-center justify-between text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  <span>Average views</span>
                  <span>
                    {avgViewsRange[0]} - {avgViewsRange[1]}
                  </span>
                </div>
                <div className="mt-3">
                  <Slider
                    min={avgViewsBounds[0]}
                    max={avgViewsBounds[1]}
                    value={avgViewsRange}
                    onValueChange={(value) =>
                      setAvgViewsRange([value[0] ?? 0, value[1] ?? value[0] ?? 0])
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <div className="flex items-center justify-between text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  <span>Amount</span>
                  <span>
                    {commercialRange[0]} - {commercialRange[1]}
                  </span>
                </div>
                <div className="mt-3">
                  <Slider
                    min={commercialBounds[0]}
                    max={commercialBounds[1]}
                    value={commercialRange}
                    onValueChange={(value) =>
                      setCommercialRange([value[0] ?? 0, value[1] ?? value[0] ?? 0])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {error && (
            <p className="mb-3 text-sm text-[hsl(var(--destructive))]">{error}</p>
          )}
          {isLoading ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading creators…</p>
          ) : filteredCreators.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">SN</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Avg views</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((creator, index) => {
                  const draft = drafts[creator.id] ?? {
                    status: creator.status ?? "pending",
                    comment: creator.comment ?? "",
                  }
                  return (
                    <TableRow key={creator.id}>
                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        {index + 1}
                      </TableCell>
                    <TableCell className="font-medium">{creator.name}</TableCell>
                    <TableCell>
                      {creator.instagram ? (
                        <a
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white shadow-sm transition-transform hover:scale-105"
                          href={buildInstagramUrl(creator.instagram)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Open @${extractInstagramHandle(creator.instagram) ?? "instagram"}`}
                          aria-label="Open Instagram profile"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{creator.avgViews ?? "—"}</TableCell>
                    <TableCell>{creator.commercial ?? "—"}</TableCell>
                    <TableCell>
                      {canEdit ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={draft.status}
                            onValueChange={(value) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [creator.id]: {
                                  status: value,
                                  comment: prev[creator.id]?.comment ?? "",
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass(
                              draft.status,
                            )}`}
                          >
                            {statusLabel(draft.status)}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass(
                            creator.status,
                          )}`}
                        >
                          {statusLabel(creator.status)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[240px]">
                      <Input
                        value={draft.comment}
                        placeholder="Add a comment"
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [creator.id]: {
                              status: prev[creator.id]?.status ?? "pending",
                              comment: event.target.value,
                            },
                          }))
                        }
                        disabled={!canEdit}
                      />
                    </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No creators assigned to this campaign yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bids Section */}
      {campaign?.reviewStatus === "creators_are_final" && (
        <Card>
          <CardHeader>
            <CardTitle>Creator Bids</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              When you accept a creator, your bid (CPV × avg views) is sent. Creators can accept, reject, or negotiate once.
            </p>
          </CardHeader>
          <CardContent>
            {loadingBids ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : bids.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No bids yet. Accept creators above to send your offer.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Brand Bid</TableHead>
                    <TableHead>Creator Counter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map((bid) => {
                    const action = bidActions[bid.creator_id]
                    const awaitingBrandResponse = bid.status === "amount_negotiated"
                    return (
                      <TableRow key={bid.creator_id}>
                        <TableCell>{bid.name}</TableCell>
                        <TableCell>{bid.email}</TableCell>
                        <TableCell>
                          {bid.proposed_amount ? `₹${bid.proposed_amount.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell>
                          {bid.bid_amount ? `₹${bid.bid_amount.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusBadgeClass(bid.status)}>
                            {bid.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {awaitingBrandResponse ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const token = getBrandAuthToken()
                                  if (!token || !campaignId) return
                                  setFinalizingAmounts(true)
                                  try {
                                    await finalizeCreatorAmounts(token, campaignId, [
                                      { creator_id: bid.creator_id, action: "accept_counter" },
                                    ])
                                    toast.success("Counter accepted")
                                    loadBids()
                                  } catch (err) {
                                    toast.error(getErrorMessage(err))
                                  } finally {
                                    setFinalizingAmounts(false)
                                  }
                                }}
                                disabled={finalizingAmounts}
                              >
                                Accept Counter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  const token = getBrandAuthToken()
                                  if (!token || !campaignId) return
                                  setFinalizingAmounts(true)
                                  try {
                                    await finalizeCreatorAmounts(token, campaignId, [
                                      { creator_id: bid.creator_id, action: "reject_counter" },
                                    ])
                                    toast.success("Counter rejected")
                                    loadBids()
                                  } catch (err) {
                                    toast.error(getErrorMessage(err))
                                  } finally {
                                    setFinalizingAmounts(false)
                                  }
                                }}
                                disabled={finalizingAmounts}
                              >
                                Reject Counter
                              </Button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Script Review Section - Step 1: Review scripts before video */}
      {campaign?.briefCompleted && (
        <>
        {/* Simple script view dialog */}
        <Dialog open={scriptDialogOpen} onOpenChange={setScriptDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Script by {selectedScript?.name ?? "Creator"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 -mx-6 px-6">
              {selectedScript && (
                <>
                  <p className="text-xs text-muted-foreground mb-2">
                    Submitted {new Date(selectedScript.script_submitted_at).toLocaleDateString()}
                  </p>
                  <pre className="whitespace-pre-wrap text-sm font-sans rounded-lg border bg-muted/30 p-4">
                    {selectedScript.script_content}
                  </pre>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Review Dialog */}
        {creatorScripts[aiReviewScriptIndex] && (
          <AIReviewDialog
            open={aiReviewOpen}
            onOpenChange={setAiReviewOpen}
            type="script"
            content={{
              creator_name: creatorScripts[aiReviewScriptIndex].name,
              status: creatorScripts[aiReviewScriptIndex].status,
              updated_at: creatorScripts[aiReviewScriptIndex].script_submitted_at,
              cost: 0, // TODO: get from campaign or creator
              script_content: creatorScripts[aiReviewScriptIndex].script_content,
            }}
            aiChecks={[
              { id: "1", label: "Brand safety checks", passed: true },
              { id: "2", label: "On-screen CTA visuals", passed: true },
              { id: "3", label: "Product description accuracy", passed: true },
              { id: "4", label: "Face on screen", passed: true },
              { id: "5", label: "People-first language", passed: true },
              { id: "6", label: "Authentic video environment", passed: true },
              { id: "7", label: "No negative phrasing", passed: true },
              { id: "8", label: "No mention of competitors", passed: true },
            ]}
            agentRecommendation={{
              approved: true,
              message: "This draft passes all your safety checks",
            }}
            onApprove={async () => {
              const token = getBrandAuthToken()
              if (!token || !campaignId) return
              const currentScript = creatorScripts[aiReviewScriptIndex]
              try {
                await reviewCreatorScript(token, campaignId, [
                  { creator_id: currentScript.creator_id, action: "approve" },
                ])
                toast.success("Script approved!")
                setAiReviewOpen(false)
                loadScripts()
                loadContent()
              } catch (err) {
                toast.error(getErrorMessage(err))
              }
            }}
            onReject={async (feedback) => {
              const token = getBrandAuthToken()
              if (!token || !campaignId) return
              const currentScript = creatorScripts[aiReviewScriptIndex]
              try {
                await reviewCreatorScript(token, campaignId, [
                  {
                    creator_id: currentScript.creator_id,
                    action: "reject",
                    feedback,
                  },
                ])
                toast.success("Script rejected")
                setAiReviewOpen(false)
                loadScripts()
              } catch (err) {
                toast.error(getErrorMessage(err))
              }
            }}
            onRequestRevision={async (feedback) => {
              const token = getBrandAuthToken()
              if (!token || !campaignId) return
              const currentScript = creatorScripts[aiReviewScriptIndex]
              try {
                await reviewCreatorScript(token, campaignId, [
                  {
                    creator_id: currentScript.creator_id,
                    action: "request_revision",
                    feedback,
                  },
                ])
                toast.success("Revision requested")
                setAiReviewOpen(false)
                loadScripts()
              } catch (err) {
                toast.error(getErrorMessage(err))
              }
            }}
            onNavigatePrev={() => {
              if (aiReviewScriptIndex > 0) {
                setAiReviewScriptIndex(aiReviewScriptIndex - 1)
              }
            }}
            onNavigateNext={() => {
              if (aiReviewScriptIndex < creatorScripts.length - 1) {
                setAiReviewScriptIndex(aiReviewScriptIndex + 1)
              }
            }}
            hasPrev={aiReviewScriptIndex > 0}
            hasNext={aiReviewScriptIndex < creatorScripts.length - 1}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Script Review</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Review creator video scripts. Approve to let them film, request changes, or reject.
            </p>
          </CardHeader>
          <CardContent>
            {loadingScripts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : creatorScripts.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No script submissions yet. Creators will submit scripts for your approval before filming.
              </p>
            ) : (
              <>
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Creator</TableHead>
                      <TableHead className="w-[120px]">Script</TableHead>
                      <TableHead className="w-[110px] whitespace-nowrap">Submitted</TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[240px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creatorScripts.map((script) => {
                      const action = scriptActions[script.creator_id]
                      return (
                        <TableRow key={script.creator_id}>
                          <TableCell className="align-top font-medium">{script.name}</TableCell>
                          <TableCell className="align-top">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => {
                                setSelectedScript({
                                  name: script.name,
                                  script_content: script.script_content,
                                  script_submitted_at: script.script_submitted_at,
                                })
                                setScriptDialogOpen(true)
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              View script
                            </Button>
                          </TableCell>
                          <TableCell className="align-top whitespace-nowrap text-muted-foreground">
                            {script.script_submitted_at
                              ? new Date(script.script_submitted_at).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge className={statusBadgeClass(script.status)}>
                              {script.status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="align-top">
                            {script.status === "script_pending" ? (
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-2 w-full"
                                  onClick={() => {
                                    const scriptIndex = creatorScripts.findIndex(
                                      (s) => s.creator_id === script.creator_id
                                    )
                                    setAiReviewScriptIndex(scriptIndex)
                                    setAiReviewOpen(true)
                                  }}
                                >
                                  <Sparkles className="h-4 w-4" />
                                  AI Review
                                </Button>
                                <Select
                                  value={action?.action || ""}
                                  onValueChange={(value) =>
                                    setScriptActions((prev) => ({
                                      ...prev,
                                      [script.creator_id]: {
                                        ...prev[script.creator_id],
                                        action: value as "approve" | "reject" | "request_revision",
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Manual select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approve">Approve</SelectItem>
                                    <SelectItem value="reject">Reject</SelectItem>
                                    <SelectItem value="request_revision">Request Changes</SelectItem>
                                  </SelectContent>
                                </Select>
                                {(action?.action === "reject" || action?.action === "request_revision") && (
                                  <Input
                                    placeholder="Feedback"
                                    className="w-full"
                                    value={action.feedback || ""}
                                    onChange={(e) =>
                                      setScriptActions((prev) => ({
                                        ...prev,
                                        [script.creator_id]: {
                                          ...prev[script.creator_id],
                                          feedback: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                )}
                              </div>
                            ) : (
                              script.script_feedback && (
                                <span className="text-sm text-muted-foreground max-w-xs truncate block" title={script.script_feedback}>
                                  {script.script_feedback}
                                </span>
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <Button
                  onClick={async () => {
                    const token = getBrandAuthToken()
                    if (!token || !campaignId) return
                    const updates = Object.entries(scriptActions)
                      .map(([creatorId, action]) => ({
                        creator_id: creatorId,
                        action: action.action,
                        feedback: action.feedback,
                      }))
                      .filter((u) => u.action)
                    if (updates.length === 0) {
                      toast.error("Please select actions for at least one creator")
                      return
                    }
                    setReviewingScript(true)
                    try {
                      await reviewCreatorScript(token, campaignId, updates)
                      toast.success("Script review submitted")
                      setScriptActions({})
                      loadScripts()
                      loadContent()
                    } catch (err) {
                      toast.error(getErrorMessage(err))
                    } finally {
                      setReviewingScript(false)
                    }
                  }}
                  disabled={reviewingScript || Object.keys(scriptActions).length === 0}
                  className="mt-4"
                >
                  {reviewingScript ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    "Submit Script Review"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        </>
      )}

      {/* Content Review Section - Step 2: Review videos after script approved */}
      {campaign?.briefCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Content Review</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Review creator content submissions
            </p>
          </CardHeader>
          <CardContent>
            {loadingContent ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : creatorContent.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No content submissions yet.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creatorContent.map((content) => {
                      const action = contentActions[content.creator_id]
                      return (
                        <TableRow key={content.creator_id}>
                          <TableCell>{content.name}</TableCell>
                          <TableCell>
                            <a
                              href={content.content_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Content
                            </a>
                          </TableCell>
                          <TableCell>
                            {new Date(content.content_submitted_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusBadgeClass(content.status)}>
                              {content.status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {content.status === "content_pending" ? (
                              <div className="flex gap-2">
                                <Select
                                  value={action?.action || ""}
                                  onValueChange={(value) =>
                                    setContentActions((prev) => ({
                                      ...prev,
                                      [content.creator_id]: {
                                        ...prev[content.creator_id],
                                        action: value as "approve" | "reject" | "request_revision",
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approve">Approve</SelectItem>
                                    <SelectItem value="reject">Reject</SelectItem>
                                    <SelectItem value="request_revision">Request Revision</SelectItem>
                                  </SelectContent>
                                </Select>
                                {(action?.action === "reject" || action?.action === "request_revision") && (
                                  <Input
                                    placeholder="Feedback"
                                    className="w-48"
                                    value={action.feedback || ""}
                                    onChange={(e) =>
                                      setContentActions((prev) => ({
                                        ...prev,
                                        [content.creator_id]: {
                                          ...prev[content.creator_id],
                                          feedback: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                )}
                              </div>
                            ) : (
                              content.content_feedback && (
                                <span className="text-sm text-muted-foreground">
                                  {content.content_feedback}
                                </span>
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <Button
                  onClick={async () => {
                    const token = getBrandAuthToken()
                    if (!token || !campaignId) return
                    const updates = Object.entries(contentActions)
                      .map(([creatorId, action]) => ({
                        creator_id: creatorId,
                        action: action.action,
                        feedback: action.feedback,
                      }))
                      .filter((u) => u.action)
                    if (updates.length === 0) {
                      toast.error("Please select actions for at least one creator")
                      return
                    }
                    setReviewingContent(true)
                    try {
                      await reviewCreatorContent(token, campaignId, updates)
                      toast.success("Content reviewed successfully")
                      setContentActions({})
                      loadContent()
                    } catch (err) {
                      toast.error(getErrorMessage(err))
                    } finally {
                      setReviewingContent(false)
                    }
                  }}
                  disabled={reviewingContent || Object.keys(contentActions).length === 0}
                  className="mt-4"
                >
                  {reviewingContent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  )
}
