"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, RefreshCcw, Wand2 } from "lucide-react"

import { OverallScoreBadge } from "./OverallScoreBadge"
import { ResultsTabs } from "./ResultsTabs"
import type { AnalyzerResults } from "./types"

interface Step5ResultsProps {
  results: AnalyzerResults
  onRestart: () => void
  onRewrite?: () => void
  onDownloadReport?: () => void
}

export function Step5Results({ results, onRestart, onRewrite, onDownloadReport }: Step5ResultsProps) {
  const hasResults = useMemo(() => Object.values(results).some(Boolean), [results])

  if (!hasResults) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No results yet</CardTitle>
          <CardDescription>Complete an analysis to view results.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRestart}>Start another analysis</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-muted/40">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Overall Summary</p>
              <OverallScoreBadge results={results} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" onClick={onDownloadReport} className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" onClick={onRewrite} className="gap-2">
                <Wand2 className="h-4 w-4" />
                Rewrite Resume
              </Button>
              <Button variant="ghost" onClick={onRestart} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Run Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <ResultsTabs results={results} />
    </div>
  )
}
