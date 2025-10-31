"use client"

import { useMemo } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const STATUS_COLORS: Record<string, "outline" | "secondary" | "default"> = {
  applied: "outline",
  interview: "secondary",
  offer: "default",
  rejected: "outline",
}

type Application = {
  company: string
  role: string
  status: string
  updated_at?: string
}

interface ApplicationTrackerProps {
  applications?: Application[]
}

export function ApplicationTracker({ applications }: ApplicationTrackerProps) {
  const items = useMemo(() => applications ?? [], [applications])

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Log job applications to monitor stages and follow-ups.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Application Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="divide-y divide-border">
            {items.map((app, index) => (
              <div key={`${app.company}-${app.role}-${index}`} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{app.role}</p>
                  <p className="text-muted-foreground">{app.company}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={STATUS_COLORS[app.status] ?? "outline"} className="capitalize">
                    {app.status}
                  </Badge>
                  {app.updated_at && (
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(app.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
