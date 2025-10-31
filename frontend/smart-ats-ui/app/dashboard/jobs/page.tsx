"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

import { JobAlertCard } from "@/components/jobs/JobAlertCard"
import { ApplicationTracker } from "@/components/jobs/ApplicationTracker"
import { SavedSearches } from "@/components/jobs/SavedSearches"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function JobsPage() {
  const { toast } = useToast()
  const [jobAlerts, setJobAlerts] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [searches] = useState([
    {
      id: "search-1",
      title: "Senior Machine Learning Engineer",
      query: "match_score >= 90 AND location = 'Remote'",
      cadence: "Weekly",
    },
  ])
  const [targetRole, setTargetRole] = useState("Senior Machine Learning Engineer")
  const [location, setLocation] = useState("Remote")
  const [minMatch, setMinMatch] = useState(80)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/alerts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole, location }),
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        setJobAlerts(data?.job_alerts ?? [])
      } catch (error) {
        console.error(error)
        toast({
          title: "Unable to fetch job alerts",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchAlerts()
  }, [location, targetRole, toast])

  return (
    <div className="grid gap-6 xl:grid-cols-[2fr_1.2fr]">
      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Job Alerts</CardTitle>
            <CardDescription>High-match opportunities curated from your resume and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-role">Target Role</Label>
                <Input id="target-role" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Minimum match score: {minMatch}%</Label>
              <Slider
                value={[minMatch]}
                min={50}
                max={100}
                step={5}
                onValueChange={(values) => setMinMatch(values[0] ?? 80)}
              />
            </div>
            <Button onClick={() => toast({ title: "Alerts refreshed" })}>Refresh Alerts</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {jobAlerts
            .filter((alert) => Number(alert.match_score?.replace(/[^0-9]/g, "")) >= minMatch)
            .map((alert, index) => (
              <JobAlertCard
                key={`${alert.title}-${index}`}
                company={alert.company}
                title={alert.title}
                matchScore={alert.match_score}
                reasoning={alert.reasoning}
                location={alert.location}
                salaryRange={alert.salary_range}
              />
            ))}
          {!jobAlerts.length && (
            <Card>
              <CardHeader>
                <CardTitle>No alerts yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Update your preferences to discover tailored job matches.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <ApplicationTracker applications={applications} />
        <SavedSearches searches={searches} />
      </section>
    </div>
  )
}
