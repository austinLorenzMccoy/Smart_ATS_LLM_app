"use client"

import { ChangeEvent } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContainer } from "./StepContainer"

interface Step2JobDescriptionProps {
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
  onPrev: () => void
  onNext: () => void
  minLength?: number
}

export function Step2JobDescription({
  jobDescription,
  onJobDescriptionChange,
  onPrev,
  onNext,
  minLength = 120,
}: Step2JobDescriptionProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onJobDescriptionChange(event.target.value)
  }

  const charCount = jobDescription.length
  const isValid = charCount >= minLength

  return (
    <StepContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Paste the job description you are targeting</h3>
          <p className="text-sm text-muted-foreground">
            Include the full job description to unlock precise keyword matching, role fit scoring, and tailored recommendations. URLs
            will be supported in a future release.
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="job-description" className="text-sm font-medium">
            Job Description
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={handleChange}
            className="min-h-[300px] font-mono text-sm"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Minimum {minLength} characters recommended.</span>
            <span className={isValid ? "text-emerald-500" : "text-destructive"}>{charCount} characters</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" onClick={onPrev} className="sm:w-auto">
            Back
          </Button>
          <Button size="lg" onClick={onNext} disabled={!isValid} className="sm:w-auto">
            Choose Analysis Types
          </Button>
        </div>
      </div>
    </StepContainer>
  )
}
