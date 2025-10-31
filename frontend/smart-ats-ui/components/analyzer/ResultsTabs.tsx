"use client"

import { useMemo } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { OverallScoreBadge } from "./OverallScoreBadge"
import { BeforeAfterComparison } from "./BeforeAfterComparison"
import { SkillHeatmap } from "@/components/visualizations/SkillHeatmap"
import { KeywordCloud } from "@/components/visualizations/KeywordCloud"
import { RoleFitRadar } from "@/components/visualizations/RoleFitRadar"
import type { AnalyzerResults } from "./types"

interface ResultsTabsProps {
  results: AnalyzerResults
}

export function ResultsTabs({ results }: ResultsTabsProps) {
  const availableTabs = useMemo(() => {
    const tabs: { id: string; label: string; hidden?: boolean }[] = [
      { id: "overview", label: "Overview" },
      { id: "ats", label: "ATS Check", hidden: !results.ats },
      { id: "skills", label: "Skill Gap", hidden: !results.skillGap },
      { id: "role-fit", label: "Role Fit", hidden: !results.roleFit },
      { id: "achievements", label: "Achievements", hidden: !results.achievements },
      { id: "rewrite", label: "Rewrite", hidden: !results.rewrite },
      { id: "cover-letter", label: "Cover Letter", hidden: !results.coverLetter },
      { id: "optimization", label: "Optimization", hidden: !results.optimization },
      { id: "visualizations", label: "Visualizations", hidden: !results.visualizations },
      { id: "career", label: "Career Path", hidden: !results.careerPath },
      { id: "market", label: "Job Market", hidden: !results.jobMarket },
      { id: "interview", label: "Interview", hidden: !results.interview },
      { id: "progress", label: "Progress", hidden: !results.progress },
      { id: "salary", label: "Salary", hidden: !results.salary },
      { id: "portfolio", label: "Portfolio", hidden: !results.portfolio },
    ]

    return tabs.filter((tab) => !tab.hidden)
  }, [results])

  return (
    <Tabs defaultValue={availableTabs[0]?.id ?? "overview"} className="space-y-6">
      <TabsList className="flex flex-wrap gap-2 bg-muted/50 p-1">
        {availableTabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="capitalize">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <OverallScoreBadge results={results} />
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {results.ats?.profile_summary && (
              <div>
                <h4 className="text-sm font-semibold mb-2">ATS Summary</h4>
                <p className="text-sm text-muted-foreground">{results.ats.profile_summary}</p>
              </div>
            )}
            {results.roleFit?.insights && results.roleFit.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Role Fit Insights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {results.roleFit.insights.map((insight) => (
                    <li key={insight}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ats">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              ATS Compatibility
              {results.ats?.jd_match && (
                <Badge variant="secondary">Match: {results.ats.jd_match}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {results.ats?.missing_keywords?.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold mb-2">Missing Hard Skills</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {results.skillGap?.missing_hard_skills?.map((skill) => (
                  <li key={skill}>• {skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Missing Soft Skills</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {results.skillGap?.missing_soft_skills?.map((skill) => (
                  <li key={skill}>• {skill}</li>
                ))}
              </ul>
            </div>
            {results.skillGap?.course_recommendations && results.skillGap.course_recommendations.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold mb-2">Recommended Courses</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {results.skillGap.course_recommendations.map((course) => (
                    <li key={course.name}>
                      <span className="font-medium">{course.name}</span> — {course.provider}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="role-fit">
        <Card>
          <CardHeader>
            <CardTitle>Role Fit Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Metric label="Overall Fit" value={results.roleFit?.overall_fit} />
            <Metric label="Skill Alignment" value={results.roleFit?.skill_alignment} />
            <Metric label="Experience Alignment" value={results.roleFit?.experience_alignment} />
            <Metric label="Growth Potential" value={results.roleFit?.growth_potential} />
            {results.roleFit?.insights && results.roleFit.insights.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold mb-2">Insights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {results.roleFit.insights.map((insight) => (
                    <li key={insight}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="achievements">
        <Card>
          <CardHeader>
            <CardTitle>Achievement Quantifier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {results.achievements?.quantified_bullets?.map((bullet) => (
              <p key={bullet} className="rounded-md bg-muted/50 px-3 py-2">
                {bullet}
              </p>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rewrite" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resume Rewrite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                View rewritten resume
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="bg-muted/40 rounded-lg p-4 text-xs whitespace-pre-wrap">
                  {results.rewrite?.rewritten_resume}
                </pre>
              </CollapsibleContent>
            </Collapsible>
            <div>
              <h4 className="text-sm font-semibold mb-2">Key Adjustments</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {results.rewrite?.key_adjustments?.map((adjustment) => (
                  <li key={adjustment}>• {adjustment}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <BeforeAfterComparison
          originalText={results.achievements?.quantified_bullets?.join("\n")}
          rewrittenText={results.rewrite?.rewritten_resume}
        />
      </TabsContent>

      <TabsContent value="visualizations">
        <Card>
          <CardHeader>
            <CardTitle>Skill Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillHeatmap data={results.visualizations?.skill_heatmap} />
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Keyword Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordCloud data={results.visualizations?.keyword_cloud} />
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Role Fit Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleFitRadar
              data={results.roleFit
                ? [
                    { dimension: "Overall", score: Number(results.roleFit.overall_fit?.replace(/[^0-9.]/g, "")) || 0 },
                    { dimension: "Skills", score: Number(results.roleFit.skill_alignment?.replace(/[^0-9.]/g, "")) || 0 },
                    { dimension: "Experience", score: Number(results.roleFit.experience_alignment?.replace(/[^0-9.]/g, "")) || 0 },
                    { dimension: "Growth", score: Number(results.roleFit.growth_potential?.replace(/[^0-9.]/g, "")) || 0 },
                  ]
                : undefined}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Additional tabs can be filled similarly */}
    </Tabs>
  )
}

function Metric({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}
