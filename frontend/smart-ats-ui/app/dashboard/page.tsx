import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { StatsOverview } from "@/components/dashboard/StatsOverview"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { useCareerCopilotStore } from "@/store/useCareerCopilotStore"
import { Sparkles, Target, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = useCareerCopilotStore((state) => state.stats)
  const recentActivity = useCareerCopilotStore((state) => state.recentActivity)
  const jobApplications = useCareerCopilotStore((state) => state.jobApplications)

  const statsData = [
    {
      id: "analyses",
      label: "Total Analyses",
      value: String(stats.totalAnalyses),
      icon: Sparkles,
      helper: "Run new analyses to improve your career insights.",
    },
    {
      id: "match",
      label: "Average Match",
      value: stats.averageMatch !== null ? `${stats.averageMatch.toFixed(0)}%` : "—",
      icon: Target,
      helper: "Higher match scores indicate stronger alignment.",
    },
    {
      id: "skills",
      label: "Skills Improved",
      value: String(stats.skillsImproved),
      icon: TrendingUp,
      helper: "Capture AI suggestions to grow your skills.",
    },
  ]

  const displayActivity = recentActivity.length ? recentActivity : undefined
  const upcomingMilestones = jobApplications.slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome back!</h2>
        <p className="text-muted-foreground text-lg">
          Continue your journey to a standout application. Resume intelligence, AI coaching, and market insights are one click away.
        </p>
      </div>

      <QuickActions />

      <StatsOverview
        stats={statsData.map((stat) => ({
          ...stat,
          icon: stat.icon as any,
        }))}
      />

      <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
        <RecentActivity items={displayActivity} />

        <Card id="progress" className="h-full">
          <CardHeader>
            <CardTitle>Progress Tracker</CardTitle>
            <CardDescription>Key milestones from your recent analyses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {upcomingMilestones.length ? (
              upcomingMilestones.map((app) => (
                <div key={app.id} className="flex items-start gap-3">
                  <Badge variant="secondary" className="capitalize">{app.status}</Badge>
                  <div>
                    <p className="font-medium text-foreground">{app.role}</p>
                    <p>{app.company}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(app.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Track job applications in the Job Search hub to see milestones here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
