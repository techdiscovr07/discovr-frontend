"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchBrandCampaignCreators,
  fetchBrandCampaigns,
  getErrorMessage,
  respondToCampaignCreators,
} from "@/lib/api"
import { getBrandAuthToken } from "@/lib/auth"
import { toast } from "sonner"

type BrandCampaign = { id: string; name: string }
type CreatorRow = {
  id: string
  name: string
  instagram?: string
  followers?: number
  avgViews?: number
  commercial?: string
  status?: string
}

const normalizeCampaigns = (payload: Array<Record<string, unknown>>) =>
  payload.map((campaign) => ({
    id:
      (campaign.id as string) ||
      (campaign._id as string) ||
      (campaign.campaign_id as string) ||
      "",
    name:
      (campaign.name as string) ||
      (campaign.title as string) ||
      "Untitled Campaign",
  }))

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
  }))
}

export default function BrandCreatorsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [creators, setCreators] = useState<CreatorRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCreators, setIsLoadingCreators] = useState(false)
  const [error, setError] = useState("")
  const [actionCreatorId, setActionCreatorId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const loadCampaigns = async () => {
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
        const normalized = normalizeCampaigns(list)
        setCampaigns(normalized)
        if (normalized.length && !selectedCampaign) {
          setSelectedCampaign(normalized[0].id)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }
    loadCampaigns()
  }, [])

  useEffect(() => {
    const loadCreators = async () => {
      if (!selectedCampaign) return
      setIsLoadingCreators(true)
      setError("")
      try {
        const token = getBrandAuthToken()
        if (!token) return
        const response = await fetchBrandCampaignCreators(token, selectedCampaign)
        setCreators(normalizeCreators(response))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoadingCreators(false)
      }
    }
    loadCreators()
  }, [selectedCampaign])

  const handleRespond = async (creatorId: string, status: "accepted" | "rejected" | "negotiated") => {
    setActionCreatorId(creatorId)
    setError("")
    try {
      const token = getBrandAuthToken()
      if (!token) return
      await respondToCampaignCreators(token, {
        campaign_id: selectedCampaign,
        updates: [{ creator_id: creatorId, status }],
      })
      toast.success(`Creator ${status}`)
      await fetchBrandCampaignCreators(token, selectedCampaign).then((response) => {
        setCreators(normalizeCreators(response))
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setActionCreatorId(null)
    }
  }

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      (creator.instagram ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || (creator.status ?? "pending") === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Creators</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Review creators assigned to each campaign.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/brand/campaigns")}>
          View Campaigns
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading campaigns…</p>
          ) : campaigns.length ? (
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No campaigns yet.{" "}
              <Link href="/dashboard/brand/campaigns/create" className="underline">
                Create one
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creators</CardTitle>
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
          </div>
          {error && (
            <p className="mb-3 text-sm text-[hsl(var(--destructive))]">{error}</p>
          )}
          {isLoadingCreators ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading creators…</p>
          ) : filteredCreators.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Avg views</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell className="font-medium">{creator.name}</TableCell>
                    <TableCell>{creator.instagram ?? "—"}</TableCell>
                    <TableCell>{creator.followers ?? "—"}</TableCell>
                    <TableCell>{creator.avgViews ?? "—"}</TableCell>
                    <TableCell>{creator.commercial ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {creator.status?.replace(/_/g, " ") ?? "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionCreatorId === creator.id}
                          onClick={() => handleRespond(creator.id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionCreatorId === creator.id}
                          onClick={() => handleRespond(creator.id, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionCreatorId === creator.id}
                          onClick={() => handleRespond(creator.id, "negotiated")}
                        >
                          Negotiate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No creators available for this campaign.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
