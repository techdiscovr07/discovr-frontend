"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Youtube,
  Instagram,
  Twitter,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data
const creatorStats = {
  subscribers: 125000,
  avgViews: 45000,
  engagementRate: 5.8,
  totalEarnings: 23450,
  pendingEarnings: 3200,
  lifetimeEarnings: 67890,
}

const platformStatus = [
  {
    name: "YouTube",
    connected: true,
    icon: Youtube,
    handle: "@johndoe",
    followers: 125000,
  },
  {
    name: "Instagram",
    connected: false,
    icon: Instagram,
    handle: "",
    followers: 0,
  },
  {
    name: "Twitter",
    connected: false,
    icon: Twitter,
    handle: "",
    followers: 0,
  },
]

const activeCampaigns = [
  {
    id: 1,
    brand: "TechCorp",
    title: "Product Review - Wireless Headphones",
    status: "in-progress",
    payment: 2500,
    deadline: "2026-02-15",
    progress: 60,
    deliverables: "1 YouTube video (10-15 min)",
  },
  {
    id: 2,
    brand: "FashionBrand",
    title: "Spring Collection Showcase",
    status: "pending",
    payment: 1800,
    deadline: "2026-02-20",
    progress: 0,
    deliverables: "3 Instagram posts + 2 Stories",
  },
  {
    id: 3,
    brand: "FitnessApp",
    title: "App Tutorial & Review",
    status: "in-progress",
    payment: 3000,
    deadline: "2026-02-10",
    progress: 85,
    deliverables: "1 YouTube video + 1 Short",
  },
]

const recentEarnings = [
  {
    id: 1,
    brand: "TechGear Inc",
    campaign: "Product Launch Campaign",
    amount: 2500,
    date: "2026-01-20",
    status: "paid",
  },
  {
    id: 2,
    brand: "StyleCo",
    campaign: "Winter Collection",
    amount: 1800,
    date: "2026-01-15",
    status: "paid",
  },
  {
    id: 3,
    brand: "FitLife",
    campaign: "New Year Challenge",
    amount: 3200,
    date: "2026-01-10",
    status: "paid",
  },
]

export default function CreatorDashboardPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Creator Dashboard</h1>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">
                Manage your campaigns and track your earnings
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Switch to Brand View</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Platform Connection Status */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connected Platforms</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {platformStatus.map((platform) => (
              <Card
                key={platform.name}
                className={`${
                  platform.connected
                    ? "border-[hsl(var(--foreground))]"
                    : "border-[hsl(var(--border))]"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[hsl(var(--muted))]">
                        <platform.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {platform.name}
                        </CardTitle>
                        {platform.connected && (
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {platform.handle}
                          </p>
                        )}
                      </div>
                    </div>
                    {platform.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-[hsl(var(--foreground))]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {platform.connected ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                          Followers
                        </span>
                        <span className="font-semibold">
                          {platform.followers.toLocaleString('en-US')}
                        </span>
                      </div>
                      <Link href="/dashboard/creator/connect-youtube">
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href="/dashboard/creator/connect-youtube">
                      <Button className="w-full" variant="outline">
                        Connect {platform.name}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Creator Stats */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Subscribers
                  </CardTitle>
                  <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(creatorStats.subscribers / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+2.4K</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Avg Views
                  </CardTitle>
                  <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(creatorStats.avgViews / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+8%</span> from last month
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
                  {creatorStats.engagementRate}%
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+0.3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${creatorStats.totalEarnings.toLocaleString('en-US')}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>
                      Your ongoing brand partnerships
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{activeCampaigns.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="bg-[hsl(var(--muted))]">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">
                                {campaign.title}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  {campaign.brand.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{campaign.brand}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              campaign.status === "in-progress"
                                ? "default"
                                : "outline"
                            }
                          >
                            {campaign.status === "in-progress"
                              ? "In Progress"
                              : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Payment
                            </p>
                            <p className="font-semibold">
                              ${campaign.payment.toLocaleString('en-US')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--muted-foreground))]">
                              Deadline
                            </p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <p className="font-semibold">
                                {new Date(
                                  campaign.deadline
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            Deliverables: {campaign.deliverables}
                          </p>
                        </div>

                        {campaign.status === "in-progress" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[hsl(var(--muted-foreground))]">
                                Progress
                              </span>
                              <span className="font-medium">
                                {campaign.progress}%
                              </span>
                            </div>
                            <Progress value={campaign.progress} />
                          </div>
                        )}

                        <Button className="w-full" size="sm">
                          View Details
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Your payment overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted))]">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Pending
                      </p>
                      <p className="text-2xl font-bold">
                        ${creatorStats.pendingEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-black text-white">
                    <div>
                      <p className="text-sm opacity-80">This Month</p>
                      <p className="text-2xl font-bold">
                        ${creatorStats.totalEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 opacity-80" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--border))]">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Lifetime Total
                      </p>
                      <p className="text-xl font-bold">
                        ${creatorStats.lifetimeEarnings.toLocaleString('en-US')}
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                <Button className="w-full">Withdraw Earnings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEarnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-start justify-between pb-3 border-b border-[hsl(var(--border))] last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{earning.brand}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {new Date(earning.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${earning.amount.toLocaleString('en-US')}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
