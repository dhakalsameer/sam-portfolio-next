"use client"

import { useEffect, useState } from "react"
import { Code2, Award, FolderGit2, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import { authenticatedFetch } from "@/lib/auth-client"

export default function DashboardPage() {
  const [stats, setStats] = useState<{ skills: number; certificates: number; projects: number; hasProfile: boolean } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      authenticatedFetch("/api/skills").then(r => r.json()),
      authenticatedFetch("/api/certificates?limit=50").then(r => r.json()),
      authenticatedFetch("/api/projects?limit=50").then(r => r.json()),
      authenticatedFetch("/api/profile").then(r => r.json()),
    ]).then(([skills, certsRes, projectsRes, profile]) => {
      const certs = certsRes.certificates ?? certsRes
      const projects = projectsRes.projects ?? projectsRes
      setStats({ skills: skills.length, certificates: certs.length, projects: projects.length, hasProfile: !!profile })
    }).catch(() => setError("Failed to load stats"))
  }, [])

  const cards = [
    { label: "Skills", count: stats?.skills ?? 0, icon: Code2, href: "/admin/skills", color: "text-terminal-green" },
    { label: "Certificates", count: stats?.certificates ?? 0, icon: Award, href: "/admin/certificates", color: "text-terminal-amber" },
    { label: "Projects", count: stats?.projects ?? 0, icon: FolderGit2, href: "/admin/projects", color: "text-terminal-blue" },
    { label: "Profile", count: stats?.hasProfile ? 1 : 0, icon: User, href: "/admin/profile", color: "text-terminal-green" },
  ]

  if (error) return <div className="text-terminal-red text-sm">{error}</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-terminal-green text-lg font-semibold">dashboard</h1>
        <p className="text-terminal-text-dim text-xs mt-1">Overview of your portfolio content</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.href} href={card.href}>
            <div className="border border-terminal-border rounded bg-terminal-surface p-4 hover:border-terminal-green/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <card.icon size={20} className={card.color} />
                <ExternalLink size={14} className="text-terminal-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.count}</div>
              <div className="text-xs text-terminal-text-dim mt-1">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
