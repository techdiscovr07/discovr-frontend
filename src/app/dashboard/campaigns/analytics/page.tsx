"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  Users,
  DollarSign,
  Download,
  Calendar,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock campaign data
const campaignInfo = {
  name: "Summer Collection Launch",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  status: "Active",
  totalBudget: 15000,
  totalSpent: 12500,
}

// Mock views over time data (daily)
const viewsData = [
  { date: "Jan 1", views: 12500, engagement: 4.2 },
  { date: "Jan 3", views: 18200, engagement: 4.5 },
  { date: "Jan 5", views: 24100, engagement: 5.1 },
  { date: "Jan 7", views: 31500, engagement: 5.3 },
  { date: "Jan 9", views: 28900, engagement: 4.9 },
  { date: "Jan 11", views: 35600, engagement: 5.8 },
  { date: "Jan 13", views: 42300, engagement: 6.2 },
  { date: "Jan 15", views: 38700, engagement: 5.7 },
  { date: "Jan 17", views: 45200, engagement: 6.4 },
  { date: "Jan 19", views: 52100, engagement: 6.8 },
  { date: "Jan 21", views: 48500, engagement: 6.1 },
  { date: "Jan 23", views: 55800, engagement: 7.2 },
  { date: "Jan 25", views: 62300, engagement: 7.5 },
  { date: "Jan 27", views: 58900, engagement: 6.9 },
  { date: "Jan 29", views: 65400, engagement: 7.8 },
]

// Mock engagement rate data
const engagementData = [
  { metric: "Likes", value: 45200, percentage: 6.8 },
  { metric: "Comments", value: 12500, percentage: 1.9 },
  { metric: "Shares", value: 8900, percentage: 1.3 },
  { metric: "Saves", value: 15600, percentage: 2.3 },
  { metric: "Click-through", value: 22100, percentage: 3.3 },
]

// Mock top creators performance
const creatorsPerformance = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    views: 185000,
    engagement: 7.2,
    likes: 13320,
    comments: 3700,
    revenue: 2500,
    roi: 340,
  },
  {
    id: 2,
    name: "Emma Davis",
    handle: "@emmadstyle",
    views: 220000,
    engagement: 6.8,
    likes: 14960,
    comments: 4400,
    revenue: 2800,
    roi: 380,
  },
  {
    id: 3,
    name: "Maya Chen",
    handle: "@mayacstyle",
    views: 165000,
    engagement: 6.5,
    likes: 10725,
    comments: 3300,
    revenue: 2200,
    roi: 310,
  },
  {
    id: 4,
    name: "Lisa Park",
    handle: "@lisapbeauty",
    views: 142000,
    engagement: 5.9,
    likes: 8378,
    comments: 2840,
    revenue: 1900,
    roi: 285,
  },
]

// Mock metrics summary
const metricsSummary = {
  totalViews: 712000,
  totalEngagement: 6.6,
  totalLikes: 47383,
  totalComments: 14240,
  avgROI: 329,
  totalRevenue: 9400,
}

export default function CampaignAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

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
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Campaign Analytics</h1>
                <Badge>{campaignInfo.status}</Badge>
              </div>
              <p className="text-[hsl(var(--muted-foreground))]">
                {campaignInfo.name}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {campaignInfo.startDate} - {campaignInfo.endDate}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metricsSummary.totalViews / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                <span className="font-medium">+12.5%</span> from last period
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
                {metricsSummary.totalEngagement}%
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                <span className="font-medium">+0.8%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${campaignInfo.totalSpent.toLocaleString('en-US')}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                of ${campaignInfo.totalBudget.toLocaleString('en-US')} budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
                <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsSummary.avgROI}%
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                <span className="font-medium">+45%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="creators">Top Creators</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
                <CardDescription>
                  Daily views and engagement rate trend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
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

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Progress</CardTitle>
                  <CardDescription>
                    Budget utilization and timeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Budget Used
                      </span>
                      <span className="font-medium">
                        {((campaignInfo.totalSpent / campaignInfo.totalBudget) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{
                          width: `${(campaignInfo.totalSpent / campaignInfo.totalBudget) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Spent
                      </p>
                      <p className="text-xl font-bold">
                        ${campaignInfo.totalSpent.toLocaleString('en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Remaining
                      </p>
                      <p className="text-xl font-bold">
                        ${(campaignInfo.totalBudget - campaignInfo.totalSpent).toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Campaign performance summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        Total Likes
                      </span>
                      <span className="font-semibold">
                        {metricsSummary.totalLikes.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        Total Comments
                      </span>
                      <span className="font-semibold">
                        {metricsSummary.totalComments.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        Creators
                      </span>
                      <span className="font-semibold">
                        {creatorsPerformance.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[hsl(var(--border))]">
                      <span className="text-sm font-medium">
                        Total Revenue Generated
                      </span>
                      <span className="font-bold text-lg">
                        ${metricsSummary.totalRevenue.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>
                  Interaction metrics across all content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="metric"
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of user interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engagementData.map((item) => (
                      <TableRow key={item.metric}>
                        <TableCell className="font-medium">
                          {item.metric}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.value.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Creators</CardTitle>
                <CardDescription>
                  Creator-by-creator performance breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                      <TableHead className="text-right">Likes</TableHead>
                      <TableHead className="text-right">Comments</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creatorsPerformance.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{creator.name}</div>
                            <div className="text-sm text-[hsl(var(--muted-foreground))]">
                              {creator.handle}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {(creator.views / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">
                            {creator.engagement}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {creator.likes.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell className="text-right">
                          {creator.comments.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">{creator.roi}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creator Comparison</CardTitle>
                <CardDescription>
                  View performance comparison across creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creatorsPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="views"
                        fill="#000000"
                        radius={[8, 8, 0, 0]}
                        name="Views"
                      />
                      <Bar
                        dataKey="likes"
                        fill="#6b7280"
                        radius={[8, 8, 0, 0]}
                        name="Likes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
