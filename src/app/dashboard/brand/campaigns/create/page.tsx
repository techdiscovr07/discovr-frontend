"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createBrandCampaign, getErrorMessage } from "@/lib/api"
import { getBrandAuthToken } from "@/lib/auth"
import { toast } from "sonner"

const extractCampaignId = (payload: Record<string, unknown>) => {
  return (
    (payload.id as string) ||
    (payload.campaign_id as string) ||
    (payload.campaignId as string) ||
    (payload.data as { id?: string } | undefined)?.id ||
    ""
  )
}

export default function BrandCampaignCreatePage() {
  const router = useRouter()
  const [step] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [totalBudget, setTotalBudget] = useState("")
  const [cpv, setCpv] = useState("")
  const [creatorCount, setCreatorCount] = useState("")
  const [goLiveDate, setGoLiveDate] = useState("")


  const canSubmitStep1 = useMemo(
    () =>
      name.trim() &&
      description.trim() &&
      categories.length > 0 &&
      totalBudget.trim() &&
      cpv.trim() &&
      creatorCount.trim() &&
      goLiveDate.trim(),
    [name, description, categories, totalBudget, cpv, creatorCount, goLiveDate],
  )

  const handleAddCategory = () => {
    const value = categoryInput.trim()
    if (!value) return
    if (!categories.includes(value)) {
      setCategories((prev) => [...prev, value])
    }
    setCategoryInput("")
  }

  const handleRemoveCategory = (value: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== value))
  }

  const handleCreateCampaign = async () => {
    if (!canSubmitStep1) {
      setError("Fill in all campaign details before continuing.")
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      const token = getBrandAuthToken()
      if (!token) return
      const payload = await createBrandCampaign(token, {
        name: name.trim(),
        description: description.trim(),
        creator_categories: categories,
        total_budget: Number(totalBudget),
        cpv: Number(cpv),
        creator_count: Number(creatorCount),
        go_live_date: goLiveDate,
      })
      const id = extractCampaignId(payload)
      if (!id) {
        throw new Error("Campaign created but no ID returned.")
      }
      toast.success("Campaign created. Wait for creators to be finalized, then upload the brief from the campaign page.")
      router.push(`/dashboard/brand/campaigns/${id}`)
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Create Campaign</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Step {step} of 2
          </p>
        </div>
        <Link href="/dashboard/brand/campaigns">
          <Button variant="outline">Back to Campaigns</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))/0.08] p-3 text-sm text-[hsl(var(--destructive))]">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Spring Collection Launch"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the campaign goals and messaging."
              />
            </div>
            <div className="space-y-2">
              <Label>Creator categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  placeholder="Add a category"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleAddCategory()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total budget</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={totalBudget}
                  onChange={(event) => setTotalBudget(event.target.value)}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpv">CPV</Label>
                <Input
                  id="cpv"
                  type="number"
                  value={cpv}
                  onChange={(event) => setCpv(event.target.value)}
                  placeholder="0.50"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creatorCount">Creator count</Label>
                <Input
                  id="creatorCount"
                  type="number"
                  value={creatorCount}
                  onChange={(event) => setCreatorCount(event.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goLiveDate">Go live date</Label>
                <Input
                  id="goLiveDate"
                  type="date"
                  value={goLiveDate}
                  onChange={(event) => setGoLiveDate(event.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateCampaign} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
