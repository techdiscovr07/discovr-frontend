"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  BarChart3,
  Trash2,
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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock campaigns data
const campaignsData = [
  {
    id: "1",
    title: "Summer Collection Launch",
    status: "active",
    budget: 15000,
    spent: 8500,
    reach: 520000,
    targetReach: 850000,
    engagement: 5.8,
    creators: 2,
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    platform: "YouTube",
    niche: "Fashion",
  },
  {
    id: "2",
    title: "Product Review Series",
    status: "active",
    budget: 8000,
    spent: 4200,
    reach: 180000,
    targetReach: 300000,
    engagement: 4.8,
    creators: 1,
    startDate: "2026-01-20",
    endDate: "2026-02-20",
    platform: "YouTube",
    niche: "Tech",
  },
  {
    id: "3",
    title: "Brand Awareness Q1",
    status: "completed",
    budget: 12000,
    spent: 12000,
    reach: 680000,
    targetReach: 600000,
    engagement: 6.1,
    creators: 3,
    startDate: "2025-12-01",
    endDate: "2026-01-10",
    platform: "YouTube",
    niche: "Lifestyle",
  },
  {
    id: "4",
    title: "Influencer Partnership",
    status: "draft",
    budget: 10000,
    spent: 0,
    reach: 0,
    targetReach: 450000,
    engagement: 0,
    creators: 0,
    startDate: "2026-02-01",
    endDate: "2026-03-15",
    platform: "Instagram",
    niche: "Fashion",
  },
  {
    id: "5",
    title: "Holiday Campaign 2026",
    status: "scheduled",
    budget: 20000,
    spent: 0,
    reach: 0,
    targetReach: 1000000,
    engagement: 0,
    creators: 4,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    platform: "YouTube",
    niche: "Lifestyle",
  },
  {
    id: "6",
    title: "Spring Fashion Week",
    status: "active",
    budget: 18000,
    spent: 5400,
    reach: 245000,
    targetReach: 750000,
    engagement: 5.2,
    creators: 2,
    startDate: "2026-01-25",
    endDate: "2026-03-10",
    platform: "Instagram",
    niche: "Fashion",
  },
]

const statusColors = {
  active: "bg-[hsl(var(--foreground))] text-white",
  completed: "bg-[hsl(var(--muted))]",
  draft: "bg-[hsl(var(--muted))]",
  scheduled: "bg-[hsl(var(--muted))]",
}

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCampaigns = campaignsData.filter((campaign) => {
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: campaignsData.length,
    active: campaignsData.filter((c) => c.status === "active").length,
    completed: campaignsData.filter((c) => c.status === "completed").length,
    draft: campaignsData.filter((c) => c.status === "draft").length,
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Manage and track all your creator marketing campaigns
            </p>
          </div>
          <Link href="/dashboard/campaigns/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Tabs
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  className="w-auto"
                >
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid View */}
        {viewMode === "grid" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={statusColors[campaign.status]}>
                      {campaign.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/dashboard/campaigns/${campaign.id}`}>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <Link href="/dashboard/campaigns/analytics">
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[hsl(var(--destructive))]">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <span>{campaign.platform}</span>
                    <span>•</span>
                    <span>{campaign.niche}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] mb-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Budget</span>
                      </div>
                      <p className="font-semibold">
                        ${campaign.budget.toLocaleString('en-US')}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] mb-1">
                        <Eye className="h-3 w-3" />
                        <span>Reach</span>
                      </div>
                      <p className="font-semibold">
                        {campaign.reach > 0
                          ? `${(campaign.reach / 1000).toFixed(0)}K`
                          : "0"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] mb-1">
                        <Users className="h-3 w-3" />
                        <span>Creators</span>
                      </div>
                      <p className="font-semibold">{campaign.creators}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Engagement</span>
                      </div>
                      <p className="font-semibold">
                        {campaign.engagement > 0
                          ? `${campaign.engagement}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {campaign.status === "active" && (
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Budget Used
                        </span>
                        <span className="font-medium">
                          {((campaign.spent / campaign.budget) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={(campaign.spent / campaign.budget) * 100}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <Button className="w-full" variant="outline">
                      View Campaign
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Campaigns List View */}
        {viewMode === "list" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Creators</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-[hsl(var(--muted-foreground))]">
                            {campaign.platform} • {campaign.niche}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[campaign.status]}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-semibold">
                          ${campaign.budget.toLocaleString('en-US')}
                        </div>
                        {campaign.status === "active" && (
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            ${campaign.spent.toLocaleString('en-US')} spent
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {campaign.reach > 0
                          ? `${(campaign.reach / 1000).toFixed(0)}K`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {campaign.creators}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.engagement > 0 ? (
                          <Badge variant="secondary">
                            {campaign.engagement}%
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/dashboard/campaigns/${campaign.id}`}>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <Link href="/dashboard/campaigns/analytics">
                              <DropdownMenuItem>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-[hsl(var(--destructive))]">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-[hsl(var(--muted-foreground))]">
                <p className="text-lg font-medium mb-2">No campaigns found</p>
                <p className="text-sm mb-4">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first campaign"}
                </p>
                {!searchQuery && (
                  <Link href="/dashboard/campaigns/create">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Campaign
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
