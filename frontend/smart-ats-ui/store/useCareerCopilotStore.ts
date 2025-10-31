import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AnalyzerResults } from "@/components/analyzer/types"

type AnalysisRecord = {
  id: string
  title: string
  matchScore?: number
  date: string
}

type StatState = {
  totalAnalyses: number
  averageMatch: number | null
  skillsImproved: number
}

type JobApplication = {
  id: string
  company: string
  role: string
  status: "applied" | "interview" | "offer" | "rejected"
  updated_at: string
}

type SavedSearch = {
  id: string
  title: string
  query: string
  cadence: string
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

type CareerCopilotStore = {
  stats: StatState
  recentActivity: AnalysisRecord[]
  jobApplications: JobApplication[]
  savedSearches: SavedSearch[]
  coachConversation: ChatMessage[]

  addAnalysisResult: (results: AnalyzerResults) => void
  addJobApplication: (application: Omit<JobApplication, "id" | "updated_at">) => void
  updateJobApplicationStatus: (id: string, status: JobApplication["status"]) => void
  removeJobApplication: (id: string) => void

  addSavedSearch: (search: Omit<SavedSearch, "id">) => void
  removeSavedSearch: (id: string) => void

  pushCoachMessage: (message: ChatMessage) => void
  clearCoachConversation: () => void
}

const STORAGE_KEY = "career-copilot-store"

export const useCareerCopilotStore = create<CareerCopilotStore>()(
  persist(
    (set, get) => ({
      stats: { totalAnalyses: 0, averageMatch: null, skillsImproved: 0 },
      recentActivity: [],
      jobApplications: [],
      savedSearches: [],
      coachConversation: [],

      addAnalysisResult: (results) => {
        const { stats, recentActivity } = get()
        const matchPercent = results.ats?.jd_match
          ? Number.parseFloat(results.ats.jd_match.replace(/[^0-9.]/g, ""))
          : null

        const updatedTotal = stats.totalAnalyses + 1
        const updatedAverage = matchPercent !== null
          ? stats.averageMatch !== null
            ? (stats.averageMatch * stats.totalAnalyses + matchPercent) / updatedTotal
            : matchPercent
          : stats.averageMatch

        const additionalSkills = results.progress?.skill_development_plan?.length ?? 0
        const updatedSkillsImproved = stats.skillsImproved + additionalSkills

        const activityTitle = matchPercent !== null
          ? `Resume analysis completed • Match ${matchPercent.toFixed(0)}%`
          : results.rewrite?.key_adjustments?.[0] ?? "Resume analysis completed"

        const newActivity: AnalysisRecord = {
          id: crypto.randomUUID(),
          title: activityTitle,
          matchScore: matchPercent ?? undefined,
          date: new Date().toISOString(),
        }

        set({
          stats: {
            totalAnalyses: updatedTotal,
            averageMatch: updatedAverage,
            skillsImproved: updatedSkillsImproved,
          },
          recentActivity: [newActivity, ...recentActivity].slice(0, 8),
        })
      },

      addJobApplication: (application) => {
        const entry: JobApplication = {
          id: crypto.randomUUID(),
          updated_at: new Date().toISOString(),
          ...application,
        }
        set((state) => ({ jobApplications: [entry, ...state.jobApplications] }))
      },

      updateJobApplicationStatus: (id, status) => {
        set((state) => ({
          jobApplications: state.jobApplications.map((app) =>
            app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app,
          ),
        }))
      },

      removeJobApplication: (id) => {
        set((state) => ({ jobApplications: state.jobApplications.filter((app) => app.id !== id) }))
      },

      addSavedSearch: (search) => {
        const entry: SavedSearch = { id: crypto.randomUUID(), ...search }
        set((state) => ({ savedSearches: [entry, ...state.savedSearches] }))
      },

      removeSavedSearch: (id) => {
        set((state) => ({ savedSearches: state.savedSearches.filter((search) => search.id !== id) }))
      },

      pushCoachMessage: (message) => {
        set((state) => ({ coachConversation: [...state.coachConversation, message] }))
      },

      clearCoachConversation: () => set({ coachConversation: [] }),
    }),
    { name: STORAGE_KEY },
  ),
)
