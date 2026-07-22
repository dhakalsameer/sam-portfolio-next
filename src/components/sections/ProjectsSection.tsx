"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Folder, ChevronDown } from "lucide-react"
import { GithubIcon } from "@/components/ui/Icons"
import TerminalWindow from "@/components/ui/TerminalWindow"
import { cl } from "@/lib/images"
import type { ProjectData } from "@/types"

const techColors: Record<string, string> = {
  javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  python: "bg-green-500/10 text-green-400 border-green-500/30",
  rust: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  solidity: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  react: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  "next.js": "bg-white/5 text-terminal-text-bright border-white/10",
  tailwind: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  prisma: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  mongodb: "bg-green-600/10 text-green-500 border-green-600/30",
  anchor: "bg-red-500/10 text-red-400 border-red-500/30",
  solana: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  node: "bg-lime-500/10 text-lime-400 border-lime-500/30",
}

function getTechColor(tech: string) {
  const key = tech.toLowerCase().trim()
  return techColors[key] || "bg-terminal-border text-terminal-text-dim border-terminal-border"
}

export default function ProjectsSection({ projects }: { projects: ProjectData[] }) {
  if (projects.length === 0) return null

  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terminal-text text-base sm:text-lg font-semibold mb-4 font-mono">
            <span className="text-terminal-green">$</span> ls -la projects/
          </p>

          <div className="grid gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-terminal-border group-hover:bg-terminal-green transition-colors rounded-l" />

                <div
                  onClick={() => {
                    const url = project.liveLink || project.githubLink
                    if (url) window.open(url, "_blank", "noopener noreferrer")
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      const url = project.liveLink || project.githubLink
                      if (url) window.open(url, "_blank", "noopener noreferrer")
                    }
                  }}
                  className="border border-terminal-border group-hover:border-terminal-green/40 rounded bg-terminal-surface p-5 sm:p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-terminal-green/5"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {project.image && (
                      <div className="hidden sm:block w-28 h-20 shrink-0 rounded overflow-hidden border border-terminal-border/60 bg-white/[0.04]">
                        <img
                          src={cl(project.image, 224)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex items-center gap-2 text-terminal-green/50 font-mono text-sm shrink-0">
                            <span className="text-terminal-text-dim/30">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <Folder size={18} className="text-terminal-blue/60 shrink-0" />
                          <h3 className="text-lg sm:text-2xl font-semibold text-terminal-text group-hover:text-terminal-green transition-colors truncate font-mono">
                            {project.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2.5 text-terminal-text-dim/40 hover:text-terminal-blue hover:bg-terminal-blue/5 rounded-lg transition-all">
                              <GithubIcon size={24} />
                            </a>
                          )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2.5 text-terminal-text-dim/40 hover:text-terminal-green hover:bg-terminal-green/5 rounded-lg transition-all">
                              <ExternalLink size={24} />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className={`text-base sm:text-lg text-terminal-text-dim/80 leading-relaxed mb-1 ${expanded.has(project.id) ? "" : "line-clamp-2 sm:line-clamp-2"}`}>
                          {project.description}
                        </p>
                        {project.description.length > 150 && (
                          <button
                            onClick={e => { e.stopPropagation(); toggleExpanded(project.id) }}
                            className="flex items-center gap-1 text-sm text-terminal-text-dim/70 hover:text-terminal-green font-mono transition-colors"
                          >
                            <ChevronDown size={16} className={`transition-transform ${expanded.has(project.id) ? "rotate-180" : ""}`} />
                            {expanded.has(project.id) ? "show less" : "read more"}
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {project.techStack.split(",").map((tech, j) => (
                          <span key={j} className={`text-sm sm:text-base px-2.5 py-0.5 rounded-full border ${getTechColor(tech)} font-medium`}>
                            {tech.trim()}
                          </span>
                        ))}
                        <span className="text-terminal-text-dim/20 text-sm font-mono ml-auto hidden sm:inline">
                          ~/{project.title.toLowerCase().replace(/\s+/g, "-")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.image && (
                    <div className="sm:hidden mt-3 rounded overflow-hidden border border-terminal-border/60 bg-white/[0.04]">
                      <img
                        src={cl(project.image, 640)}
                        alt={project.title}
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
