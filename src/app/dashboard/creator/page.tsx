"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CreatorDashboardPage() {
  const router = useRouter()
  
  // Redirect to campaigns page - this is the main creator dashboard now
  useEffect(() => {
    router.replace("/dashboard/creator/campaigns")
  }, [router])
  
  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
