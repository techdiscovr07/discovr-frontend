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
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  linkCreatorToCampaign,
  fetchCreatorCampaignBrief,
  fetchCreatorCampaigns,
  fetchProfile,
  fetchCreatorBidStatus,
  respondToCreatorBid,
  uploadCreatorScript,
  uploadCreatorContent,
  creatorGoLive,
  getErrorMessage,
} from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clearCachedIdToken, getCachedIdToken } from "@/lib/auth"
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
    brand_name?: string
  }
  final_amount: number
  status: string
  script_content?: string
  script_feedback?: string
  script_submitted_at?: string
  content_feedback?: string
  content_status?: string
}

export default function CreatorCampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = params.id as string
  const creatorToken = searchParams.get("creator_token")

  const [loading, setLoading] = useState(true)
  const [brief, setBrief] = useState<CampaignBrief | null>(null)
  const [bidStatus, setBidStatus] = useState<{
    status: string
    proposed_amount?: number
    bid_amount?: number
    final_amount?: number
    negotiation_deadline?: string
  } | null>(null)
  const [counterAmount, setCounterAmount] = useState("")
  const [responding, setResponding] = useState(false)
  const [scriptContent, setScriptContent] = useState("")
  const [submittingScript, setSubmittingScript] = useState(false)
  const [contentFile, setContentFile] = useState<File | null>(null)
  const [liveUrl, setLiveUrl] = useState("")
  const [uploadingContent, setUploadingContent] = useState(false)
  const [submittingGoLive, setSubmittingGoLive] = useState(false)
  const [profileName, setProfileName] = useState("Creator")
  const [profileInstagram, setProfileInstagram] = useState<string | null>(null)
  const [brandBidPopupOpen, setBrandBidPopupOpen] = useState(true)

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
        if (status && (status.includes("amount_negotiated") || status.includes("amount_finalized") || status.includes("script_") || status.includes("content") || status.includes("payment"))) {
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
        } else if (
          message.includes("Amount not finalized") ||
          message.includes("Brief not available") ||
          message.includes("Creator not found") ||
          message.includes("Not Found") ||
          message.includes("Request failed")
        ) {
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

    const loadBid = async () => {
      try {
        const status = await fetchCreatorBidStatus(token, campaignId)
        setBidStatus(status)
      } catch {
        // ignore
      }
    }

    const run = async () => {
      // Always try to link: by creator_token (from email) or by matching signup email to campaign_creator
      // This ensures existing creators who land on this page (with or without token) get linked
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
        } else if (msg.includes("Creator not found") || msg.includes("Use the signup link")) {
          // Creator not in campaign – don't block, loadBid/loadBrief will handle
        } else {
          toast.error(`Failed to link campaign: ${msg}`)
        }
      }
      await loadBid()
      await loadBrief()
    }

    run()
  }, [campaignId, creatorToken, router])

  useEffect(() => {
    const token = getCachedIdToken()
    if (!token) return
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile(token)
        if (profile && typeof profile === "object") {
          const name =
            (typeof (profile as { name?: string }).name === "string"
              ? (profile as { name?: string }).name
              : typeof (profile as { fullName?: string }).fullName === "string"
              ? (profile as { fullName?: string }).fullName
              : null) ?? "Creator"
          const instagram =
            (typeof (profile as { instagram?: string }).instagram === "string"
              ? (profile as { instagram?: string }).instagram
              : typeof (profile as { instagram_url?: string }).instagram_url === "string"
              ? (profile as { instagram_url?: string }).instagram_url
              : typeof (profile as { instagramUrl?: string }).instagramUrl === "string"
              ? (profile as { instagramUrl?: string }).instagramUrl
              : null) ?? null
          setProfileName(name)
          setProfileInstagram(instagram)
        }
      } catch {
        // ignore
      }
    }
    loadProfile()
  }, [])

  const status = bidStatus?.status || brief?.status || "accepted"
  const offerAmount = bidStatus?.proposed_amount ?? 0
  const showBrandBidPopup = status === "accepted" && offerAmount > 0

  useEffect(() => {
    if (showBrandBidPopup) {
      setBrandBidPopupOpen(true)
    }
  }, [showBrandBidPopup])

  const handleLogout = () => {
    clearCachedIdToken()
    router.push("/login")
  }

  const handleBidResponse = async (action: "accept" | "reject" | "renegotiate") => {
    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }
    if (action === "renegotiate") {
      const amount = parseFloat(counterAmount)
      if (!amount || amount <= 0) {
        toast.error("Please enter a valid counter amount")
        return
      }
    }
    setResponding(true)
    try {
      await respondToCreatorBid(token, {
        campaign_id: campaignId,
        action,
        counter_amount: action === "renegotiate" ? parseFloat(counterAmount) : undefined,
      })
      toast.success("Response submitted!")
      setCounterAmount("")
      setBrandBidPopupOpen(false)
      const status = await fetchCreatorBidStatus(token, campaignId)
      setBidStatus(status)
      await fetchCreatorCampaignBrief(token, campaignId).then(setBrief).catch(() => null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setResponding(false)
    }
  }

  const handleUploadScript = async () => {
    const content = scriptContent.trim() || brief?.script_content?.trim() || ""
    if (!content) {
      toast.error("Please enter your video script")
      return
    }

    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }

    setSubmittingScript(true)
    try {
      await uploadCreatorScript(token, campaignId, content)
      toast.success("Script submitted successfully!")
      setScriptContent("")
      await fetchCreatorCampaignBrief(token, campaignId).then(setBrief).catch(() => null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmittingScript(false)
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

  // Creator responds to brand offer via handleBidResponse

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const showBrief =
    brief &&
    (status === "amount_finalized" ||
      status.startsWith("script_") ||
      status.startsWith("content_") ||
      status.startsWith("payment_"))
  // Only show Brand Offer when still in negotiation phase (not yet accepted/finalized)
  const showOffer =
    (offerAmount > 0 || status === "amount_negotiated") &&
    status !== "amount_finalized" &&
    !status.includes("content") &&
    !status.includes("payment")
  const showWaitingOffer =
    (status === "accepted" || status === "negotiated") && !showOffer && !showBrief
  // Show brand details when amount is finalized (brand has accepted) or later
  const showBrandDetails =
    brief &&
    (status === "amount_finalized" ||
      status.startsWith("script_") ||
      status.includes("content") ||
      status.includes("payment"))
  const showBrandBidPopupOpen = showBrandBidPopup && brandBidPopupOpen
  const counterValue = bidStatus?.bid_amount ?? 0
  const showScriptUpload =
    brief &&
    (status === "amount_finalized" ||
      status === "script_revision_requested" ||
      status === "script_rejected") &&
    brief.campaign
  const showScriptPending = status === "script_pending"
  const showScriptRevisionRequested =
    status === "script_revision_requested" || status === "script_rejected"
  const showRevisionRequested =
    status === "content_revision_requested" || status === "content_rejected"
  const showContentUpload =
    brief &&
    (status === "script_approved" ||
      status === "content_revision_requested" ||
      status === "content_rejected") &&
    brief.campaign
  const showGoLive = status === "content_approved"

  return (
    <>
      {showBrandBidPopupOpen && (
        <Dialog open={brandBidPopupOpen} onOpenChange={setBrandBidPopupOpen}>
          <DialogContent showClose={true}>
            <DialogHeader>
              <DialogTitle>Brand has bid on you</DialogTitle>
              <DialogDescription>
                The brand has bid ₹{offerAmount.toLocaleString()} for this campaign. Accept to get onboarded, reject to decline, or negotiate with a counter amount.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="popup-counter">Counter Amount (₹) - if negotiating</Label>
                  <Input
                    id="popup-counter"
                    type="number"
                    placeholder="Enter counter amount"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    disabled={responding}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleBidResponse("accept")} disabled={responding}>
                Accept
              </Button>
              <Button variant="outline" onClick={() => handleBidResponse("reject")} disabled={responding}>
                Reject
              </Button>
              <Button variant="secondary" onClick={() => handleBidResponse("renegotiate")} disabled={responding}>
                Negotiate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/creator/campaigns">
            <Button variant="ghost">← Back to Campaigns</Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/creator/campaigns">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/dashboard/creator/connect-youtube">
            <Button variant="outline">Connect YouTube</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate">{profileName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="space-y-1">
                <div className="text-sm font-medium">{profileName}</div>
                {profileInstagram && (
                  <div className="text-xs text-muted-foreground truncate">
                    {profileInstagram}
                  </div>
                )}
              </DropdownMenuLabel>
              {profileInstagram && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href={
                        profileInstagram.startsWith("http")
                          ? profileInstagram
                          : `https://instagram.com/${profileInstagram.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Instagram
                    </a>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {brief && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{brief.campaign.name}</h1>
          {brief.campaign.description && (
            <p className="text-muted-foreground">{brief.campaign.description}</p>
          )}
        </div>
      )}

      {/* Brand Details - shown when amount finalized (brand accepted) or later */}
      {showBrandDetails && brief && (
        <Card className="mb-6 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Brand Partner
            </CardTitle>
            <CardDescription>
              You&apos;ve agreed to work with this brand on this campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Brand</p>
              <p className="text-lg font-semibold">
                {brief.campaign.brand_name || "Brand"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Campaign</p>
              <p className="font-medium">{brief.campaign.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agreed Amount</p>
              <p className="text-xl font-semibold">₹{brief.final_amount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand Offer - only when still negotiating */}
      {showOffer && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Brand Offer
            </CardTitle>
            <CardDescription>
              The brand has bid on you for this campaign. Accept to get onboarded, reject to decline, or negotiate with a counter amount (one-time only).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Brand offer</p>
                  <p className="text-2xl font-semibold">₹{offerAmount.toLocaleString()}</p>
                </div>
                {counterValue > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Your counter</p>
                    <p className="text-xl font-semibold">₹{counterValue.toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="counterAmount">Counter Amount (₹)</Label>
                  <Input
                    id="counterAmount"
                    type="number"
                    placeholder="Enter counter amount"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    disabled={responding}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <Button onClick={() => handleBidResponse("accept")} disabled={responding}>
                    Accept
                  </Button>
                  <Button variant="outline" onClick={() => handleBidResponse("reject")} disabled={responding}>
                    Reject
                  </Button>
                  <Button variant="secondary" onClick={() => handleBidResponse("renegotiate")} disabled={responding}>
                    Renegotiate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showWaitingOffer && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Waiting for brand offer
            </CardTitle>
            <CardDescription>
              The brand will start the bid for this campaign. You will be notified once an offer is available.
            </CardDescription>
          </CardHeader>
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

      {/* Script Upload - Step 1: Submit video script before filming */}
      {showScriptUpload && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Video Script
            </CardTitle>
            <CardDescription>
              {showScriptRevisionRequested
                ? "The brand has requested changes to your script. Please revise and resubmit."
                : "Submit your video script for brand approval before filming. The brand will review and approve, request changes, or reject."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showScriptRevisionRequested && brief?.script_feedback && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Brand Feedback</h4>
                <p className="text-sm text-amber-900 whitespace-pre-line">
                  {brief.script_feedback}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="scriptContent">Your Script</Label>
              <Textarea
                id="scriptContent"
                placeholder="Paste or write your video script here..."
                value={scriptContent || brief?.script_content || ""}
                onChange={(e) => setScriptContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                disabled={submittingScript}
              />
            </div>
            <Button
              onClick={handleUploadScript}
              disabled={
                submittingScript ||
                !(scriptContent.trim() || brief?.script_content?.trim())
              }
            >
              {submittingScript ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : showScriptRevisionRequested ? (
                "Resubmit Script"
              ) : (
                "Submit Script"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Script Pending - Waiting for brand review */}
      {showScriptPending && (
        <Card className="mb-6 border-blue-200 bg-blue-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-700" />
              Script Under Review
            </CardTitle>
            <CardDescription>
              Your script has been submitted. The brand will review it and either approve, request changes, or reject. You will be notified once they respond.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Script Approved - Can proceed to video upload */}
      {status === "script_approved" && brief && (
        <Card className="mb-6 border-green-200 bg-green-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Script Approved
            </CardTitle>
            <CardDescription>
              Your script has been approved. You can now film and upload your video.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Script Rejected - Final state */}
      {status === "script_rejected" && brief?.script_feedback && (
        <Card className="mb-6 border-red-200 bg-red-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Script Rejected
            </CardTitle>
            <CardDescription>
              The brand has rejected your script. You can revise and resubmit using the form above.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-red-200 bg-white p-4">
              <h4 className="font-semibold text-red-800 mb-2">Brand Feedback</h4>
              <p className="text-sm text-red-900 whitespace-pre-line">
                {brief.script_feedback}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revision Requested - Content (video) */}
      {showRevisionRequested && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-700" />
              Content revision requested
            </CardTitle>
            <CardDescription>
              The brand has requested changes to your content. Please review the feedback and upload a revised version.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {brief?.content_feedback ? (
              <div>
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {brief.content_feedback}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Feedback will appear here once the brand shares it.
              </p>
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
              {showRevisionRequested ? "Upload Revised Content" : "Upload Content"}
            </CardTitle>
            <CardDescription>
              {showRevisionRequested
                ? "Upload the revised video based on the brand's feedback."
                : "Upload your video content for brand review"}
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
                  showRevisionRequested ? "Upload Revised Content" : "Upload Content"
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
    </>
  )
}
