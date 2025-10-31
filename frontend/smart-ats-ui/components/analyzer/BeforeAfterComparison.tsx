"use client"

import { useMemo } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BeforeAfterComparisonProps {
  originalText?: string
  rewrittenText?: string
}

export function BeforeAfterComparison({ originalText, rewrittenText }: BeforeAfterComparisonProps) {
  const hasData = useMemo(() => Boolean(originalText || rewrittenText), [originalText, rewrittenText])

  if (!hasData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Comparison</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Original</p>
          <pre className="h-64 overflow-y-auto rounded-md bg-muted/50 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {originalText || "Paste resume text in Step 1 to enable before/after comparison."}
          </pre>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Rewritten</p>
          <pre className="h-64 overflow-y-auto rounded-md bg-primary/5 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {rewrittenText || "Run the rewrite module to generate AI-enhanced content."}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
