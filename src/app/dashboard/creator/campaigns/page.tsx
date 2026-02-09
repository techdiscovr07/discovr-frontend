"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Calendar, DollarSign, FileText, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchCreatorCampaigns, getErrorMessage } from "@/lib/api"
import { getCachedIdToken } from "@/lib/auth"
import { toast } from "sonner"

type CampaignSummary = {
  campaign_id: string
  campaign_name: string
  status: string
  bid_amount?: number
  final_amount?: number
  has_brief: boolean
  has_content: boolean
  go_live_date: string
}

const statusBadgeClass = (status: string) => {
  if (status.includes("bid_pending")) return "bg-yellow-100 text-yellow-800"
  if (status.includes("amount_finalized")) return "bg-green-100 text-green-800"
  if (status.includes("amount_negotiated")) return "bg-orange-100 text-orange-800"
  if (status.includes("amount_rejected")) return "bg-red-100 text-red-800"
  if (status.includes("content_pending")) return "bg-blue-100 text-blue-800"
  if (status.includes("content_approved")) return "bg-green-100 text-green-800"
  if (status.includes("content_rejected")) return "bg-red-100 text-red-800"
  if (status.includes("content_live")) return "bg-purple-100 text-purple-800"
  if (status.includes("payment")) return "bg-indigo-100 text-indigo-800"
  return "bg-gray-100 text-gray-800"
}

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function CreatorCampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getCachedIdToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadCampaigns = async () => {
      try {
        const response = await fetchCreatorCampaigns(token)
        setCampaigns(response.campaigns || [])
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
        <p className="text-muted-foreground">View and manage your campaign participations</p>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              No campaigns found.
            </p>
            <p className="text-sm text-muted-foreground">
              If you signed up using a campaign link from your email, make sure you've completed the signup process by visiting the campaign page.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll see campaigns here once you're selected by a brand and linked to a campaign.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.campaign_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{campaign.campaign_name}</CardTitle>
                  <Badge className={statusBadgeClass(campaign.status)}>
                    {formatStatus(campaign.status)}
                  </Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(campaign.go_live_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.bid_amount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Bid: ₹{campaign.bid_amount.toLocaleString()}
                        {campaign.final_amount && campaign.final_amount !== campaign.bid_amount && (
                          <span className="text-muted-foreground ml-1">
                            (Final: ₹{campaign.final_amount.toLocaleString()})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {campaign.final_amount && !campaign.bid_amount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Final Amount: ₹{campaign.final_amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Brief: {campaign.has_brief ? "Available" : "Not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Content: {campaign.has_content ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                </div>
                <Link href={`/dashboard/creator/campaigns/${campaign.campaign_id}`}>
                  <Button className="w-full mt-4">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
