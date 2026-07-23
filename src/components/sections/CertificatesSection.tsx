"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Award, Calendar } from "lucide-react"
import TerminalWindow from "@/components/ui/TerminalWindow"
import type { CertificationData } from "@/types"
import { cl } from "@/lib/images"

export default function CertificatesSection({ certificates }: { certificates: CertificationData[] }) {
  if (certificates.length === 0) return null

  const [visibleCount, setVisibleCount] = useState(6)
  const visible = certificates.slice(0, visibleCount)
  const hasMore = visibleCount < certificates.length
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox])

  return (
    <section id="certificates" className="py-20 px-4 bg-terminal-surface/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terminal-text text-base sm:text-lg font-semibold mb-4 font-mono">
            <span className="text-terminal-orange">$</span> ls -la certificates/
          </p>

          <TerminalWindow title="sameer@ubuntu:~/certificates">
            <div className="text-sm text-terminal-text-dim/60 font-mono px-1 pb-3 border-b border-terminal-border/30 mb-1 flex items-center gap-4">
              <span className="text-terminal-orange/60">{certificates.length} certificates</span>
              <span>verified</span>
            </div>

            <div className="divide-y divide-terminal-border/20">
              {visible.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="group relative py-3 sm:py-5 px-1 hover:bg-terminal-orange/[0.02] transition-colors"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-terminal-orange/40 transition-colors rounded" />

                  <div className="flex items-start gap-2.5 sm:gap-5">
                    {cert.image && (
                      <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-lg sm:rounded-xl overflow-hidden border border-terminal-border/60 bg-white/[0.04] shadow-sm shadow-black/10 group-hover:shadow-terminal-orange/10 group-hover:border-terminal-orange/40 transition-all duration-500 cursor-pointer" onClick={() => setLightbox(cert.image)}>
                        <img src={cl(cert.image, 300)} alt={cert.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                            <Award size={16} className="sm:hidden text-terminal-orange/60 shrink-0" />
                            <Award size={20} className="hidden sm:block text-terminal-orange/60 shrink-0" />
                            <h3 className="text-sm sm:text-lg lg:text-2xl font-semibold text-terminal-text group-hover:text-terminal-orange transition-colors truncate">
                              {cert.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-base text-terminal-text-dim/60 mt-0.5">
                            <span className="text-terminal-text-dim/40">—</span>
                            <span>{cert.issuer}</span>
                            {cert.dateAwarded && (
                              <>
                                <span className="text-terminal-text-dim/30">•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} className="opacity-50" />
                                  {cert.dateAwarded}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                          {cert.certificateUrl && (
                            <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 text-terminal-text-dim/30 hover:text-terminal-orange hover:bg-terminal-orange/5 rounded-lg transition-all">
                              <ExternalLink size={16} className="sm:hidden" />
                              <ExternalLink size={20} className="hidden sm:block" />
                            </a>
                          )}
                        </div>
                      </div>

                      {cert.description && (
                        <p className="text-xs sm:text-base lg:text-lg text-terminal-text leading-relaxed mt-1.5 sm:mt-2 line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4 pt-3">
                <button
                  onClick={() => setVisibleCount(c => c + 6)}
                  className="px-5 py-2.5 border border-terminal-border rounded-lg text-terminal-text-dim hover:text-terminal-orange hover:border-terminal-orange font-mono text-sm transition-all"
                >
                  [ load {Math.min(6, certificates.length - visibleCount)} more ]
                </button>
              </div>
            )}
          </TerminalWindow>
        </motion.div>
      </div>

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
