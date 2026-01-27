"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Youtube,
  Users,
  Eye,
  TrendingUp,
  Check,
  X,
  Sparkles,
  Target,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Mock campaign data
const campaignInfo = {
  title: "Summer Collection Launch",
  budget: 5000,
  targetReach: 500000,
  niche: "Fashion & Beauty",
}

// Mock matched creators
const matchedCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    platform: "YouTube",
    subscribers: 185000,
    avgViews: 45000,
    engagementRate: 5.8,
    audienceOverlap: 92,
    estimatedReach: 120000,
    niche: "Fashion",
    recentVideos: 48,
    matchScore: 95,
    status: "pending",
  },
  {
    id: 2,
    name: "Emma Davis",
    handle: "@emmadstyle",
    platform: "YouTube",
    subscribers: 220000,
    avgViews: 62000,
    engagementRate: 6.2,
    audienceOverlap: 88,
    estimatedReach: 150000,
    niche: "Fashion & Lifestyle",
    recentVideos: 36,
    matchScore: 93,
    status: "pending",
  },
  {
    id: 3,
    name: "Lisa Park",
    handle: "@lisapbeauty",
    platform: "YouTube",
    subscribers: 156000,
    avgViews: 38000,
    engagementRate: 5.4,
    audienceOverlap: 85,
    estimatedReach: 95000,
    niche: "Beauty",
    recentVideos: 52,
    matchScore: 89,
    status: "pending",
  },
  {
    id: 4,
    name: "Maya Chen",
    handle: "@mayacstyle",
    platform: "YouTube",
    subscribers: 195000,
    avgViews: 51000,
    engagementRate: 5.9,
    audienceOverlap: 90,
    estimatedReach: 135000,
    niche: "Fashion",
    recentVideos: 41,
    matchScore: 91,
    status: "pending",
  },
  {
    id: 5,
    name: "Sophia Martinez",
    handle: "@sophiambeauty",
    platform: "YouTube",
    subscribers: 142000,
    avgViews: 35000,
    engagementRate: 5.2,
    audienceOverlap: 82,
    estimatedReach: 88000,
    niche: "Beauty & Lifestyle",
    recentVideos: 44,
    matchScore: 86,
    status: "pending",
  },
]

export default function CampaignMatchPage() {
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

  const approvedCreators = creators.filter((c) => c.status === "approved")
  const totalEstimatedReach = approvedCreators.reduce(
    (sum, c) => sum + c.estimatedReach,
    0
  )
  const totalBudgetNeeded = approvedCreators.length * 1500 // Mock budget per creator

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
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--muted))]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Creator Matches</h1>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    {campaignInfo.title}
                  </p>
                </div>
              </div>
              <p className="text-[hsl(var(--muted-foreground))] mt-2">
                AI-powered matches based on your campaign requirements
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {creators.filter((c) => c.status === "pending").length} Pending
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Creator List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matched Creators</CardTitle>
                <CardDescription>
                  Review and select creators for your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {creators.map((creator) => (
                  <Card
                    key={creator.id}
                    className={`${
                      creator.status === "approved"
                        ? "border-2 border-[hsl(var(--foreground))]"
                        : creator.status === "rejected"
                        ? "opacity-50 border-[hsl(var(--muted-foreground))]"
                        : "border-[hsl(var(--border))]"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Creator Header */}
                        <div className="flex items-start justify-between">
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
                              <div className="flex items-center gap-2 mt-1">
                                <Youtube className="h-4 w-4" />
                                <Badge variant="outline" className="text-xs">
                                  {creator.niche}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`${
                                creator.status === "approved"
                                  ? "bg-[hsl(var(--foreground))] text-white"
                                  : creator.status === "rejected"
                                  ? "bg-[hsl(var(--muted))]"
                                  : "bg-[hsl(var(--muted))]"
                              }`}
                            >
                              {creator.status === "approved"
                                ? "Approved"
                                : creator.status === "rejected"
                                ? "Rejected"
                                : `${creator.matchScore}% Match`}
                            </Badge>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-[hsl(var(--muted))]">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] mb-1">
                              <Users className="h-3 w-3" />
                              <span>Subscribers</span>
                            </div>
                            <p className="font-semibold">
                              {(creator.subscribers / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] mb-1">
                              <Eye className="h-3 w-3" />
                              <span>Avg Views</span>
                            </div>
                            <p className="font-semibold">
                              {(creator.avgViews / 1000).toFixed(1)}K
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] mb-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Engagement</span>
                            </div>
                            <p className="font-semibold">
                              {creator.engagementRate}%
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] mb-1">
                              <Target className="h-3 w-3" />
                              <span>Reach Est.</span>
                            </div>
                            <p className="font-semibold">
                              {(creator.estimatedReach / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </div>

                        {/* Audience Overlap */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Audience Overlap
                            </span>
                            <span className="font-semibold">
                              {creator.audienceOverlap}%
                            </span>
                          </div>
                          <Progress value={creator.audienceOverlap} />
                        </div>

                        {/* Action Buttons */}
                        {creator.status === "pending" && (
                          <div className="flex gap-3 pt-2">
                            <Button
                              className="flex-1 gap-2"
                              onClick={() => handleApprove(creator.id)}
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 gap-2"
                              onClick={() => handleReject(creator.id)}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {creator.status === "approved" && (
                          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[hsl(var(--foreground))] text-white">
                            <Check className="h-4 w-4" />
                            <span className="font-medium">
                              Added to Campaign
                            </span>
                          </div>
                        )}

                        {creator.status === "rejected" && (
                          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))]">
                            <X className="h-4 w-4" />
                            <span className="font-medium">Not Selected</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Campaign Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
                <CardDescription>Overview of your selections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[hsl(var(--muted))]">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Campaign
                      </span>
                      <span className="font-medium text-right">
                        {campaignInfo.title}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Budget
                      </span>
                      <span className="font-medium">
                        ${campaignInfo.budget.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Target Reach
                      </span>
                      <span className="font-medium">
                        {(campaignInfo.targetReach / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[hsl(var(--border))] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      Approved Creators
                    </span>
                    <Badge variant="secondary">
                      {approvedCreators.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        Est. Reach
                      </span>
                    </div>
                    <span className="font-semibold">
                      {totalEstimatedReach > 0
                        ? `${(totalEstimatedReach / 1000).toFixed(0)}K`
                        : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        Est. Cost
                      </span>
                    </div>
                    <span className="font-semibold">
                      ${totalBudgetNeeded.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>

                {approvedCreators.length > 0 && (
                  <div className="pt-4 border-t border-[hsl(var(--border))]">
                    <div className="p-3 rounded-lg bg-black text-white">
                      <div className="text-xs opacity-80 mb-1">
                        Total Investment
                      </div>
                      <div className="text-2xl font-bold">
                        ${totalBudgetNeeded.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <CardTitle>AI Insights</CardTitle>
                </div>
                <CardDescription>Match recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-1 bg-[hsl(var(--foreground))] rounded-full" />
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Top 3 creators have 90%+ audience overlap with your target
                    demographic
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 bg-[hsl(var(--foreground))] rounded-full" />
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Average engagement rate is 5.7%, above industry average
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 bg-[hsl(var(--foreground))] rounded-full" />
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Estimated campaign reach: 588K viewers across all creators
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={approvedCreators.length === 0}
                >
                  Launch Campaign
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Save Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
