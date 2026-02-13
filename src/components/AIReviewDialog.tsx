"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Sparkles, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type AICheck = {
  id: string
  label: string
  passed: boolean
  description?: string
}

type AIReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "script" | "video"
  content: {
    creator_name: string
    status: string
    updated_at: string
    cost: number
    script_content?: string
    video_url?: string
  }
  aiChecks: AICheck[]
  agentRecommendation: {
    approved: boolean
    message: string
  }
  onApprove: () => void
  onReject: (feedback: string) => void
  onRequestRevision: (feedback: string) => void
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

export function AIReviewDialog({
  open,
  onOpenChange,
  type,
  content,
  aiChecks,
  agentRecommendation,
  onApprove,
  onReject,
  onRequestRevision,
  onNavigatePrev,
  onNavigateNext,
  hasNext = false,
  hasPrev = false,
}: AIReviewDialogProps) {
  const [comment, setComment] = useState("")
  const [action, setAction] = useState<"approve" | "reject" | "request_revision" | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedChecks, setAnalyzedChecks] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)

  // Trigger analysis animation when dialog opens
  useEffect(() => {
    if (open) {
      setIsAnalyzing(true)
      setAnalyzedChecks(0)
      setShowResults(false)
      
      // Animate checks one by one
      const checkInterval = setInterval(() => {
        setAnalyzedChecks((prev) => {
          if (prev >= aiChecks.length) {
            clearInterval(checkInterval)
            return prev
          }
          return prev + 1
        })
      }, 1000) // Each check takes 500ms

      // Show final results after 2 seconds
      const resultsTimer = setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 5000)

      return () => {
        clearInterval(checkInterval)
        clearTimeout(resultsTimer)
      }
    }
  }, [open, aiChecks.length])

  const handleSubmit = () => {
    if (action === "approve") {
      onApprove()
    } else if (action === "reject") {
      onReject(comment)
    } else if (action === "request_revision") {
      onRequestRevision(comment)
    }
    setComment("")
    setAction(null)
  }

  const allChecksPassed = aiChecks.every((check) => check.passed)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Draft Review
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNavigatePrev}
                  disabled={!hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNavigateNext}
                  disabled={!hasNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setAction("approve")
                    onApprove()
                  }}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full">
              {/* Left: Content Preview & Info */}
              <div className="lg:col-span-2 space-y-4 overflow-y-auto">
                {/* Video or Script Preview */}
                <div className="rounded-lg border bg-card overflow-hidden">
                  {type === "video" && content.video_url ? (
                    <video
                      src={content.video_url}
                      controls
                      className="w-full aspect-video bg-black"
                    />
                  ) : (
                    <div className="p-6 bg-muted/30 max-h-[400px] overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {content.script_content || "No script content available"}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Creator</p>
                      <p className="font-medium">{content.creator_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {content.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Updated</p>
                      <p className="font-medium">
                        {new Date(content.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Cost</p>
                      <p className="font-medium">₹{content.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3">Comments</h3>
                  <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  {comment && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setAction("request_revision")
                          onRequestRevision(comment)
                          setComment("")
                        }}
                      >
                        Request Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setAction("reject")
                          onReject(comment)
                          setComment("")
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: AI Checks */}
              <div className="space-y-4 overflow-y-auto">
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3">Automated checks</h3>

                  {/* Loading State */}
                  {isAnalyzing && (
                    <>
                      {/* Analyzing Header */}
                      <div className="rounded-lg p-3 mb-4 bg-purple-50 border border-purple-200">
                        <div className="flex items-start gap-2">
                          <Loader2 className="h-5 w-5 text-purple-600 shrink-0 mt-0.5 animate-spin" />
                          <div className="flex-1">
                            <p className="font-medium text-sm text-purple-700 mb-1">
                              AI Analysis in Progress
                            </p>
                            <p className="text-xs text-purple-600/80">
                              Analyzing {type} content against brand guidelines...
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Animated Check List */}
                      <div className="space-y-2">
                        {aiChecks.map((check, index) => (
                          <div
                            key={check.id}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                              index < analyzedChecks
                                ? "bg-muted/30"
                                : "bg-muted/10 opacity-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {index < analyzedChecks ? (
                                <div className="rounded-full bg-green-100 p-1 animate-in zoom-in duration-200">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                              ) : index === analyzedChecks ? (
                                <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                              ) : (
                                <div className="rounded-full bg-gray-200 p-1 w-5 h-5" />
                              )}
                              <span className="text-sm font-medium">{check.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Results State */}
                  {showResults && (
                    <>
                      {/* Agent Recommendation */}
                      <div
                        className={`rounded-lg p-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-500 ${
                          agentRecommendation.approved
                            ? "bg-purple-50 border border-purple-200"
                            : "bg-yellow-50 border border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {agentRecommendation.approved ? (
                            <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm text-purple-700 mb-1">
                              Agent Recommendation
                            </p>
                            <p className="text-xs text-purple-600/80">
                              {agentRecommendation.message}
                            </p>
                          </div>
                          {agentRecommendation.approved && (
                            <span className="text-xs font-medium text-purple-600">
                              Approve draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Individual Checks */}
                      <div className="space-y-2">
                        {aiChecks.map((check, index) => (
                          <button
                            key={check.id}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group animate-in fade-in slide-in-from-bottom duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => {
                              // Could open a detail view for this check
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {check.passed ? (
                                <div className="rounded-full bg-green-100 p-1">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                              ) : (
                                <div className="rounded-full bg-red-100 p-1">
                                  <X className="h-3 w-3 text-red-600" />
                                </div>
                              )}
                              <span className="text-sm font-medium">{check.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
