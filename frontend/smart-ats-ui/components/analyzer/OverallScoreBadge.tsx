"use client"

import { useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { AnalyzerResults } from "./types"

interface OverallScoreBadgeProps {
  results: AnalyzerResults
}

function parsePercentage(value?: string | null) {
  if (!value) return null
  const match = String(value).match(/([0-9]{1,3})(%?)/)
  if (!match) return null
  const score = Number(match[1])
  if (Number.isNaN(score)) return null
  return Math.min(Math.max(score, 0), 100)
}

export function OverallScoreBadge({ results }: OverallScoreBadgeProps) {
  const overallScore = useMemo(() => {
    // Weighted calculation based on available modules
    const weights: Record<string, number> = {
      ats: 0.25,
      roleFit: 0.2,
      optimization: 0.15,
      skillGap: 0.15,
      achievements: 0.1,
      interview: 0.05,
      progress: 0.1,
    }

    const scores: { weight: number; score: number }[] = []

    const atsScore = parsePercentage(results.ats?.jd_match)
    if (atsScore !== null) {
      scores.push({ weight: weights.ats, score: atsScore })
    }

    const roleFitScore = parsePercentage(results.roleFit?.overall_fit)
    if (roleFitScore !== null) {
      scores.push({ weight: weights.roleFit, score: roleFitScore })
    }

    const optimizationScore = parsePercentage(results.optimization?.keyword_matches?.length
      ? `${Math.min(results.optimization.keyword_matches.length * 10, 100)}`
      : undefined)
    if (optimizationScore !== null) {
      scores.push({ weight: weights.optimization, score: optimizationScore })
    }

    const skillGapScore = parsePercentage(results.skillGap?.missing_hard_skills?.length
      ? `${100 - Math.min(results.skillGap.missing_hard_skills.length * 8, 100)}`
      : "85")
    if (skillGapScore !== null) {
      scores.push({ weight: weights.skillGap, score: skillGapScore })
    }

    const achievementsScore = parsePercentage(results.achievements?.quantified_bullets?.length
      ? `${Math.min(results.achievements.quantified_bullets.length * 20, 95)}`
      : "75")
    if (achievementsScore !== null) {
      scores.push({ weight: weights.achievements, score: achievementsScore })
    }

    const interviewScore = parsePercentage(results.interview?.prep_tips?.length
      ? `${Math.min(results.interview.prep_tips.length * 15, 90)}`
      : "70")
    if (interviewScore !== null) {
      scores.push({ weight: weights.interview, score: interviewScore })
    }

    const progressScore = parsePercentage(results.progress?.progress_score)
    if (progressScore !== null) {
      scores.push({ weight: weights.progress, score: progressScore })
    }

    if (scores.length === 0) return null

    const totalWeight = scores.reduce((acc, item) => acc + item.weight, 0)
    const weightedSum = scores.reduce((acc, item) => acc + item.score * item.weight, 0)

    return Math.round(weightedSum / totalWeight)
  }, [results])

  if (overallScore === null) {
    return null
  }

  const status = overallScore >= 80 ? "Great Match!" : overallScore >= 60 ? "Good Match" : "Needs Improvement"
  const badgeClass = cn(
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
    overallScore >= 80 && "bg-emerald-500/15 text-emerald-700",
    overallScore >= 60 && overallScore < 80 && "bg-amber-500/15 text-amber-700",
    overallScore < 60 && "bg-destructive/10 text-destructive"
  )

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl font-bold tracking-tight">{overallScore}</span>
          <div className="flex flex-col items-start">
            <span className={badgeClass}>{status}</span>
            <span className="text-xs text-muted-foreground">
              Overall match score across selected modules
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
