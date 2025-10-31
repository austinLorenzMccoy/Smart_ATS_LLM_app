"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  X,
  FileText,
  Sparkles,
  MessageSquare,
  Briefcase,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "sidebarCollapsed"

function readSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : false
  } catch {
    return false
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
  }, [collapsed])

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleCollapsed = () => setCollapsed((prev) => !prev)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "left-0" : "-left-full md:left-0",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-all duration-200",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
              )}
            >
              Smart ATS
            </span>
          </div>

          {/* Desktop toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden md:flex flex-shrink-0"
            aria-expanded={!collapsed}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>

          {/* Mobile close */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2" role="navigation" aria-label="Main navigation">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            collapsed={collapsed}
            active={pathname === "/dashboard"}
          />
          <SidebarItem
            href="/dashboard/analyzer"
            icon={<FileText className="h-5 w-5" />}
            label="Analyzer Wizard"
            collapsed={collapsed}
            active={pathname === "/dashboard/analyzer"}
          />
          <SidebarItem
            href="/dashboard/analyze"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Legacy Analyzer"
            collapsed={collapsed}
            active={pathname === "/dashboard/analyze"}
          />
          <SidebarItem
            href="/dashboard/coach"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Career Coach"
            collapsed={collapsed}
            active={pathname === "/dashboard/coach"}
          />
          <SidebarItem
            href="/dashboard/jobs"
            icon={<Briefcase className="h-5 w-5" />}
            label="Job Search"
            collapsed={collapsed}
            active={pathname === "/dashboard/jobs"}
          />
          <SidebarItem
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            collapsed={collapsed}
            active={pathname === "/dashboard/settings"}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-card border-b border-border backdrop-blur-sm bg-card/95">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname === "/dashboard/analyzer" && "Analyzer Wizard"}
              {pathname === "/dashboard/analyze" && "Legacy Analyzer"}
              {pathname === "/dashboard/coach" && "Career Coach"}
              {pathname === "/dashboard/jobs" && "Job Search"}
              {pathname === "/dashboard/settings" && "Settings"}
            </h1>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function SidebarItem({
  href,
  icon,
  label,
  collapsed,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
      )}
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{icon}</div>
      <span
        className={cn(
          "transition-all duration-200 whitespace-nowrap",
          collapsed ? "opacity-0 -translate-x-2 w-0 overflow-hidden" : "opacity-100 translate-x-0",
        )}
      >
        {label}
      </span>
    </Link>
  )
}
