"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Sparkles, Loader2, FileText, Target, Wand2, BarChart3, Briefcase, Download, RefreshCcw } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

type ATSResponse = {
  jd_match: string
  missing_keywords: string[]
  profile_summary: string
}

type RewriteResponse = {
  rewritten_resume: string
  key_adjustments: string[]
  keyword_alignment_score: string
}

type SkillGapResponse = {
  missing_hard_skills?: string[]
  missing_soft_skills?: string[]
  course_recommendations?: { name: string; provider: string; url: string }[]
}

type RoleFitResponse = {
  overall_fit?: string
  skill_alignment?: string
  experience_alignment?: string
  growth_potential?: string
  insights?: string[]
}

type CoverLetterResponse = {
  cover_letter: string
  talking_points: string[]
}

type OptimizationResponse = {
  optimized_summary: string
  priority_edits: string[]
  keyword_matches: string[]
}

type JobAlertsResponse = {
  job_alerts?: {
    company: string
    title: string
    match_score: string
    reasoning: string
    apply_link_placeholder: string
  }[]
}

type VisualizationResponse = {
  skill_heatmap?: { skill: string; proficiency: string; demand: string }[]
  keyword_cloud?: { keyword: string; frequency: number }[]
  progress_tracker?: { milestone: string; status: string; impact: string }[]
}

type ProgressTrackerResponse = {
  progress_score?: string
  milestones_achieved?: string[]
  next_milestones?: string[]
  skill_development_plan?: { skill: string; priority: string; timeline: string }[]
  career_trajectory_summary?: string
}

const DEFAULT_TONE = "Professional"

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [focusRole, setFocusRole] = useState("")
  const [tone, setTone] = useState(DEFAULT_TONE)
  const [candidateName, setCandidateName] = useState("Candidate")
  const [targetRole, setTargetRole] = useState("")
  const [location, setLocation] = useState("")
  const [experienceYears, setExperienceYears] = useState("3")
  const [certifications, setCertifications] = useState("")
  const [skillsAcquired, setSkillsAcquired] = useState("")
  const [jobApplications, setJobApplications] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [atsResult, setAtsResult] = useState<ATSResponse | null>(null)
  const [rewriteResult, setRewriteResult] = useState<RewriteResponse | null>(null)
  const [skillGapResult, setSkillGapResult] = useState<SkillGapResponse | null>(null)
  const [roleFitResult, setRoleFitResult] = useState<RoleFitResponse | null>(null)
  const [achievementResult, setAchievementResult] = useState<{ quantified_bullets?: string[]; methodology_notes?: string[] } | null>(
    null,
  )
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResponse | null>(null)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResponse | null>(null)
  const [jobAlertsResult, setJobAlertsResult] = useState<JobAlertsResponse | null>(null)
  const [visualizationResult, setVisualizationResult] = useState<VisualizationResponse | null>(null)
  const [careerPathResult, setCareerPathResult] = useState<{ recommended_roles?: any[]; upskilling_paths?: string[]; long_term_projection?: string } | null>(null)
  const [jobMarketResult, setJobMarketResult] = useState<{ demand_level?: string; top_skills?: string[]; emerging_roles?: string[]; market_commentary?: string } | null>(
    null,
  )
  const [interviewResult, setInterviewResult] = useState<{ behavioral_questions?: string[]; technical_questions?: string[]; prep_tips?: string[] } | null>(
    null,
  )
  const [salaryResult, setSalaryResult] = useState<{ median_salary?: string; percentile_25?: string; percentile_75?: string; data_sources?: string[] } | null>(
    null,
  )
  const [portfolioResult, setPortfolioResult] = useState<{ site_structure?: any; highlight_projects?: string[]; call_to_actions?: string[] } | null>(null)
  const [progressResult, setProgressResult] = useState<ProgressTrackerResponse | null>(null)

  const parsedCertifications = useMemo(
    () =>
      certifications
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [certifications],
  )

  const parsedSkills = useMemo(
    () =>
      skillsAcquired
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [skillsAcquired],
  )

  const parsedJobApplications = useMemo(
    () =>
      jobApplications
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [company = "", role = "", status = "pending"] = line.split("|").map((item) => item.trim())
          return { company, role, status }
        }),
    [jobApplications],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    setError(null)
    if (!jobDescription) {
      setError("Please provide a job description to begin analysis.")
      return
    }

    if (!resumeFile && !resumeText) {
      setError("Please upload a resume PDF or paste your resume text.")
      return
    }

    setLoading(true)

    try {
      const headers = {
        "Content-Type": "application/json",
      }

      if (resumeFile) {
        const formData = new FormData()
        formData.append("job_description", jobDescription)
        formData.append("resume", resumeFile)

        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to analyze resume PDF")
        }

        const data = (await response.json()) as ATSResponse
        setAtsResult(data)
      } else {
        setAtsResult(null)
      }

      if (resumeText) {
        const resumePayload = {
          resume_text: resumeText,
          job_description: jobDescription,
        }

        const [skillGap, roleFit, achievements, rewrite, coverLetter, optimization, visualization, careerPath, interview] =
          await Promise.all([
            fetch(`${API_BASE_URL}/resume/skill-gap`, {
              method: "POST",
              headers,
              body: JSON.stringify(resumePayload),
            }),
            fetch(`${API_BASE_URL}/resume/role-fit`, {
              method: "POST",
              headers,
              body: JSON.stringify(resumePayload),
            }),
            fetch(`${API_BASE_URL}/resume/achievements`, {
              method: "POST",
              headers,
              body: JSON.stringify({ resume_text: resumeText }),
            }),
            fetch(`${API_BASE_URL}/resume/rewrite`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                ...resumePayload,
                tone,
                focus_role: focusRole || targetRole || "Target Role",
              }),
            }),
            fetch(`${API_BASE_URL}/resume/cover-letter`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                ...resumePayload,
                applicant_context: {
                  name: candidateName || "Candidate",
                  focus_role: focusRole || targetRole || "Target Role",
                  tone,
                },
              }),
            }),
            fetch(`${API_BASE_URL}/jobs/one-click-optimize`, {
              method: "POST",
              headers,
              body: JSON.stringify(resumePayload),
            }),
            fetch(`${API_BASE_URL}/visualizations/summary`, {
              method: "POST",
              headers,
              body: JSON.stringify(resumePayload),
            }),
            fetch(`${API_BASE_URL}/career/path`, {
              method: "POST",
              headers,
              body: JSON.stringify({ resume_text: resumeText }),
            }),
            fetch(`${API_BASE_URL}/interview/readiness`, {
              method: "POST",
              headers,
              body: JSON.stringify(resumePayload),
            }),
          ])

        const parseJson = async (response: Response) => {
          if (!response.ok) {
            const detail = await response.text()
            throw new Error(detail || response.statusText)
          }
          return response.json()
        }

        setSkillGapResult(await parseJson(skillGap))
        setRoleFitResult(await parseJson(roleFit))
        setAchievementResult(await parseJson(achievements))
        setRewriteResult(await parseJson(rewrite))
        setCoverLetterResult(await parseJson(coverLetter))
        setOptimizationResult(await parseJson(optimization))
        setVisualizationResult(await parseJson(visualization))
        setCareerPathResult(await parseJson(careerPath))
        setInterviewResult(await parseJson(interview))
      }

      if (resumeText && (targetRole || focusRole) && location) {
        const alertsPromise = fetch(`${API_BASE_URL}/jobs/alerts`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            resume_text: resumeText,
            target_role: targetRole || focusRole,
            location,
          }),
        })

        const marketPromise = fetch(`${API_BASE_URL}/career/job-market`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            target_role: targetRole || focusRole,
            location,
          }),
        })

        const [alertsResponse, marketResponse] = await Promise.all([alertsPromise, marketPromise])

        if (alertsResponse.ok) {
          setJobAlertsResult(await alertsResponse.json())
        } else {
          setJobAlertsResult(null)
        }

        if (marketResponse.ok) {
          setJobMarketResult(await marketResponse.json())
        } else {
          setJobMarketResult(null)
        }
      }

      if (resumeText) {
        const portfolioPromise = fetch(`${API_BASE_URL}/portfolio/generate`, {
          method: "POST",
          headers,
          body: JSON.stringify({ resume_text: resumeText }),
        })

        if (portfolioPromise) {
          const portfolioResponse = await portfolioPromise
          if (portfolioResponse.ok) {
            setPortfolioResult(await portfolioResponse.json())
          }
        }
      }

      if (resumeText && parsedSkills.length > 0) {
        const progressResponse = await fetch(`${API_BASE_URL}/career/progress-tracker`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            certifications: parsedCertifications,
            skills_acquired: parsedSkills,
            job_applications: parsedJobApplications,
          }),
        })

        if (progressResponse.ok) {
          setProgressResult(await progressResponse.json())
        }
      }

      if (targetRole && location && experienceYears) {
        const salaryResponse = await fetch(`${API_BASE_URL}/salary/benchmark`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            role: targetRole,
            location,
            experience_years: Number.parseFloat(experienceYears) || 3,
          }),
        })

        if (salaryResponse.ok) {
          setSalaryResult(await salaryResponse.json())
        }
      }

      setError(null)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">AI Career Copilot Workspace</h2>
          <p className="text-muted-foreground text-lg">
            Connect your resume, target role, and goals to unlock a full suite of AI-driven guidance. Upload your resume
            or paste the text, personalize your objectives, and let the Copilot orchestrate the insights.
          </p>
        </div>

        {error && (
          <Card className="border-destructive/60 bg-destructive/5">
            <CardContent className="py-4 text-sm text-destructive-foreground">{error}</CardContent>
          </Card>
        )}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste the full job description for the role you want to target.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume Input</CardTitle>
            <CardDescription>Upload a PDF or paste raw text for enhanced AI analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="text">Paste Resume Text</TabsTrigger>
                <TabsTrigger value="upload">Upload PDF</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-4">
                <Textarea
                  placeholder="Paste your resume text here to power rewriting, cover letters, skill gap analysis, and more."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Use a plain text export of your resume for best results. PDF upload is available in the next tab for
                  ATS scoring.
                </p>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <Label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors text-center">
                    <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">{resumeFile ? resumeFile.name : "Click to upload or drag and drop"}</p>
                    <p className="text-xs text-muted-foreground">PDF files only (max 10MB)</p>
                  </div>
                  <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  The PDF is used for ATS compatibility scoring. Combine with pasted resume text to unlock the full suite of
                  AI features.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Persona & Career Context</CardTitle>
            <CardDescription>Describe the persona AI should embody and the markets you want to target.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input
                id="candidate-name"
                placeholder="Jane Candidate"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus-role">Focus Role / Desired Title</Label>
              <Input
                id="focus-role"
                placeholder="Senior Data Scientist"
                value={focusRole}
                onChange={(e) => setFocusRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Resume & Cover Letter Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value)}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="Confident">Confident</SelectItem>
                  <SelectItem value="Impactful">Impactful</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-role">Target Role for Job Market & Alerts</Label>
              <Input
                id="target-role"
                placeholder="AI Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Input
                id="location"
                placeholder="Remote, USA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Career Progress Inputs</CardTitle>
            <CardDescription>Optional context to supercharge the progress tracker and recruiter API insights.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="certifications">Certifications (one per line)</Label>
              <Textarea
                id="certifications"
                placeholder="AWS Certified Solutions Architect\nGoogle Cloud Professional"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="skills">Skills & Courses Completed (one per line)</Label>
              <Textarea
                id="skills"
                placeholder="LangChain Bootcamp\nAdvanced SQL Workshop"
                value={skillsAcquired}
                onChange={(e) => setSkillsAcquired(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="applications">Recent Job Applications (Company | Role | Status)</Label>
              <Textarea
                id="applications"
                placeholder="AI Labs | Senior ML Engineer | interview\nFinTechX | Lead Data Scientist | offer"
                value={jobApplications}
                onChange={(e) => setJobApplications(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        <Button size="lg" onClick={handleAnalyze} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Orchestrating AI Copilot Insights...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Run Full Copilot Analysis
            </>
          )}
        </Button>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <ResultsSection
          title="ATS Compatibility & Resume Intelligence"
          description="Review how your resume stacks up today and get instant rewrites, quantified achievements, and optimization tactics."
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {atsResult && (
              <ResultCard title="ATS Match Overview" icon={<Target className="h-5 w-5 text-primary" />}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    Match Score
                    <Badge variant="secondary">{atsResult.jd_match}</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Profile Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{atsResult.profile_summary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Missing Keywords</h4>
                    <KeywordList keywords={atsResult.missing_keywords} />
                  </div>
                </div>
              </ResultCard>
            )}

            {rewriteResult && (
              <ResultCard title="Recommended Resume Rewrite" icon={<Wand2 className="h-5 w-5 text-accent" />}>
                <div className="space-y-4">
                  <Badge variant="outline">Keyword Alignment: {rewriteResult.keyword_alignment_score}</Badge>
                  <Collapsible>
                    <CollapsibleTrigger className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      View Rewritten Resume
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="bg-muted/50 rounded-lg p-4 text-xs whitespace-pre-wrap">
                        {rewriteResult.rewritten_resume}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Key Adjustments</h4>
                    <KeywordList keywords={rewriteResult.key_adjustments} />
                  </div>
                </div>
              </ResultCard>
            )}

            {skillGapResult && (
              <ResultCard title="Skill Gap Analysis" icon={<BarChart3 className="h-5 w-5 text-secondary" />}>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Missing Hard Skills</h4>
                    <KeywordList keywords={skillGapResult.missing_hard_skills} placeholder="None detected" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Missing Soft Skills</h4>
                    <KeywordList keywords={skillGapResult.missing_soft_skills} placeholder="None detected" />
                  </div>
                  {skillGapResult.course_recommendations && skillGapResult.course_recommendations.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">Suggested Courses</h4>
                      <div className="space-y-2">
                        {skillGapResult.course_recommendations.map((course) => (
                          <div key={`${course.name}-${course.provider}`} className="text-sm">
                            <p className="font-medium">{course.name}</p>
                            <p className="text-muted-foreground">
                              {course.provider} — <a className="underline" href={course.url} target="_blank" rel="noreferrer">View course</a>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {roleFitResult && (
              <ResultCard title="Role Fit Breakdown" icon={<Target className="h-5 w-5 text-primary" />}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Overall Fit" value={roleFitResult.overall_fit} />
                  <Metric label="Skill Alignment" value={roleFitResult.skill_alignment} />
                  <Metric label="Experience Alignment" value={roleFitResult.experience_alignment} />
                  <Metric label="Growth Potential" value={roleFitResult.growth_potential} />
                  {roleFitResult.insights && roleFitResult.insights.length > 0 && (
                    <div className="col-span-2">
                      <h4 className="font-semibold text-sm mb-1">Key Insights</h4>
                      <KeywordList keywords={roleFitResult.insights} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {achievementResult && achievementResult.quantified_bullets && (
              <ResultCard title="Achievement Quantifier" icon={<FileText className="h-5 w-5 text-secondary" />}>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Enhanced Bullet Points</h4>
                  <KeywordList keywords={achievementResult.quantified_bullets} />
                  {achievementResult.methodology_notes && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Assumptions</h4>
                      <KeywordList keywords={achievementResult.methodology_notes} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {coverLetterResult && (
              <ResultCard title="Cover Letter Draft" icon={<Wand2 className="h-5 w-5 text-accent" />}>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    View suggested cover letter
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted/50 rounded-lg p-4 text-xs whitespace-pre-wrap">
                      {coverLetterResult.cover_letter}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-1">Talking Points</h4>
                  <KeywordList keywords={coverLetterResult.talking_points} />
                </div>
              </ResultCard>
            )}

            {optimizationResult && (
              <ResultCard title="One-Click Optimization" icon={<Sparkles className="h-5 w-5 text-amber-500" />}>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{optimizationResult.optimized_summary}</p>
                  <div>
                    <h4 className="font-semibold mb-1">Priority Edits</h4>
                    <KeywordList keywords={optimizationResult.priority_edits} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Keyword Matches</h4>
                    <KeywordList keywords={optimizationResult.keyword_matches} />
                  </div>
                </div>
              </ResultCard>
            )}
          </div>
        </ResultsSection>

        <ResultsSection
          title="Market Alignment & Job Strategy"
          description="Discover where you stand in the market, what roles to pursue next, and which openings match 90%+."
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {careerPathResult && (
              <ResultCard title="Career Path Forecast" icon={<Briefcase className="h-5 w-5 text-primary" />}>
                <div className="space-y-3 text-sm">
                  {careerPathResult.long_term_projection && (
                    <p className="text-muted-foreground">{careerPathResult.long_term_projection}</p>
                  )}
                  {careerPathResult.recommended_roles && careerPathResult.recommended_roles.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Recommended Next Roles</h4>
                      <ul className="space-y-2 text-sm">
                        {careerPathResult.recommended_roles.map((role) => (
                          <li key={role.title} className="rounded-lg border border-border p-3">
                            <div className="font-medium">{role.title}</div>
                            <div className="text-xs text-muted-foreground">Salary: {role.salary_range}</div>
                            <div className="text-xs text-muted-foreground">Confidence: {role.confidence}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {careerPathResult.upskilling_paths && careerPathResult.upskilling_paths.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Upskilling Paths</h4>
                      <KeywordList keywords={careerPathResult.upskilling_paths} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {jobMarketResult && (
              <ResultCard title="Job Market Insights" icon={<BarChart3 className="h-5 w-5 text-secondary" />}>
                <div className="space-y-3 text-sm">
                  {jobMarketResult.demand_level && (
                    <Badge variant="outline">Demand Level: {jobMarketResult.demand_level}</Badge>
                  )}
                  {jobMarketResult.market_commentary && (
                    <p className="text-muted-foreground">{jobMarketResult.market_commentary}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Top Skills</h4>
                      <KeywordList keywords={jobMarketResult.top_skills} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Emerging Roles</h4>
                      <KeywordList keywords={jobMarketResult.emerging_roles} />
                    </div>
                  </div>
                </div>
              </ResultCard>
            )}

            {jobAlertsResult && jobAlertsResult.job_alerts && jobAlertsResult.job_alerts.length > 0 && (
              <ResultCard title="AI Job Alerts (90%+ Match)" icon={<Target className="h-5 w-5 text-primary" />}>
                <div className="space-y-3">
                  {jobAlertsResult.job_alerts.map((alert) => (
                    <div key={`${alert.company}-${alert.title}`} className="border border-border rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">
                          {alert.title} @ {alert.company}
                        </span>
                        <Badge variant="secondary">{alert.match_score}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{alert.reasoning}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {salaryResult && (
              <ResultCard title="Salary Benchmarking" icon={<BarChart3 className="h-5 w-5 text-secondary" />}>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <Metric label="Median" value={salaryResult.median_salary} />
                  <Metric label="25th Percentile" value={salaryResult.percentile_25} />
                  <Metric label="75th Percentile" value={salaryResult.percentile_75} />
                  {salaryResult.data_sources && salaryResult.data_sources.length > 0 && (
                    <div className="col-span-3">
                      <h4 className="font-semibold text-sm mb-1">Data Sources</h4>
                      <KeywordList keywords={salaryResult.data_sources} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}
          </div>
        </ResultsSection>

        <ResultsSection
          title="Portfolio, Interviews & Progress"
          description="Translate insights into action: build a standout portfolio, prepare for interviews, and track your career momentum."
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {portfolioResult && (
              <ResultCard title="Portfolio Blueprint" icon={<Wand2 className="h-5 w-5 text-accent" />}>
                <div className="space-y-3 text-sm">
                  {portfolioResult.site_structure && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Site Structure</h4>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(portfolioResult.site_structure, null, 2)}
                      </pre>
                    </div>
                  )}
                  {portfolioResult.highlight_projects && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Highlight Projects</h4>
                      <KeywordList keywords={portfolioResult.highlight_projects} />
                    </div>
                  )}
                  {portfolioResult.call_to_actions && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Calls to Action</h4>
                      <KeywordList keywords={portfolioResult.call_to_actions} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {interviewResult && (
              <ResultCard title="Interview Readiness" icon={<Target className="h-5 w-5 text-primary" />}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {interviewResult.behavioral_questions && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Behavioral Questions</h4>
                      <KeywordList keywords={interviewResult.behavioral_questions} />
                    </div>
                  )}
                  {interviewResult.technical_questions && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Technical Questions</h4>
                      <KeywordList keywords={interviewResult.technical_questions} />
                    </div>
                  )}
                  {interviewResult.prep_tips && (
                    <div className="col-span-2">
                      <h4 className="font-semibold text-sm mb-1">Prep Tips</h4>
                      <KeywordList keywords={interviewResult.prep_tips} />
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {visualizationResult && (
              <ResultCard title="Visualization Data" icon={<BarChart3 className="h-5 w-5 text-secondary" />}>
                <div className="space-y-3 text-sm">
                  {visualizationResult.skill_heatmap && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Skill Heatmap</h4>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(visualizationResult.skill_heatmap, null, 2)}
                      </pre>
                    </div>
                  )}
                  {visualizationResult.keyword_cloud && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Keyword Cloud</h4>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(visualizationResult.keyword_cloud, null, 2)}
                      </pre>
                    </div>
                  )}
                  {visualizationResult.progress_tracker && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Progress Tracker Data</h4>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(visualizationResult.progress_tracker, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {progressResult && (
              <ResultCard title="Career Progress Tracker" icon={<Sparkles className="h-5 w-5 text-primary" />}>
                <div className="space-y-3 text-sm">
                  {progressResult.progress_score && (
                    <Badge variant="outline">Progress Score: {progressResult.progress_score}</Badge>
                  )}
                  {progressResult.career_trajectory_summary && (
                    <p className="text-muted-foreground">{progressResult.career_trajectory_summary}</p>
                  )}
                  {progressResult.milestones_achieved && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Milestones Achieved</h4>
                      <KeywordList keywords={progressResult.milestones_achieved} />
                    </div>
                  )}
                  {progressResult.next_milestones && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Next Milestones</h4>
                      <KeywordList keywords={progressResult.next_milestones} />
                    </div>
                  )}
                  {progressResult.skill_development_plan && progressResult.skill_development_plan.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Skill Development Plan</h4>
                      <pre className="bg-muted/50 rounded-lg p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(progressResult.skill_development_plan, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </ResultCard>
            )}
          </div>
        </ResultsSection>
      </div>
    </div>
  )
}

function ResultsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ResultCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        {icon && <span className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</span>}
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  )
}

function KeywordList({ keywords, placeholder }: { keywords?: string[]; placeholder?: string }) {
  if (!keywords || keywords.length === 0) {
    return <p className="text-xs text-muted-foreground italic">{placeholder || "No data"}</p>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge key={keyword} variant="outline" className="whitespace-normal text-xs px-2 py-1">
          {keyword}
        </Badge>
      ))}
    </div>
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
