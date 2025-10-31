"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Sparkles } from "lucide-react"

interface Stat {
  id: string
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  helper?: string
}

interface StatsOverviewProps {
  stats?: Stat[]
}

const DEFAULT_STATS: Stat[] = [
  {
    id: "analyses",
    label: "Total Analyses",
    value: "0",
    icon: Sparkles,
    helper: "Run your first analysis to populate this metric.",
  },
  {
    id: "match",
    label: "Average Match",
    value: "—",
    icon: Target,
    helper: "Track how your resume improves over time.",
  },
  {
    id: "skills",
    label: "Skills Improved",
    value: "0",
    icon: TrendingUp,
    helper: "Add skill gaps to your learning plan.",
  },
]

export function StatsOverview({ stats = DEFAULT_STATS }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <stat.icon className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
            {stat.helper && <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
