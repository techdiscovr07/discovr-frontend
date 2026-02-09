"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  DollarSign,
  FileText,
  Video,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ThumbsUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  linkCreatorToCampaign,
  fetchCreatorCampaignBrief,
  fetchCreatorCampaigns,
  submitCreatorBid,
  acceptCreatorFinalAmount,
  uploadCreatorContent,
  creatorGoLive,
  getErrorMessage,
} from "@/lib/api"
import { getCachedIdToken } from "@/lib/auth"
import { toast } from "sonner"

type CampaignBrief = {
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
}

export default function CreatorCampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = params.id as string
  const creatorToken = searchParams.get("creator_token")

  const [loading, setLoading] = useState(true)
  const [brief, setBrief] = useState<CampaignBrief | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [submittingBid, setSubmittingBid] = useState(false)
  const [contentFile, setContentFile] = useState<File | null>(null)
  const [liveUrl, setLiveUrl] = useState("")
  const [uploadingContent, setUploadingContent] = useState(false)
  const [submittingGoLive, setSubmittingGoLive] = useState(false)
  const [acceptingAmount, setAcceptingAmount] = useState(false)

  useEffect(() => {
    const token = getCachedIdToken()
    if (!token) {
      const loginReturn =
        campaignId && creatorToken
          ? `?campaign_id=${encodeURIComponent(campaignId)}&creator_token=${encodeURIComponent(creatorToken)}`
          : campaignId
            ? `?campaign_id=${encodeURIComponent(campaignId)}`
            : ""
      router.push(`/login${loginReturn}`)
      return
    }

    /** When brief API fails (e.g. 403), get status from campaign list so we don't show the bid form for amount_negotiated/amount_finalized. */
    const loadStatusFromList = async (): Promise<CampaignBrief | null> => {
      try {
        const { campaigns = [] } = await fetchCreatorCampaigns(token)
        const c = campaigns.find((x: { campaign_id: string }) => x.campaign_id === campaignId)
        if (!c) return null
        const status = (c as { status?: string }).status
        const finalAmount = (c as { final_amount?: number }).final_amount
        const campaignName = (c as { campaign_name?: string }).campaign_name
        if (status && (status.includes("amount_negotiated") || status.includes("amount_finalized") || status.includes("content") || status.includes("payment"))) {
          return {
            status,
            final_amount: typeof finalAmount === "number" ? finalAmount : 0,
            campaign: { id: campaignId, name: campaignName || "Campaign" },
          }
        }
      } catch {
        // ignore
      }
      return null
    }

    const loadBrief = async () => {
      try {
        const response = await fetchCreatorCampaignBrief(token, campaignId)
        setBrief(response)
      } catch (error) {
        const message = getErrorMessage(error)
        const fallback = await loadStatusFromList()
        if (fallback) {
          setBrief(fallback)
        } else if (message.includes("Amount not finalized") || message.includes("Brief not available") || message.includes("Creator not found")) {
          setBrief(null)
        } else {
          setBrief(null)
          if (!message.toLowerCase().includes("forbidden")) {
            toast.error(message)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    const run = async () => {
      // Link creator to campaign ONLY when needed:
      // - if a creator_token is present (email invite flow), OR
      // - if the campaign isn't already present in /creator/campaigns
      // This avoids noisy 400 Bad Request errors on normal page loads.
      let alreadyLinked = false
      try {
        const { campaigns = [] } = await fetchCreatorCampaigns(token)
        alreadyLinked = campaigns.some(
          (c: { campaign_id: string }) => c.campaign_id === campaignId,
        )
      } catch {
        // ignore
      }

      const shouldAttemptLink = Boolean(creatorToken) || !alreadyLinked

      if (shouldAttemptLink) {
        try {
          await linkCreatorToCampaign(token, campaignId, creatorToken ?? undefined)
          if (creatorToken) {
            toast.success("Campaign linked successfully!")
          }
          if (typeof window !== "undefined" && window.history.replaceState && creatorToken) {
            const url = new URL(window.location.href)
            url.searchParams.delete("creator_token")
            window.history.replaceState({}, "", url.pathname + url.search)
          }
        } catch (err) {
          const msg = getErrorMessage(err)
          if (msg.includes("already used") || msg.includes("already linked")) {
            // Already linked – continue
          } else if (!creatorToken && (msg.toLowerCase().includes("bad request") || msg.toLowerCase().includes("400"))) {
            // Backend may require creator_token for linking; ignore on normal page views.
          } else {
            toast.error(`Failed to link campaign: ${msg}`)
          }
        }
      }
      await loadBrief()
    }

    run()
  }, [campaignId, creatorToken, router])

  const handleSubmitBid = async () => {
    const amount = parseFloat(bidAmount)
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid bid amount")
      return
    }

    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }

    setSubmittingBid(true)
    try {
      await submitCreatorBid(token, campaignId, amount)
      toast.success("Bid submitted successfully!")
      setBidAmount("")
      // Reload page to show updated status
      window.location.reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmittingBid(false)
    }
  }

  const handleUploadContent = async () => {
    if (!contentFile) {
      toast.error("Please select a video file")
      return
    }

    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }

    setUploadingContent(true)
    try {
      await uploadCreatorContent(token, campaignId, contentFile, liveUrl || undefined)
      toast.success("Content uploaded successfully!")
      setContentFile(null)
      setLiveUrl("")
      // Reload page to show updated status
      window.location.reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setUploadingContent(false)
    }
  }

  const handleGoLive = async () => {
    if (!liveUrl.trim()) {
      toast.error("Please enter the live URL")
      return
    }

    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }

    setSubmittingGoLive(true)
    try {
      await creatorGoLive(token, campaignId, liveUrl)
      toast.success("Content marked as live!")
      setLiveUrl("")
      // Reload page to show updated status
      window.location.reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmittingGoLive(false)
    }
  }

  const handleAcceptFinalAmount = async () => {
    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }
    setAcceptingAmount(true)
    try {
      await acceptCreatorFinalAmount(token, campaignId)
      toast.success("Amount accepted. You can now view the brief and upload content.")
      window.location.reload()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setAcceptingAmount(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const status = brief?.status || "accepted"
  const showBidding = status === "accepted" || status === "bid_pending"
  const showAcceptAmount = brief && status === "amount_negotiated" && brief.final_amount != null
  const showBrief = brief && status === "amount_finalized"
  const showContentUpload = brief && status === "amount_finalized" && brief.campaign
  const showGoLive = status === "content_approved"

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/dashboard/creator/campaigns">
        <Button variant="ghost" className="mb-4">
          ← Back to Campaigns
        </Button>
      </Link>

      {brief && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{brief.campaign.name}</h1>
          {brief.campaign.description && (
            <p className="text-muted-foreground">{brief.campaign.description}</p>
          )}
        </div>
      )}

      {/* Bidding Phase */}
      {showBidding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Submit Your Bid
            </CardTitle>
            <CardDescription>
              Enter your bid amount for this campaign. The brand will review and finalize the amount.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bidAmount">Bid Amount (₹)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder="50000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={submittingBid}
                />
              </div>
              <Button onClick={handleSubmitBid} disabled={submittingBid || !bidAmount}>
                {submittingBid ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Bid"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accept final amount (brand has negotiated) */}
      {showAcceptAmount && brief && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Brand has offered a final amount
            </CardTitle>
            <CardDescription>
              The brand has proposed ₹{brief.final_amount.toLocaleString()}. Accept this amount to view the brief and proceed to content upload.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-2xl font-semibold">₹{brief.final_amount.toLocaleString()}</p>
              <Button
                onClick={handleAcceptFinalAmount}
                disabled={acceptingAmount}
              >
                {acceptingAmount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept final amount"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brief Phase */}
      {showBrief && brief && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaign Brief
            </CardTitle>
            <CardDescription>
              Final Amount: ₹{brief.final_amount.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {brief.campaign.video_title && (
              <div>
                <h3 className="font-semibold mb-2">Video Title</h3>
                <p className="text-muted-foreground">{brief.campaign.video_title}</p>
              </div>
            )}
            {brief.campaign.primary_focus && (
              <div>
                <h3 className="font-semibold mb-2">Primary Focus</h3>
                <p className="text-muted-foreground">{brief.campaign.primary_focus}</p>
              </div>
            )}
            {brief.campaign.secondary_focus && (
              <div>
                <h3 className="font-semibold mb-2">Secondary Focus</h3>
                <p className="text-muted-foreground">{brief.campaign.secondary_focus}</p>
              </div>
            )}
            {brief.campaign.dos && (
              <div>
                <h3 className="font-semibold mb-2">Do's</h3>
                <p className="text-muted-foreground whitespace-pre-line">{brief.campaign.dos}</p>
              </div>
            )}
            {brief.campaign.donts && (
              <div>
                <h3 className="font-semibold mb-2">Don'ts</h3>
                <p className="text-muted-foreground whitespace-pre-line">{brief.campaign.donts}</p>
              </div>
            )}
            {brief.campaign.cta && (
              <div>
                <h3 className="font-semibold mb-2">Call to Action</h3>
                <p className="text-muted-foreground">{brief.campaign.cta}</p>
              </div>
            )}
            {brief.campaign.sample_video_url && (
              <div>
                <h3 className="font-semibold mb-2">Sample Video</h3>
                <a
                  href={brief.campaign.sample_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  Watch Sample Video
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            {!brief.campaign.primary_focus && !brief.campaign.video_title && !brief.campaign.dos && (
              <p className="text-sm text-muted-foreground">Brief details will appear here once the brand has completed the brief.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Upload Phase */}
      {showContentUpload && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Content
            </CardTitle>
            <CardDescription>
              Upload your video content for brand review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentFile">Video File</Label>
                <Input
                  id="contentFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                  disabled={uploadingContent}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: MP4, MOV, AVI, MKV, WebM
                </p>
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL (Optional)</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  placeholder="https://instagram.com/p/xxx"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  disabled={uploadingContent}
                />
              </div>
              <Button onClick={handleUploadContent} disabled={uploadingContent || !contentFile}>
                {uploadingContent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Content"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Pending Status */}
      {status === "content_pending" && (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Content Under Review</h3>
            <p className="text-muted-foreground">
              Your content has been submitted and is awaiting brand approval.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Go Live Phase */}
      {showGoLive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Go Live
            </CardTitle>
            <CardDescription>
              Your content has been approved! Mark it as live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goLiveUrl">Live URL</Label>
                <Input
                  id="goLiveUrl"
                  type="url"
                  placeholder="https://instagram.com/p/xxx"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  disabled={submittingGoLive}
                />
              </div>
              <Button onClick={handleGoLive} disabled={submittingGoLive || !liveUrl.trim()}>
                {submittingGoLive ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Mark as Live"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Live Status */}
      {status === "content_live" && (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Content is Live!</h3>
            <p className="text-muted-foreground">
              Your content has been marked as live. Payment will be processed by admin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Status */}
      {(status.includes("payment") || status === "payment_completed") && (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Payment Status</h3>
            <Badge className="mt-2">
              {status === "payment_completed" ? "Payment Completed" : "Payment Pending"}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
