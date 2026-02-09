"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  clearBrandTokens,
  getBrandAuthRole,
  getBrandAuthToken,
} from "@/lib/auth"
import { fetchBrandProfile, getErrorMessage } from "@/lib/api"

const navItems = [
  { href: "/dashboard/brand/campaigns", label: "Campaigns", icon: LayoutDashboard },
  { href: "/dashboard/brand/creators", label: "Creators", icon: Users },
  { href: "/dashboard/brand/settings", label: "Settings", icon: Settings },
]

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [roleLabel, setRoleLabel] = useState<"Owner" | "Employee" | null>(null)
  const [brandName, setBrandName] = useState<string | null>(null)

  useEffect(() => {
    const token = getBrandAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }
    const role = getBrandAuthRole()
    setRoleLabel(role === "brand_owner" ? "Owner" : role === "brand_emp" ? "Employee" : null)
    fetchBrandProfile(token)
      .then((response) => {
        const name =
          (response.brand as { name?: string } | undefined)?.name ||
          (response.data as { name?: string } | undefined)?.name ||
          null
        setBrandName(name)
      })
      .catch((err) => {
        setBrandName(null)
        console.warn(getErrorMessage(err))
      })
    setAuthReady(true)
  }, [router])

  const activeHref = useMemo(() => pathname ?? "", [pathname])

  const handleLogout = () => {
    clearBrandTokens()
    router.push("/login")
  }

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-[hsl(var(--muted-foreground))]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[hsl(var(--border))] px-6">
          <Building2 className="h-6 w-6 text-[hsl(var(--primary))]" />
          <Link href="/dashboard/brand" className="font-bold text-lg">
            {brandName ?? "Brand Workspace"}
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = activeHref.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {brandName ? `${brandName} Dashboard` : "Brand Dashboard"}
              </h1>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Logged in as {roleLabel ?? "Brand"}
              </p>
            </div>
            {roleLabel && <Badge variant="secondary">{roleLabel}</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
