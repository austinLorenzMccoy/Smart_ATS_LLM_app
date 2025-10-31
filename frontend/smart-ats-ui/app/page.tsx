import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, TrendingUp, Layers, LineChart, Briefcase } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 28, 43, 0.82), rgba(18, 37, 53, 0.76)), url('/professional-resume-document-on-desk-with-laptop.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Career Copilot • Powered by Gemini</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight text-foreground">
            Your AI Partner From Resume to Offer
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
            Transform how you grow your career with deep resume intelligence, real-time market insights, recruiter-ready
            tooling, and personalized coaching—all orchestrated by AI Career Copilot.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 group">
              <Link href="/dashboard">
                Launch Copilot Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why AI Career Copilot?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Precision Resume Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rewrite resumes, quantify achievements, and simulate ATS scoring to highlight exactly what hiring teams
                are looking for.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrated Career Workflows</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate cover letters, manage multiple resume variants, and deliver recruiter-ready reports—all in one
                workspace.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data-Driven Decisions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access real-time job market insights, salary benchmarking, and long-term career progression planning.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors md:col-span-3">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">For Job Seekers, Recruiters, and Coaches</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI Career Copilot delivers multi-profile support—from personalized interview prep and career path
                    forecasting to recruiter bulk screening, job alerts, and progress tracking. Collaborate on the same
                    AI backbone across every career decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 AI Career Copilot. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
