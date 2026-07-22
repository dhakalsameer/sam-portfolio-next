"use client"

import { motion } from "framer-motion"
import { ExternalLink, Award, Calendar } from "lucide-react"
import TerminalWindow from "@/components/ui/TerminalWindow"
import type { CertificationData } from "@/types"
import { cl } from "@/lib/images"

export default function CertificatesSection({ certificates }: { certificates: CertificationData[] }) {
  if (certificates.length === 0) return null

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
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="group relative py-4 px-1 hover:bg-terminal-orange/[0.02] transition-colors"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-terminal-orange/40 transition-colors rounded" />

                  <div className="flex items-start gap-4">
                    {cert.image && (
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-terminal-border/60 bg-white/[0.04] shadow-sm">
                        <img src={cl(cert.image, 80)} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Award size={16} className="text-terminal-orange/60 shrink-0" />
                            <h3 className="text-base sm:text-xl font-semibold text-terminal-text group-hover:text-terminal-orange transition-colors truncate">
                              {cert.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-terminal-text-dim/60 mt-0.5">
                            <span className="text-terminal-text-dim/40">—</span>
                            <span>{cert.issuer}</span>
                            {cert.dateAwarded && (
                              <>
                                <span className="text-terminal-text-dim/30">•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} className="opacity-50" />
                                  {cert.dateAwarded}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                          {cert.certificateUrl && (
                            <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-terminal-text-dim/30 hover:text-terminal-orange hover:bg-terminal-orange/5 rounded-lg transition-all">
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      {cert.description && (
                        <p className="text-sm sm:text-base text-terminal-text-dim/70 leading-relaxed mt-1.5 line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  )
}
