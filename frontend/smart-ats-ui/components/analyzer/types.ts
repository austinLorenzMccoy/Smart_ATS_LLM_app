export type AnalysisType =
  | "ats"
  | "skill-gap"
  | "role-fit"
  | "achievements"
  | "rewrite"
  | "cover-letter"
  | "optimization"
  | "visualizations"
  | "career-path"
  | "job-market"
  | "portfolio"
  | "interview"
  | "progress"
  | "salary"

export type AnalyzerWizardData = {
  resumeFile: File | null
  resumeText: string
  jobDescription: string
  focusRole: string
  tone: string
  candidateName: string
  targetRole: string
  location: string
  experienceYears: string
  certifications: string[]
  skillsAcquired: string[]
  jobApplications: { company: string; role: string; status: string }[]
  selectedAnalyses: AnalysisType[]
}

export type AnalyzerResults = {
  ats?: ATSResponse | null
  skillGap?: SkillGapResponse | null
  roleFit?: RoleFitResponse | null
  achievements?: AchievementResponse | null
  rewrite?: RewriteResponse | null
  coverLetter?: CoverLetterResponse | null
  optimization?: OptimizationResponse | null
  visualizations?: VisualizationResponse | null
  careerPath?: CareerPathResponse | null
  jobMarket?: JobMarketResponse | null
  interview?: InterviewResponse | null
  progress?: ProgressTrackerResponse | null
  salary?: SalaryResponse | null
  portfolio?: PortfolioResponse | null
}

export type ATSResponse = {
  jd_match: string
  missing_keywords: string[]
  profile_summary: string
}

export type SkillGapResponse = {
  missing_hard_skills?: string[]
  missing_soft_skills?: string[]
  course_recommendations?: { name: string; provider: string; url: string }[]
}

export type RoleFitResponse = {
  overall_fit?: string
  skill_alignment?: string
  experience_alignment?: string
  growth_potential?: string
  insights?: string[]
}

export type AchievementResponse = {
  quantified_bullets?: string[]
  methodology_notes?: string[]
}

export type RewriteResponse = {
  rewritten_resume: string
  key_adjustments: string[]
  keyword_alignment_score: string
}

export type CoverLetterResponse = {
  cover_letter: string
  talking_points: string[]
}

export type OptimizationResponse = {
  optimized_summary: string
  priority_edits: string[]
  keyword_matches: string[]
}

export type VisualizationResponse = {
  skill_heatmap?: { skill: string; proficiency: string; demand: string }[]
  keyword_cloud?: { keyword: string; frequency: number }[]
  progress_tracker?: { milestone: string; status: string; impact: string }[]
}

export type CareerPathResponse = {
  recommended_roles?: {
    title: string
    salary_range: string
    confidence: string
  }[]
  upskilling_paths?: string[]
  long_term_projection?: string
}

export type JobMarketResponse = {
  demand_level?: string
  top_skills?: string[]
  emerging_roles?: string[]
  market_commentary?: string
}

export type InterviewResponse = {
  behavioral_questions?: string[]
  technical_questions?: string[]
  prep_tips?: string[]
}

export type SalaryResponse = {
  median_salary?: string
  percentile_25?: string
  percentile_75?: string
  data_sources?: string[]
}

export type ProgressTrackerResponse = {
  progress_score?: string
  milestones_achieved?: string[]
  next_milestones?: string[]
  skill_development_plan?: { skill: string; priority: string; timeline: string }[]
  career_trajectory_summary?: string
}

export type PortfolioResponse = {
  site_structure?: Record<string, unknown>
  highlight_projects?: string[]
  call_to_actions?: string[]
}
