"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight } from "lucide-react"
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
import {
  extractIdToken,
  getErrorMessage,
  loginWithPassword,
} from "@/lib/api"
import { setCachedIdToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    role?: string
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
    
    if (!role) {
      newErrors.role = "Please select a role"
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
      const response = await loginWithPassword({
        email,
        password,
        role: role as "brand" | "creator",
      })
      const idToken = extractIdToken(response)

      if (!idToken) {
        throw new Error("Login succeeded but no id token was returned.")
      }

      setCachedIdToken(idToken)
      router.push("/dashboard")
    } catch (error) {
      setServerError(getErrorMessage(error))
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
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">{errors.role}</p>
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
                "Signing in..."
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
