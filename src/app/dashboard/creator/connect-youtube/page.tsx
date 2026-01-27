"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Youtube,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Eye,
  BarChart3,
  Lock,
  Users,
  Video,
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

// Mock connected channel data
const mockChannelData = {
  name: "John Doe",
  handle: "@johndoe",
  subscribers: 125000,
  totalVideos: 245,
  totalViews: 5600000,
  thumbnail: "",
}

const permissions = [
  {
    icon: Eye,
    title: "View Channel Statistics",
    description: "Access to your subscriber count, views, and engagement metrics",
  },
  {
    icon: Video,
    title: "Video Information",
    description: "Read your video titles, descriptions, and performance data",
  },
  {
    icon: BarChart3,
    title: "Analytics Access",
    description: "View detailed analytics to help brands understand your reach",
  },
]

const securityFeatures = [
  {
    icon: Lock,
    title: "Read-Only Access",
    description: "We can only view your data, never modify or delete anything",
  },
  {
    icon: Shield,
    title: "Secure Connection",
    description: "All data is encrypted and securely transmitted",
  },
  {
    icon: Users,
    title: "You Control Access",
    description: "Disconnect anytime from your Google account settings",
  },
]

export default function ConnectYouTubePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Mock OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/creator">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--muted))]">
              <Youtube className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Connect YouTube</h1>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">
                Link your YouTube channel to start receiving campaign offers
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status Card */}
        {isConnected ? (
          <Card className="mb-8 border-2 border-[hsl(var(--foreground))]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(var(--foreground))]" />
                  <div>
                    <CardTitle>YouTube Connected</CardTitle>
                    <CardDescription>
                      Your channel is successfully connected
                    </CardDescription>
                  </div>
                </div>
                <Badge>Connected</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-[hsl(var(--muted))] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {mockChannelData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {mockChannelData.name}
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))] mb-4">
                      {mockChannelData.handle}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-[hsl(var(--muted-foreground))]">
                          Subscribers
                        </p>
                        <p className="font-semibold text-lg">
                          {(mockChannelData.subscribers / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-[hsl(var(--muted-foreground))]">
                          Videos
                        </p>
                        <p className="font-semibold text-lg">
                          {mockChannelData.totalVideos}
                        </p>
                      </div>
                      <div>
                        <p className="text-[hsl(var(--muted-foreground))]">
                          Total Views
                        </p>
                        <p className="font-semibold text-lg">
                          {(mockChannelData.totalViews / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect Channel
                </Button>
                <Button variant="outline">Refresh Data</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[hsl(var(--muted))]">
                  <Youtube className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Connect Your YouTube Channel</CardTitle>
                  <CardDescription>
                    Securely link your channel to unlock campaign opportunities
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-[hsl(var(--muted))] rounded-lg p-6 text-center">
                  <Youtube className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
                  <h3 className="text-lg font-semibold mb-2">
                    Not Connected
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                    Connect your YouTube channel to showcase your content and
                    receive branded campaign offers
                  </p>
                  <Button
                    size="lg"
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="gap-2"
                  >
                    <Youtube className="h-5 w-5" />
                    {isConnecting
                      ? "Connecting..."
                      : "Connect with YouTube"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permissions Requested */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What We'll Access</CardTitle>
            <CardDescription>
              We request the following read-only permissions from YouTube
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-[hsl(var(--muted))]"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                    <permission.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{permission.title}</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {permission.description}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--foreground))] flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>
              Your data and account security are our top priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg border border-[hsl(var(--border))]"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[hsl(var(--muted))]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-[hsl(var(--muted))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong className="text-[hsl(var(--foreground))]">
                  Note:
                </strong>{" "}
                We use YouTube&apos;s official OAuth 2.0 API for secure
                authentication. You can revoke access at any time through your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[hsl(var(--foreground))]"
                >
                  Google Account settings
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        {!isConnected && (
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={handleConnect}
              disabled={isConnecting}
              className="gap-2"
            >
              <Youtube className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect YouTube Now"}
            </Button>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
              By connecting, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
