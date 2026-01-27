"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Eye,
  DollarSign,
  Target,
  TrendingUp,
  Check,
  X,
  BarChart3,
  Calendar,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock campaign data
const campaignData = {
  id: "1",
  title: "Summer Collection Launch",
  status: "active",
  budget: 15000,
  spent: 8500,
  estimatedReach: 850000,
  actualReach: 520000,
  startDate: "2026-01-15",
  endDate: "2026-02-28",
  platform: "YouTube",
  niche: "Fashion & Beauty",
  brief:
    "We're launching our new summer collection and looking for fashion influencers to showcase our latest designs. The campaign should highlight the versatility and comfort of our new line, with a focus on sustainable fashion practices. Creators should produce authentic content that resonates with their audience while naturally integrating our products.",
  goals: [
    "Generate 500K+ views across all content",
    "Achieve 5%+ engagement rate",
    "Drive traffic to product landing page",
    "Build brand awareness among 18-35 age group",
  ],
}

// Mock matched creators
const matchedCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    subscribers: 185000,
    avgViews: 45000,
    engagementRate: 5.8,
    audienceOverlap: 92,
    price: 2500,
    niche: "Fashion",
    status: "pending",
  },
  {
    id: 2,
    name: "Emma Davis",
    handle: "@emmadstyle",
    subscribers: 220000,
    avgViews: 62000,
    engagementRate: 6.2,
    audienceOverlap: 88,
    price: 2800,
    niche: "Fashion & Lifestyle",
    status: "pending",
  },
  {
    id: 3,
    name: "Maya Chen",
    handle: "@mayacstyle",
    subscribers: 195000,
    avgViews: 51000,
    engagementRate: 5.9,
    audienceOverlap: 90,
    price: 2600,
    niche: "Fashion",
    status: "pending",
  },
]

// Mock active creators
const activeCreators = [
  {
    id: 4,
    name: "Lisa Park",
    handle: "@lisapbeauty",
    subscribers: 156000,
    avgViews: 38000,
    engagementRate: 5.4,
    price: 2200,
    status: "in-progress",
    deliverables: "1 YouTube video (10-15 min)",
    deadline: "2026-02-10",
    progress: 65,
    views: 42000,
    engagement: 5.8,
  },
  {
    id: 5,
    name: "Sophia Martinez",
    handle: "@sophiambeauty",
    subscribers: 142000,
    avgViews: 35000,
    engagementRate: 5.2,
    price: 2100,
    status: "completed",
    deliverables: "1 YouTube video + 2 Shorts",
    deadline: "2026-01-28",
    progress: 100,
    views: 48500,
    engagement: 6.2,
  },
]

// Mock analytics data
const analyticsData = [
  { date: "Week 1", views: 12500, engagement: 4.2 },
  { date: "Week 2", views: 28900, engagement: 4.9 },
  { date: "Week 3", views: 45200, engagement: 5.7 },
  { date: "Week 4", views: 62300, engagement: 6.4 },
]

export default function CampaignDetailsPage() {
  const [creators, setCreators] = useState(matchedCreators)

  const handleApprove = (id: number) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    )
  }

  const handleReject = (id: number) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
    )
  }

  const pendingCount = creators.filter((c) => c.status === "pending").length

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{campaignData.title}</h1>
                <Badge
                  className={
                    campaignData.status === "active"
                      ? "bg-[hsl(var(--foreground))] text-white"
                      : ""
                  }
                >
                  {campaignData.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {campaignData.startDate} - {campaignData.endDate}
                  </span>
                </div>
                <span>•</span>
                <span>{campaignData.platform}</span>
                <span>•</span>
                <span>{campaignData.niche}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Campaign
              </Button>
              <Link href="/dashboard/campaigns/analytics">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Full Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${campaignData.budget.toLocaleString('en-US')}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  ${campaignData.spent.toLocaleString('en-US')} spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Est. Reach
                  </CardTitle>
                  <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(campaignData.estimatedReach / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {(campaignData.actualReach / 1000).toFixed(0)}K actual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Active Creators
                  </CardTitle>
                  <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeCreators.length}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {pendingCount} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Avg Engagement
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.8%</div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+0.6%</span> from target
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Campaign Brief */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Campaign Brief</CardTitle>
            <CardDescription>
              Campaign objectives and content guidelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Overview</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {campaignData.brief}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Campaign Goals</h4>
              <ul className="space-y-2">
                {campaignData.goals.map((goal, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]"
                  >
                    <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="matched" className="space-y-6">
          <TabsList>
            <TabsTrigger value="matched">
              Matched Creators {pendingCount > 0 && `(${pendingCount})`}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeCreators.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Matched Creators Tab */}
          <TabsContent value="matched">
            <Card>
              <CardHeader>
                <CardTitle>AI-Matched Creators</CardTitle>
                <CardDescription>
                  Review and approve creators for your campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creators.map((creator) => (
                    <Card
                      key={creator.id}
                      className={`${
                        creator.status === "approved"
                          ? "border-2 border-[hsl(var(--foreground))]"
                          : creator.status === "rejected"
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {creator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {creator.status === "pending" && (
                            <Badge variant="outline">{creator.niche}</Badge>
                          )}
                          {creator.status === "approved" && (
                            <Badge className="bg-[hsl(var(--foreground))] text-white">
                              Approved
                            </Badge>
                          )}
                          {creator.status === "rejected" && (
                            <Badge variant="outline">Rejected</Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{creator.name}</h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {creator.handle}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Subscribers
                            </p>
                            <p className="font-semibold">
                              {(creator.subscribers / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Avg Views
                            </p>
                            <p className="font-semibold">
                              {(creator.avgViews / 1000).toFixed(1)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Engagement
                            </p>
                            <p className="font-semibold">
                              {creator.engagementRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Price
                            </p>
                            <p className="font-semibold">
                              ${creator.price.toLocaleString('en-US')}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Audience Overlap
                            </span>
                            <span className="font-medium">
                              {creator.audienceOverlap}%
                            </span>
                          </div>
                          <Progress value={creator.audienceOverlap} />
                        </div>

                        {creator.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              onClick={() => handleApprove(creator.id)}
                            >
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1"
                              onClick={() => handleReject(creator.id)}
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Creators Tab */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Creators</CardTitle>
                <CardDescription>
                  Track progress and performance of approved creators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCreators.map((creator) => (
                  <Card key={creator.id} className="bg-[hsl(var(--muted))]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="text-lg">
                              {creator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {creator.name}
                            </h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {creator.handle}
                            </p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                              {creator.deliverables}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            creator.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            creator.status === "completed"
                              ? "bg-[hsl(var(--foreground))] text-white"
                              : ""
                          }
                        >
                          {creator.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Views
                          </p>
                          <p className="font-semibold">
                            {creator.views.toLocaleString('en-US')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Engagement
                          </p>
                          <p className="font-semibold">{creator.engagement}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Deadline
                          </p>
                          <p className="font-semibold text-sm">
                            {new Date(creator.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Payment
                          </p>
                          <p className="font-semibold">
                            ${creator.price.toLocaleString('en-US')}
                          </p>
                        </div>
                      </div>

                      {creator.status === "in-progress" && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Progress
                            </span>
                            <span className="font-medium">
                              {creator.progress}%
                            </span>
                          </div>
                          <Progress value={creator.progress} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>
                    Views and engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                        />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#000000"
                          strokeWidth={2}
                          dot={{ fill: "#000000", r: 4 }}
                          name="Views"
                        />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#6b7280"
                          strokeWidth={2}
                          dot={{ fill: "#6b7280", r: 4 }}
                          name="Engagement %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">520K</div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      61% of target reach
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Avg Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5.8%</div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      Above industry average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">285%</div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      Estimated return
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Link href="/dashboard/campaigns/analytics">
                    <Button className="w-full" size="lg">
                      View Full Analytics Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
