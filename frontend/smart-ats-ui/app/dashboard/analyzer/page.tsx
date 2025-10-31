"use client"

import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepIndicator } from "@/components/analyzer/StepIndicator"
import { Step1Upload } from "@/components/analyzer/Step1Upload"
import { Step2JobDescription } from "@/components/analyzer/Step2JobDescription"
import { Step3SelectAnalyses } from "@/components/analyzer/Step3SelectAnalyses"
import { Step4Processing } from "@/components/analyzer/Step4Processing"
import { Step5Results } from "@/components/analyzer/Step5Results"
import type { AnalysisType, AnalyzerResults, AnalyzerWizardData } from "@/components/analyzer/types"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCareerCopilotStore } from "@/store/useCareerCopilotStore"
import { useToast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const DEFAULT_TONE = "Professional"

const INITIAL_DATA: AnalyzerWizardData = {
  resumeFile: null,
  resumeText: "",
  jobDescription: "",
  focusRole: "",
  tone: DEFAULT_TONE,
  candidateName: "Candidate",
  targetRole: "",
  location: "",
  experienceYears: "3",
  certifications: [],
  skillsAcquired: [],
  jobApplications: [],
  selectedAnalyses: [],
}

export default function AnalyzerWizardPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<AnalyzerWizardData>(INITIAL_DATA)
  const [results, setResults] = useState<AnalyzerResults>({})
  const [isLoading, setIsLoading] = useState(false)
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const addAnalysisResult = useCareerCopilotStore((state) => state.addAnalysisResult)

  const isCompleted = useMemo(() => currentStep === 5, [currentStep])

  const updateWizardData = <Key extends keyof AnalyzerWizardData>(key: Key, value: AnalyzerWizardData[Key]) => {
    setWizardData((prev) => ({ ...prev, [key]: value }))
  }

  const parsedData = useMemo(() => {
    const parseStringArray = (value: string[] | string) => {
      if (Array.isArray(value)) return value
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    const parseApplications = (value: string[] | { company: string; role: string; status: string }[]) => {
      if (Array.isArray(value) && typeof value[0] === "object") return value as { company: string; role: string; status: string }[]
      const lines = Array.isArray(value) ? value : value.split("\n")
      return lines
        .map((line) => (typeof line === "string" ? line : ""))
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [company = "", role = "", status = "pending"] = line.split("|").map((item) => item.trim())
          return { company, role, status }
        })
    }

    return {
      certifications: parseStringArray(wizardData.certifications as unknown as string | string[]),
      skills: parseStringArray(wizardData.skillsAcquired as unknown as string | string[]),
      jobApplications: parseApplications(wizardData.jobApplications as unknown as string | string[]),
    }
  }, [wizardData.certifications, wizardData.jobApplications, wizardData.skillsAcquired])

  const handleStartAnalysis = async () => {
    setCurrentStep(4)
    setIsLoading(true)
    setProcessingProgress(10)

    try {
      const headers = {
        "Content-Type": "application/json",
      }

      const selected = wizardData.selectedAnalyses
      const aggregated: AnalyzerResults = {}

      if (wizardData.resumeFile || selected.includes("ats")) {
        setProcessingStatus("Uploading resume for ATS analysis...")
        setProcessingProgress(20)

        const formData = new FormData()
        formData.append("job_description", wizardData.jobDescription)
        if (wizardData.resumeFile) {
          formData.append("resume", wizardData.resumeFile)
        }

        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          aggregated.ats = data
        } else {
          throw new Error(await response.text())
        }
      }

      const resumePayload = {
        resume_text: wizardData.resumeText,
        job_description: wizardData.jobDescription,
      }

      if (selected.includes("skill-gap") && wizardData.resumeText) {
        setProcessingStatus("Running skill gap analyzer...")
        setProcessingProgress(35)
        const response = await fetch(`${API_BASE_URL}/resume/skill-gap`, {
          method: "POST",
          headers,
          body: JSON.stringify(resumePayload),
        })
        if (response.ok) {
          aggregated.skillGap = await response.json()
        }
      }

      if (selected.includes("role-fit") && wizardData.resumeText) {
        setProcessingStatus("Evaluating role fit and growth potential...")
        setProcessingProgress(45)
        const response = await fetch(`${API_BASE_URL}/resume/role-fit`, {
          method: "POST",
          headers,
          body: JSON.stringify(resumePayload),
        })
        if (response.ok) {
          aggregated.roleFit = await response.json()
        }
      }

      if (selected.includes("achievements") && wizardData.resumeText) {
        setProcessingStatus("Quantifying achievements...")
        setProcessingProgress(55)
        const response = await fetch(`${API_BASE_URL}/resume/achievements`, {
          method: "POST",
          headers,
          body: JSON.stringify({ resume_text: wizardData.resumeText }),
        })
        if (response.ok) {
          aggregated.achievements = await response.json()
        }
      }

      if (selected.includes("rewrite") && wizardData.resumeText) {
        setProcessingStatus("Generating AI rewrite...")
        setProcessingProgress(60)
        const response = await fetch(`${API_BASE_URL}/resume/rewrite`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...resumePayload,
            tone: wizardData.tone,
            focus_role: wizardData.focusRole || wizardData.targetRole || "Target Role",
          }),
        })
        if (response.ok) {
          aggregated.rewrite = await response.json()
        }
      }

      if (selected.includes("cover-letter") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/resume/cover-letter`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...resumePayload,
            applicant_context: {
              name: wizardData.candidateName,
              focus_role: wizardData.focusRole || wizardData.targetRole || "Target Role",
              tone: wizardData.tone,
            },
          }),
        })
        if (response.ok) {
          aggregated.coverLetter = await response.json()
        }
      }

      if (selected.includes("optimization") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/jobs/one-click-optimize`, {
          method: "POST",
          headers,
          body: JSON.stringify(resumePayload),
        })
        if (response.ok) {
          aggregated.optimization = await response.json()
        }
      }

      if (selected.includes("visualizations") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/visualizations/summary`, {
          method: "POST",
          headers,
          body: JSON.stringify(resumePayload),
        })
        if (response.ok) {
          aggregated.visualizations = await response.json()
        }
      }

      if (selected.includes("career-path") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/career/path`, {
          method: "POST",
          headers,
          body: JSON.stringify({ resume_text: wizardData.resumeText }),
        })
        if (response.ok) {
          aggregated.careerPath = await response.json()
        }
      }

      if (selected.includes("job-market") && wizardData.targetRole && wizardData.location) {
        const response = await fetch(`${API_BASE_URL}/career/job-market`, {
          method: "POST",
          headers,
          body: JSON.stringify({ target_role: wizardData.targetRole, location: wizardData.location }),
        })
        if (response.ok) {
          aggregated.jobMarket = await response.json()
        }
      }

      if (selected.includes("portfolio") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/portfolio/generate`, {
          method: "POST",
          headers,
          body: JSON.stringify({ resume_text: wizardData.resumeText }),
        })
        if (response.ok) {
          aggregated.portfolio = await response.json()
        }
      }

      if (selected.includes("interview") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/interview/readiness`, {
          method: "POST",
          headers,
          body: JSON.stringify(resumePayload),
        })
        if (response.ok) {
          aggregated.interview = await response.json()
        }
      }

      if (selected.includes("progress") && wizardData.resumeText) {
        const response = await fetch(`${API_BASE_URL}/career/progress-tracker`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            resume_text: wizardData.resumeText,
            certifications: parsedData.certifications,
            skills_acquired: parsedData.skills,
            job_applications: parsedData.jobApplications,
          }),
        })
        if (response.ok) {
          aggregated.progress = await response.json()
        }
      }

      if (selected.includes("salary") && wizardData.targetRole && wizardData.location) {
        const response = await fetch(`${API_BASE_URL}/salary/benchmark`, {
          method: "POST",
          headers,
          body: JSON.stringify({ role: wizardData.targetRole, location: wizardData.location, experience_years: Number(wizardData.experienceYears) || 3 }),
        })
        if (response.ok) {
          aggregated.salary = await response.json()
        }
      }

      setProcessingProgress(100)
      setProcessingStatus("Analysis complete!")
      setResults(aggregated)
      addAnalysisResult(aggregated)
      setCurrentStep(5)
    } catch (error) {
      console.error(error)
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      setCurrentStep(3)
    } finally {
      setIsLoading(false)
    }
  }

  const StepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Upload
            resumeFile={wizardData.resumeFile}
            resumeText={wizardData.resumeText}
            onResumeFileChange={(file) => updateWizardData("resumeFile", file)}
            onResumeTextChange={(text) => updateWizardData("resumeText", text)}
            onNext={() => setCurrentStep(2)}
          />
        )
      case 2:
        return (
          <Step2JobDescription
            jobDescription={wizardData.jobDescription}
            onJobDescriptionChange={(value) => updateWizardData("jobDescription", value)}
            onPrev={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )
      case 3:
        return (
          <Step3SelectAnalyses
            selectedAnalyses={wizardData.selectedAnalyses}
            onSelectedAnalysesChange={(value) => updateWizardData("selectedAnalyses", value)}
            onPrev={() => setCurrentStep(2)}
            onNext={() => {
              if (!wizardData.resumeFile && !wizardData.resumeText) {
                toast({
                  title: "Resume required",
                  description: "Upload a PDF or paste resume text to continue.",
                  variant: "destructive",
                })
                return
              }
              handleStartAnalysis()
            }}
          />
        )
      case 4:
        return (
          <Step4Processing
            selectedAnalyses={wizardData.selectedAnalyses}
            onPrev={() => setCurrentStep(3)}
            progress={processingProgress}
            statusMessage={processingStatus}
          />
        )
      case 5:
        return (
          <Step5Results
            results={results}
            onRestart={() => {
              setWizardData(INITIAL_DATA)
              setResults({})
              setProcessingProgress(0)
              setProcessingStatus("")
              setCurrentStep(1)
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={currentStep} onStepChange={(step) => setCurrentStep(step)} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <StepContent />
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Persona</CardTitle>
              <CardDescription>Tailor the AI outputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="candidate-name">Candidate Name</Label>
                <Input
                  id="candidate-name"
                  value={wizardData.candidateName}
                  onChange={(event) => updateWizardData("candidateName", event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="focus-role">Focus Role</Label>
                <Input
                  id="focus-role"
                  value={wizardData.focusRole}
                  onChange={(event) => updateWizardData("focusRole", event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="target-role">Target Role</Label>
                <Input
                  id="target-role"
                  value={wizardData.targetRole}
                  onChange={(event) => updateWizardData("targetRole", event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="location">Preferred Location</Label>
                <Input
                  id="location"
                  value={wizardData.location}
                  onChange={(event) => updateWizardData("location", event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="experience-years">Years of Experience</Label>
                <Input
                  id="experience-years"
                  type="number"
                  min={0}
                  step={0.5}
                  value={wizardData.experienceYears}
                  onChange={(event) => updateWizardData("experienceYears", event.target.value)}
                />
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <Badge variant="outline">Tone: {wizardData.tone}</Badge>
                <Badge variant="outline">Analyses: {wizardData.selectedAnalyses.length}</Badge>
                <Button variant="ghost" size="sm" onClick={() => updateWizardData("tone", DEFAULT_TONE)}>
                  Reset Tone
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Progress Context</CardTitle>
              <CardDescription>Helps generate the progress tracker.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications (one per line)</Label>
                <Textarea
                  id="certifications"
                  value={wizardData.certifications.join("\n")}
                  onChange={(event) => updateWizardData("certifications", event.target.value.split("\n"))}
                  className="h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Courses Completed</Label>
                <Textarea
                  id="skills"
                  value={wizardData.skillsAcquired.join("\n")}
                  onChange={(event) => updateWizardData("skillsAcquired", event.target.value.split("\n"))}
                  className="h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applications">Job Applications (Company | Role | Status)</Label>
                <Textarea
                  id="applications"
                  value={wizardData.jobApplications
                    .map((app) => (typeof app === "string" ? app : `${app.company} | ${app.role} | ${app.status}`))
                    .join("\n")}
                  onChange={(event) => updateWizardData("jobApplications", event.target.value.split("\n"))}
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
