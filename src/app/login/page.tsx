"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
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
  ApiError,
  extractIdToken,
  getErrorMessage,
  loginWithPassword,
} from "@/lib/api"
import {
  clearBrandTokens,
  clearCachedIdToken,
  setBrandAuthToken,
  setCachedIdToken,
} from "@/lib/auth"
import { toast } from "sonner"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaign_id")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    
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
      const tryLoginWithRole = async (roleToTry: "brand_owner" | "brand_emp" | "creator") => {
        const response = await loginWithPassword({
          email,
          password,
          role: roleToTry,
        })
        const idToken = extractIdToken(response)
        if (!idToken) {
          throw new Error("Login succeeded but no id token was returned.")
        }
        return { role: roleToTry, token: idToken }
      }

      const shouldRetry = (error: unknown) =>
        error instanceof ApiError &&
        [401, 403, 404].includes(error.status)

      let authResult:
        | { role: "brand_owner" | "brand_emp" | "creator"; token: string }
        | null = null

      try {
        authResult = await tryLoginWithRole("brand_owner")
      } catch (error) {
        if (!shouldRetry(error)) throw error
      }

      if (!authResult) {
        try {
          authResult = await tryLoginWithRole("brand_emp")
        } catch (error) {
          if (!shouldRetry(error)) throw error
        }
      }

      if (!authResult) {
        authResult = await tryLoginWithRole("creator")
      }

      if (authResult.role === "brand_owner" || authResult.role === "brand_emp") {
        clearCachedIdToken()
        clearBrandTokens()
        setBrandAuthToken(authResult.token, authResult.role)
        toast.success(
          authResult.role === "brand_owner"
            ? "Signed in as Brand Owner"
            : "Signed in as Brand Employee",
        )
        router.push("/dashboard/brand")
      } else {
        clearBrandTokens()
        setCachedIdToken(authResult.token)
        toast.success("Signed in successfully")
        if (campaignId) {
          router.push(`/dashboard/creator/campaigns/${campaignId}`)
        } else {
          router.push("/dashboard/creator")
        }
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-center text-[hsl(var(--muted-foreground))]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[hsl(var(--primary))] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <div className="text-[hsl(var(--muted-foreground))]">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
