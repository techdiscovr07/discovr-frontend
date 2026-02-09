"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBrandCampaigns, getErrorMessage } from "@/lib/api"
import { getBrandAuthToken } from "@/lib/auth"

type BrandCampaign = {
  id: string
  name: string
  status?: string
  briefCompleted?: boolean
  totalBudget?: number
  creatorCount?: number
  goLiveDate?: string
}

const normalizeCampaign = (campaign: Record<string, unknown>): BrandCampaign => {
  const id =
    (campaign.id as string) ||
    (campaign._id as string) ||
    (campaign.campaign_id as string) ||
    ""
  const name =
    (campaign.name as string) ||
    (campaign.title as string) ||
    "Untitled Campaign"
  const status =
    (campaign.status as string) || (campaign.campaign_status as string) || undefined
  const briefCompleted =
    typeof campaign.brief_completed === "boolean"
      ? (campaign.brief_completed as boolean)
      : typeof campaign.briefCompleted === "boolean"
      ? (campaign.briefCompleted as boolean)
      : typeof campaign.has_brief === "boolean"
      ? (campaign.has_brief as boolean)
      : undefined
  const totalBudget =
    typeof campaign.total_budget === "number"
      ? (campaign.total_budget as number)
      : typeof campaign.totalBudget === "number"
      ? (campaign.totalBudget as number)
      : undefined
  const creatorCount =
    typeof campaign.creator_count === "number"
      ? (campaign.creator_count as number)
      : typeof campaign.creatorCount === "number"
      ? (campaign.creatorCount as number)
      : undefined
  const goLiveDate =
    (campaign.go_live_date as string) ||
    (campaign.goLiveDate as string) ||
    undefined

  return {
    id,
    name,
    status,
    briefCompleted,
    totalBudget,
    creatorCount,
    goLiveDate,
  }
}

export default function BrandDashboardPage() {
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError("")
      try {
        const token = getBrandAuthToken()
        if (!token) return
        const response = await fetchBrandCampaigns(token)
        const list = Array.isArray(response) ? response : []
        setCampaigns(list.map((item) => normalizeCampaign(item)))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const total = campaigns.length
    const awaitingBrief = campaigns.filter(
      (c) => c.briefCompleted === false || c.status === "awaiting_brief",
    ).length
    const searchingCreators = campaigns.filter(
      (c) => c.status === "searching_creators",
    ).length
    return { total, awaitingBrief, searchingCreators }
  }, [campaigns])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Track active campaigns and creator sourcing.
          </p>
        </div>
        <Link href="/dashboard/brand/campaigns/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))/0.08] p-3 text-sm text-[hsl(var(--destructive))]">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Awaiting Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.awaitingBrief}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Searching Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.searchingCreators}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading campaigns…</p>
          ) : campaigns.length ? (
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[hsl(var(--border))] p-3"
                >
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {campaign.goLiveDate ? `Go live: ${campaign.goLiveDate}` : "No go-live date"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status && <Badge variant="secondary">{campaign.status}</Badge>}
                    <Link href={`/dashboard/brand/campaigns/${campaign.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No campaigns yet. Create your first campaign to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
