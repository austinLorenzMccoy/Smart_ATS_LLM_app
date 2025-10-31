"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  title: string
  matchScore?: string
  date: string
}

interface RecentActivityProps {
  items?: ActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (!items?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Run an analysis to populate recent activity.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-none last:pb-0">
            <div className="space-y-1">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
            </div>
            {item.matchScore && <Badge variant="secondary">Match {item.matchScore}</Badge>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
