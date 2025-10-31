"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Loader2, Sparkles } from "lucide-react"

import { StepContainer } from "./StepContainer"
import type { AnalysisType } from "./types"

const STATUS_MESSAGES: Record<number, string> = {
  0: "Initializing analyzer pipeline...",
  20: "Parsing resume and job description...",
  35: "Running ATS compatibility checks...",
  50: "Generating AI rewrite and achievements...",
  70: "Analyzing skills, market, and salary data...",
  90: "Preparing visualizations and summaries...",
}

interface Step4ProcessingProps {
  selectedAnalyses: AnalysisType[]
  onPrev: () => void
  estimatedSeconds?: number
  progress?: number
  statusMessage?: string
}

export function Step4Processing({
  selectedAnalyses,
  onPrev,
  estimatedSeconds = 25,
  progress,
  statusMessage,
}: Step4ProcessingProps) {
  const normalizedProgress = typeof progress === "number" ? progress : 10
  const normalizedStatus = statusMessage
    ? statusMessage
    : STATUS_MESSAGES[
        Object.keys(STATUS_MESSAGES)
          .map((key) => Number(key))
          .sort((a, b) => a - b)
          .reduce((acc, key) => (normalizedProgress >= key ? key : acc), 0)
      ]

  return (
    <StepContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Analyzing your resume bundle</h3>
          <p className="text-sm text-muted-foreground">
            AI Career Copilot is orchestrating {selectedAnalyses.length} modules. This usually takes {estimatedSeconds} seconds. You
            can navigate back to adjust selections if needed.
          </p>
        </div>

        <Card className="border-border/80 bg-card">
          <CardContent className="space-y-4 py-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm font-medium">{normalizedStatus}</p>
            </div>
            <div className="space-y-2">
              <Progress value={normalizedProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Processing</span>
                <span>{Math.round(normalizedProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="bg-muted/40 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Modules in this run</CardTitle>
            <CardDescription>Selected analyses and insights being generated.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {selectedAnalyses.map((analysis) => (
              <span
                key={analysis}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {analysis}
              </span>
            ))}
            {selectedAnalyses.length === 0 && (
              <p className="text-xs text-muted-foreground">No modules selected.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" onClick={onPrev} className="sm:w-auto">
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Results will compile automatically when ready.</span>
          </div>
        </div>
      </div>
    </StepContainer>
  )
}
