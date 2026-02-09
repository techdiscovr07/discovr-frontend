"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchBrandCampaigns, getErrorMessage } from "@/lib/api"
import { getBrandAuthToken } from "@/lib/auth"

type BrandCampaign = {
  id: string
  name: string
  status?: string
  reviewStatus?: string
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
  return {
    id,
    name:
      (campaign.name as string) ||
      (campaign.title as string) ||
      "Untitled Campaign",
    status:
      (campaign.status as string) ||
      (campaign.campaign_status as string) ||
      undefined,
    reviewStatus:
      (campaign.review_status as string) ||
      (campaign.reviewStatus as string) ||
      undefined,
    briefCompleted:
      typeof campaign.brief_completed === "boolean"
        ? (campaign.brief_completed as boolean)
        : typeof campaign.briefCompleted === "boolean"
        ? (campaign.briefCompleted as boolean)
        : undefined,
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
  }
}

export default function BrandCampaignsPage() {
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
        const list = Array.isArray(response?.campaigns)
          ? response.campaigns
          : Array.isArray(response)
          ? response
          : []
        setCampaigns(list.map((item) => normalizeCampaign(item)))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Campaigns</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage campaign creation and briefs.
          </p>
        </div>
        <Link href="/dashboard/brand/campaigns/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-3 text-sm text-[hsl(var(--destructive))]">{error}</p>
          )}
          {isLoading ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading campaigns…</p>
          ) : campaigns.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Creators</TableHead>
                  <TableHead>Go live</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const needsBrief =
                    campaign.briefCompleted === false ||
                    campaign.status === "awaiting_brief"
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {campaign.status && (
                            <Badge variant="secondary">{campaign.status}</Badge>
                          )}
                          {campaign.reviewStatus && (
                            <Badge 
                              variant={
                                campaign.reviewStatus === "creators_are_final" 
                                  ? "default" 
                                  : campaign.reviewStatus === "creators_in_review"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {campaign.reviewStatus.replace(/_/g, " ")}
                            </Badge>
                          )}
                          {!campaign.status && !campaign.reviewStatus && "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.totalBudget !== undefined
                          ? `$${campaign.totalBudget.toLocaleString("en-US")}`
                          : "—"}
                      </TableCell>
                      <TableCell>{campaign.creatorCount ?? "—"}</TableCell>
                      <TableCell>{campaign.goLiveDate ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/brand/campaigns/${campaign.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                          {needsBrief && (
                            <Link
                              href={`/dashboard/brand/campaigns/create?campaignId=${campaign.id}&step=brief`}
                            >
                              <Button size="sm">Upload Brief</Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No campaigns found yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
