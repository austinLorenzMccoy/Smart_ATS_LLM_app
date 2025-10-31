"use client"

import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Upload Resume", description: "PDF or text input" },
  { id: 2, title: "Job Description", description: "Paste or import JD" },
  { id: 3, title: "Pick Analyses", description: "Choose insights" },
  { id: 4, title: "Processing", description: "Sit tight" },
  { id: 5, title: "Results", description: "Review outputs" },
] as const

type StepIndicatorProps = {
  currentStep: number
  onStepChange?: (step: number) => void
}

export function StepIndicator({ currentStep, onStepChange }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Step {currentStep} of {steps.length}</p>
          <h2 className="text-2xl font-semibold">{steps[currentStep - 1]?.title}</h2>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange?.(step.id)}
              className={cn(
                "group flex items-center gap-3 rounded-xl border bg-card/70 p-4 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive && "border-primary bg-primary/10",
                isCompleted && !isActive && "border-emerald-200 bg-emerald-50/40 text-emerald-900"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && !isActive && "border-emerald-200 bg-emerald-500 text-white",
                  !isActive && !isCompleted && "border-border"
                )}
              >
                {step.id}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
