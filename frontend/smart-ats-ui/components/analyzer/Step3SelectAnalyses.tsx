"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { AnalysisType } from "./types"
import { StepContainer } from "./StepContainer"

const ANALYSIS_OPTIONS: { id: AnalysisType; title: string; description: string }[] = [
  {
    id: "ats",
    title: "ATS Compatibility",
    description: "Simulate applicant tracking systems, highlight missing keywords, and surface formatting flags.",
  },
  {
    id: "skill-gap",
    title: "Skill Gap Analyzer",
    description: "Compare your skills against the job requirements and recommend targeted learning paths.",
  },
  {
    id: "role-fit",
    title: "Role Fit Score",
    description: "Score your experience, skills, and growth potential against the target role.",
  },
  {
    id: "achievements",
    title: "Achievement Quantifier",
    description: "Transform bullet points with metrics, impact verbs, and quantified outcomes.",
  },
  {
    id: "rewrite",
    title: "Resume Rewrite",
    description: "Generate a tailored resume variant aligned to tone and focus role preferences.",
  },
  {
    id: "cover-letter",
    title: "Cover Letter",
    description: "Draft a personalized cover letter with key talking points and structure.",
  },
  {
    id: "optimization",
    title: "One-Click Optimization",
    description: "Receive prioritized edits and keyword matches to increase compatibility.",
  },
  {
    id: "visualizations",
    title: "Visualization Suite",
    description: "Generate skill heatmaps, keyword clouds, and progress trackers.",
  },
  {
    id: "career-path",
    title: "Career Path Forecast",
    description: "Explore next-step roles, confidence scores, and upskilling recommendations.",
  },
  {
    id: "job-market",
    title: "Job Market Insights",
    description: "Review demand levels, emerging roles, and top skills for your target market.",
  },
  {
    id: "portfolio",
    title: "Portfolio Blueprint",
    description: "Generate a portfolio structure with highlight projects and calls to action.",
  },
  {
    id: "interview",
    title: "Interview Readiness",
    description: "Get behavioral and technical questions, along with tailored prep tips.",
  },
  {
    id: "progress",
    title: "Career Progress Tracker",
    description: "Measure progress score, milestones achieved, and next steps for growth.",
  },
  {
    id: "salary",
    title: "Salary Benchmark",
    description: "Compare compensation bands across percentiles for your target role and location.",
  },
]

interface Step3SelectAnalysesProps {
  selectedAnalyses: AnalysisType[]
  onSelectedAnalysesChange: (analyses: AnalysisType[]) => void
  onPrev: () => void
  onNext: () => void
}

export function Step3SelectAnalyses({
  selectedAnalyses,
  onSelectedAnalysesChange,
  onPrev,
  onNext,
}: Step3SelectAnalysesProps) {
  const isAllSelected = selectedAnalyses.length === ANALYSIS_OPTIONS.length

  const toggleAnalysis = (id: AnalysisType, checked: boolean) => {
    if (checked) {
      onSelectedAnalysesChange(Array.from(new Set([...selectedAnalyses, id])))
    } else {
      onSelectedAnalysesChange(selectedAnalyses.filter((analysis) => analysis !== id))
    }
  }

  const quickPickLabels = useMemo(() => {
    const picks: { label: string; analyses: AnalysisType[] }[] = [
      {
        label: "Analyze Everything",
        analyses: ANALYSIS_OPTIONS.map((option) => option.id),
      },
      {
        label: "ATS Essentials",
        analyses: ["ats", "skill-gap", "role-fit", "optimization"],
      },
      {
        label: "Career Growth",
        analyses: ["career-path", "job-market", "progress", "salary"],
      },
    ]

    return picks
  }, [])

  const handleQuickSelect = (analyses: AnalysisType[]) => {
    onSelectedAnalysesChange(Array.from(new Set(analyses)))
  }

  return (
    <StepContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Choose the analysis tracks for this run</h3>
          <p className="text-sm text-muted-foreground">
            Pick specific analysis types or run the full suite. You can toggle individual modules or use the quick pick shortcuts below.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPickLabels.map((quickPick) => (
            <Button
              key={quickPick.label}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleQuickSelect(quickPick.analyses)}
            >
              {quickPick.label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onSelectedAnalysesChange([])}
          >
            Clear Selections
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ANALYSIS_OPTIONS.map((option) => {
            const checked = selectedAnalyses.includes(option.id)

            return (
              <Card key={option.id} className={checked ? "border-primary/60 bg-primary/5" : undefined}>
                <CardHeader className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={option.id}
                      checked={checked}
                      onCheckedChange={(value) => toggleAnalysis(option.id, Boolean(value))}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor={option.id} className="font-semibold">
                        {option.title}
                      </Label>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" onClick={onPrev} className="sm:w-auto">
            Back
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
            <span>{selectedAnalyses.length} modules selected</span>
            <Button size="lg" onClick={onNext} disabled={selectedAnalyses.length === 0} className="sm:w-auto">
              Start Analysis
            </Button>
          </div>
        </div>
      </div>
    </StepContainer>
  )
}
