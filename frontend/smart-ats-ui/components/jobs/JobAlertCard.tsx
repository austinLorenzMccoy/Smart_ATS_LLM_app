"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface JobAlertCardProps {
  company: string
  title: string
  matchScore?: string
  reasoning?: string
  location?: string
  salaryRange?: string
}

export function JobAlertCard({ company, title, matchScore, reasoning, location, salaryRange }: JobAlertCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
          {matchScore && <Badge variant="secondary">Match {matchScore}</Badge>}
        </CardTitle>
        <CardDescription className="flex flex-col text-sm">
          <span className="font-medium text-foreground">{company}</span>
          {location && <span>{location}</span>}
          {salaryRange && <span>{salaryRange}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reasoning && <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>}
        <div className="flex flex-wrap gap-2">
          <Button size="sm">View Details</Button>
          <Button size="sm" variant="outline">
            Save Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
