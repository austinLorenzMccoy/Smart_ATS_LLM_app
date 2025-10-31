"use client"

import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Briefcase, TrendingUp } from "lucide-react"

const ACTIONS = [
  {
    title: "Start New Analysis",
    description: "Upload a resume and job description to generate insights.",
    href: "/dashboard/analyzer",
    icon: FileText,
    variant: "default" as const,
  },
  {
    title: "Chat with Career Coach",
    description: "Ask questions about roles, interviews, and career growth.",
    href: "/dashboard/coach",
    icon: MessageSquare,
    variant: "secondary" as const,
  },
  {
    title: "Find High-Match Jobs",
    description: "Review 90%+ match alerts tailored to your goals.",
    href: "/dashboard/jobs",
    icon: Briefcase,
    variant: "outline" as const,
  },
  {
    title: "Track Your Progress",
    description: "Monitor milestones, skills, and application status.",
    href: "#progress",
    icon: TrendingUp,
    variant: "ghost" as const,
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {ACTIONS.map((action) => (
        <Card key={action.title} className="border-border/70">
          <CardHeader className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <action.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{action.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {action.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant={action.variant} className="w-full">
              <Link href={action.href}>Open</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
