"use client"

import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

interface StepContainerProps {
  children: ReactNode
}

export function StepContainer({ children }: StepContainerProps) {
  return (
    <Card className="shadow-sm border-border/70">
      <CardContent className="p-6 md:p-8 space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}
