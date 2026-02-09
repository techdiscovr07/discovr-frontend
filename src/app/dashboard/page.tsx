"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Target,
  Users,
  Settings,
  Bell,
  ChevronDown,
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  Activity,
  LogOut,
  User,
  Menu,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiError, fetchProfile, getErrorMessage } from "@/lib/api"
import { clearCachedIdToken, getCachedIdToken } from "@/lib/auth"

// Mock data
const metrics = {
  activeCampaigns: 12,
  totalSpend: 45680,
  estimatedReach: 2450000,
  avgEngagementRate: 4.8,
}

const campaigns = [
  {
    id: 1,
    name: "Summer Collection Launch",
    creator: "Sarah Johnson",
    status: "active",
    budget: 5000,
    spent: 3200,
    reach: 245000,
    engagement: 5.2,
    progress: 64,
  },
  {
    id: 2,
    name: "Product Review Series",
    creator: "Mike Chen",
    status: "active",
    budget: 3500,
    spent: 2100,
    reach: 180000,
    engagement: 4.8,
    progress: 60,
  },
  {
    id: 3,
    name: "Brand Awareness Q1",
    creator: "Emma Davis",
    status: "completed",
    budget: 8000,
    spent: 8000,
    reach: 520000,
    engagement: 6.1,
    progress: 100,
  },
  {
    id: 4,
    name: "Influencer Partnership",
    creator: "Alex Rivera",
    status: "active",
    budget: 6000,
    spent: 1500,
    reach: 95000,
    engagement: 3.9,
    progress: 25,
  },
  {
    id: 5,
    name: "Holiday Campaign",
    creator: "Lisa Park",
    status: "pending",
    budget: 4500,
    spent: 0,
    reach: 0,
    engagement: 0,
    progress: 0,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileName, setProfileName] = useState("User")
  const [profileError, setProfileError] = useState("")
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const token = getCachedIdToken()
      if (!token) {
        setAuthChecked(true)
        router.replace("/login")
        return
      }

      try {
        const profile = await fetchProfile(token)
        if (profile && typeof profile === "object") {
          const role =
            typeof (profile as { role?: string }).role === "string"
              ? (profile as { role?: string }).role
              : typeof (profile as { user_role?: string }).user_role === "string"
              ? (profile as { user_role?: string }).user_role
              : typeof (profile as { userRole?: string }).userRole === "string"
              ? (profile as { userRole?: string }).userRole
              : null
          if (role && role.toLowerCase().includes("creator")) {
            router.replace("/dashboard/creator")
            return
          }
          const name =
            typeof (profile as { name?: string }).name === "string"
              ? (profile as { name?: string }).name
              : typeof (profile as { fullName?: string }).fullName === "string"
              ? (profile as { fullName?: string }).fullName
              : null
          if (name) {
            setProfileName(name)
          }
        }
        setAuthChecked(true)
      } catch (error) {
        setProfileError(getErrorMessage(error))
        setAuthChecked(true)
        // Only clear token and redirect on 401 Unauthorized (invalid/expired token).
        // Network errors, CORS, or 5xx in production would otherwise kick users to login.
        const isUnauthorized =
          error instanceof ApiError && error.status === 401
        if (isUnauthorized) {
          clearCachedIdToken()
          router.replace("/login")
        }
      }
    }

    loadProfile()
  }, [router])

  const handleLogout = () => {
    clearCachedIdToken()
    router.push("/login")
  }

  const initials = profileName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("")

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-[hsl(var(--muted-foreground))]">Loading...</div>
      </div>
    )
  }

  const token = getCachedIdToken()
  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[hsl(var(--border))] px-6">
          <Target className="h-6 w-6 text-[hsl(var(--primary))]" />
          <span className="font-bold text-xl">Discovr</span>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link href="/dashboard">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/campaigns">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </Button>
          </Link>
          <Link href="/dashboard/creators">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Creators
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-black border-0 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs text-white/80">
                Unlock advanced analytics and unlimited campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Welcome back, {profileName}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{profileName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[hsl(var(--destructive))]"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {profileError && (
            <p className="mb-4 text-sm text-[hsl(var(--destructive))]">
              {profileError}
            </p>
          )}
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Campaigns
                </CardTitle>
                <Target className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.activeCampaigns}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+2</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spend
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metrics.totalSpend.toLocaleString('en-US')}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Estimated Reach
                </CardTitle>
                <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(metrics.estimatedReach / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+18%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Engagement
                </CardTitle>
                <Activity className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.avgEngagementRate}%
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  <span className="font-medium">+0.4%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <Link href="/dashboard/campaigns/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
            </div>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>
                    Monitor and manage your ongoing creator partnerships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="text-right">Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">
                            {campaign.name}
                          </TableCell>
                          <TableCell>{campaign.creator}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campaign.status === "active"
                                  ? "default"
                                  : campaign.status === "completed"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                ${campaign.spent.toLocaleString('en-US')} / $
                                {campaign.budget.toLocaleString('en-US')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={campaign.progress} />
                              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                {campaign.progress}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-medium">
                                {campaign.engagement}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    Detailed insights into your campaign performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                    Analytics dashboard coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
