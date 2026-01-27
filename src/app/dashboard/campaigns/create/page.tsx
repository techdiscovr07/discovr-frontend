"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const STEPS = [
  { id: 1, name: "Basics", description: "Campaign details" },
  { id: 2, name: "Brief", description: "Brand brief" },
  { id: 3, name: "Budget", description: "Set your budget" },
  { id: 4, name: "Audience", description: "Target audience" },
  { id: 5, name: "Review", description: "Review & submit" },
]

interface FormData {
  title: string
  platform: string
  brief: string
  budget: number
  geography: string
  niche: string
}

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    platform: "youtube",
    brief: "",
    budget: 5000,
    geography: "",
    niche: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  )

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = "Campaign title is required"
        }
        if (!formData.platform) {
          newErrors.platform = "Platform is required"
        }
        break
      case 2:
        if (!formData.brief.trim()) {
          newErrors.brief = "Brand brief is required"
        } else if (formData.brief.trim().length < 50) {
          newErrors.brief = "Brief must be at least 50 characters"
        }
        break
      case 3:
        if (formData.budget < 500) {
          newErrors.budget = "Minimum budget is $500"
        }
        break
      case 4:
        if (!formData.geography) {
          newErrors.geography = "Geography is required"
        }
        if (!formData.niche) {
          newErrors.niche = "Niche is required"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Campaign submitted:", formData)

    setIsSubmitting(false)
    alert("Campaign created successfully! 🎉")
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10">
              <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Campaign</h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                Launch your creator marketing campaign in 5 easy steps
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white"
                        : currentStep === step.id
                        ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? "text-[hsl(var(--foreground))]"
                          : "text-[hsl(var(--muted-foreground))]"
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-[hsl(var(--primary))]"
                        : "bg-[hsl(var(--border))]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border shadow-xl bg-[hsl(var(--card))]">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Campaign Basics */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Collection Launch 2024"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    className={errors.title ? "border-[hsl(var(--destructive))]" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-[hsl(var(--destructive))]">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => updateFormData("platform", value)}
                  >
                    <SelectTrigger
                      className={
                        errors.platform ? "border-[hsl(var(--destructive))]" : ""
                      }
                    >
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.platform && (
                    <p className="text-sm text-[hsl(var(--destructive))]">
                      {errors.platform}
                    </p>
                  )}
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Choose the primary platform for this campaign
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Brand Brief */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brief">Brand Brief *</Label>
                  <Textarea
                    id="brief"
                    placeholder="Describe your campaign goals, key messaging, content guidelines, and what you expect from creators..."
                    value={formData.brief}
                    onChange={(e) => updateFormData("brief", e.target.value)}
                    className={`min-h-[200px] ${
                      errors.brief ? "border-[hsl(var(--destructive))]" : ""
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {errors.brief && (
                        <p className="text-sm text-[hsl(var(--destructive))]">
                          {errors.brief}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {formData.brief.length} / 50 minimum
                    </p>
                  </div>
                </div>

                <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm">
                    Tips for a great brief:
                  </h4>
                  <ul className="text-sm text-[hsl(var(--muted-foreground))] space-y-1">
                    <li>• Clearly state your campaign objectives</li>
                    <li>• Include key messages and brand guidelines</li>
                    <li>• Mention any dos and don&apos;ts</li>
                    <li>• Share your target audience demographics</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget">Campaign Budget *</Label>
                    <Badge variant="secondary" className="text-lg font-semibold">
                      ${formData.budget.toLocaleString('en-US')}
                    </Badge>
                  </div>
                  <Slider
                    id="budget"
                    min={500}
                    max={50000}
                    step={500}
                    value={[formData.budget]}
                    onValueChange={(value) => updateFormData("budget", value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
                    <span>$500</span>
                    <span>$50,000</span>
                  </div>
                  {errors.budget && (
                    <p className="text-sm text-[hsl(var(--destructive))]">
                      {errors.budget}
                    </p>
                  )}
                </div>

                <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-sm">
                    Budget Breakdown (Estimated)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Creator Fees (70%)
                      </span>
                      <span className="font-medium">
                        ${Number((formData.budget * 0.7).toFixed(0)).toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Platform Fee (15%)
                      </span>
                      <span className="font-medium">
                        ${Number((formData.budget * 0.15).toFixed(0)).toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Ad Spend (15%)
                      </span>
                      <span className="font-medium">
                        ${Number((formData.budget * 0.15).toFixed(0)).toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[hsl(var(--border))] flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${formData.budget.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Target Audience */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="geography">Target Geography *</Label>
                  <Select
                    value={formData.geography}
                    onValueChange={(value) => updateFormData("geography", value)}
                  >
                    <SelectTrigger
                      className={
                        errors.geography ? "border-[hsl(var(--destructive))]" : ""
                      }
                    >
                      <SelectValue placeholder="Select target region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.geography && (
                    <p className="text-sm text-[hsl(var(--destructive))]">
                      {errors.geography}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche">Content Niche *</Label>
                  <Select
                    value={formData.niche}
                    onValueChange={(value) => updateFormData("niche", value)}
                  >
                    <SelectTrigger
                      className={
                        errors.niche ? "border-[hsl(var(--destructive))]" : ""
                      }
                    >
                      <SelectValue placeholder="Select content niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="fitness">Health & Fitness</SelectItem>
                      <SelectItem value="food">Food & Cooking</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.niche && (
                    <p className="text-sm text-[hsl(var(--destructive))]">
                      {errors.niche}
                    </p>
                  )}
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Choose the content category that best fits your campaign
                  </p>
                </div>

                <div className="bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg p-4">
                  <div className="flex gap-2">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--foreground))] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[hsl(var(--foreground))] mb-1 text-sm">
                        AI Matching Ready
                      </h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Our AI will match you with creators who have proven success
                        in your selected geography and niche.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Campaign Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-[hsl(var(--muted-foreground))]">
                          Title:
                        </dt>
                        <dd className="font-medium text-right max-w-[60%]">
                          {formData.title}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[hsl(var(--muted-foreground))]">
                          Platform:
                        </dt>
                        <dd className="font-medium capitalize">
                          {formData.platform}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Brand Brief</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-wrap">
                      {formData.brief}
                    </p>
                  </div>

                  <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Budget & Targeting</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-[hsl(var(--muted-foreground))]">
                          Budget:
                        </dt>
                        <dd className="font-medium">
                          ${formData.budget.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[hsl(var(--muted-foreground))]">
                          Geography:
                        </dt>
                        <dd className="font-medium capitalize">
                          {formData.geography.replace("-", " ")}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[hsl(var(--muted-foreground))]">
                          Niche:
                        </dt>
                        <dd className="font-medium capitalize">{formData.niche}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg p-4">
                    <div className="flex gap-2">
                      <Check className="h-5 w-5 text-[hsl(var(--foreground))] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[hsl(var(--foreground))] mb-1 text-sm">
                          Ready to Launch
                        </h4>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          Your campaign will be submitted to our AI matching system.
                          You&apos;ll receive creator recommendations within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[hsl(var(--border))]">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Step {currentStep} of {STEPS.length}
              </div>

              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Campaign
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
