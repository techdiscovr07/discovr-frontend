"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getErrorMessage, signup } from "@/lib/api"
import { toast } from "sonner"

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaign_id")
  const creatorToken = searchParams.get("creator_token")
  const isCampaignSignup = Boolean(campaignId)
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<string>("creator") // Default to creator for campaign signups
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  
  // If campaign_id is present, this is a creator signup from campaign link
  useEffect(() => {
    if (isCampaignSignup) {
      setRole("creator")
    }
  }, [isCampaignSignup])
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }
    
    setIsLoading(true)
    setServerError("")

    try {
      await signup({
        name: name.trim(),
        email,
        password,
        role: (role || "creator") as "creator" | "brand_owner" | "brand_emp",
      })
      
      // If this is a campaign signup, redirect to campaign detail page
      if (campaignId && creatorToken) {
        toast.success("Account created! Redirecting to campaign.")
        router.push(`/dashboard/creator/campaigns/${campaignId}`)
      } else {
        toast.success("Account created! Redirecting to sign in.")
        router.push("/login")
      }
    } catch (error) {
      const message = getErrorMessage(error)
      setServerError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md shadow-xl border bg-[hsl(var(--card))]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {campaignId && creatorToken ? "Sign up for Campaign" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-base">
            {campaignId && creatorToken
              ? "Create your account to submit your bid for this campaign"
              : "Enter your information to get started"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Aman Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }))
                    }
                  }}
                  className={`pl-10 ${errors.name ? "border-[hsl(var(--destructive))]" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }))
                    }
                  }}
                  className={`pl-10 ${errors.email ? "border-[hsl(var(--destructive))]" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }))
                    }
                  }}
                  className={`pl-10 ${errors.password ? "border-[hsl(var(--destructive))]" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }))
                    }
                  }}
                  className={`pl-10 ${errors.confirmPassword ? "border-[hsl(var(--destructive))]" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {!isCampaignSignup && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => {
                    setRole(value)
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: undefined }))
                    }
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={errors.role ? "border-[hsl(var(--destructive))]" : ""}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="brand_owner">Brand Owner</SelectItem>
                    <SelectItem value="brand_emp">Brand Employee</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-[hsl(var(--destructive))] mt-1">{errors.role}</p>
                )}
              </div>
            )}
            {serverError && (
              <p className="text-sm text-[hsl(var(--destructive))]">{serverError}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-center text-[hsl(var(--muted-foreground))]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[hsl(var(--primary))] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <div className="text-[hsl(var(--muted-foreground))]">Loading...</div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
