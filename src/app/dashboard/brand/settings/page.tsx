"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BrandSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Manage brand preferences and team access.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Settings management is coming soon. Contact support if you need help
            updating brand details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
