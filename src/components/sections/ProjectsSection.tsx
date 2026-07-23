"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Folder, X } from "lucide-react"
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

  const [selected, setSelected] = useState<ProjectData | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(6)
  const visible = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  useEffect(() => {
    if (!selected) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selected])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox])

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
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative h-full"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-terminal-border group-hover:bg-terminal-green transition-colors rounded-l" />

                <div
                  onClick={() => setSelected(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelected(project)
                    }
                  }}
                  className="border border-terminal-border group-hover:border-terminal-green/40 rounded bg-terminal-surface p-3.5 sm:p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-terminal-green/5 h-full"
                >
                  <div className="flex items-start gap-3 sm:gap-6 sm:items-start">
                    {project.image && (
                      <div className="w-20 h-16 sm:w-56 sm:h-36 shrink-0 rounded-lg overflow-hidden border border-terminal-border/60 bg-white/[0.04] shadow-sm shadow-black/10 group-hover:shadow-terminal-green/10 group-hover:border-terminal-green/40 transition-all duration-500">
                        <img
                          src={cl(project.image, 400)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex items-center gap-1.5 text-terminal-green/50 font-mono text-xs sm:text-sm shrink-0">
                            <span className="text-terminal-text-dim/30">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <Folder size={14} className="sm:hidden text-terminal-blue/60 shrink-0" />
                          <Folder size={18} className="hidden sm:block text-terminal-blue/60 shrink-0" />
                          <h3 className="text-sm sm:text-lg lg:text-2xl font-semibold text-terminal-text group-hover:text-terminal-green transition-colors truncate font-mono">
                            {project.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 sm:p-2.5 text-terminal-text-dim/40 hover:text-terminal-blue hover:bg-terminal-blue/5 rounded-lg transition-all">
                              <GithubIcon size={18} className="sm:hidden" />
                              <GithubIcon size={24} className="hidden sm:block" />
                            </a>
                          )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 sm:p-2.5 text-terminal-text-dim/40 hover:text-terminal-green hover:bg-terminal-green/5 rounded-lg transition-all">
                              <ExternalLink size={18} className="sm:hidden" />
                              <ExternalLink size={24} className="hidden sm:block" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm lg:text-base text-terminal-text leading-relaxed line-clamp-2 sm:line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 sm:mt-3 mt-auto">
                        {project.techStack.split(",").map((tech, j) => (
                          <span key={j} className={`text-[10px] sm:text-xs lg:text-sm px-1.5 sm:px-2.5 py-0.5 rounded-full border ${getTechColor(tech)} font-medium`}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount(c => c + 6)}
                className="px-5 py-2.5 border border-terminal-border rounded-lg text-terminal-text-dim hover:text-terminal-green hover:border-terminal-green font-mono text-sm transition-all"
              >
                [ load {Math.min(6, projects.length - visibleCount)} more ]
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="bg-terminal-surface border border-terminal-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-terminal-border/60">
                <span className="text-terminal-green font-mono text-sm font-semibold tracking-wide">
                  ~/projects/{selected.title.toLowerCase().replace(/\s+/g, "-")}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 text-terminal-text-dim hover:text-terminal-red hover:bg-terminal-red/5 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {selected.image && (
                <div className="bg-black/20 cursor-pointer" onClick={() => setLightbox(selected.image)}>
                  <img
                    src={cl(selected.image, 1200)}
                    alt={selected.title}
                    className="w-full max-h-96 object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-terminal-text font-mono">
                    {selected.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selected.techStack.split(",").map((tech, j) => (
                      <span key={j} className={`text-xs px-3 py-1 rounded-full border ${getTechColor(tech)} font-medium`}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-terminal-text leading-relaxed">
                  {selected.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {selected.githubLink && (
                    <a
                      href={selected.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text-dim hover:text-terminal-blue hover:border-terminal-blue transition-all font-medium"
                    >
                      <GithubIcon size={20} />
                      View Source
                    </a>
                  )}
                  {selected.liveLink && (
                    <a
                      href={selected.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green hover:bg-terminal-green/20 hover:border-terminal-green/60 transition-all font-medium"
                    >
                      <ExternalLink size={20} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer"
        >
          <img
            src={cl(lightbox, 1600)}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  )
}
