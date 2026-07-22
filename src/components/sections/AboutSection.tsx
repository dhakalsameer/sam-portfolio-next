"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Terminal } from "lucide-react"
import type { ProfileData } from "@/types"
import TerminalWindow from "@/components/ui/TerminalWindow"
import { useEffect, useState } from "react"

export default function AboutSection({ profile }: { profile: ProfileData | null }) {
  if (!profile?.about && !profile?.bio) return null

  const slogans: [string, string][] = [
    ["keep building, keep shipping", "text-terminal-green"],
    ["code. break. learn. repeat.", "text-terminal-orange"],
    ["sudo make it work", "text-terminal-blue"],
    ["root@localhost:~# ship it", "text-terminal-amber"],
  ]
  const [sloganIndex, setSloganIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setSloganIndex(i => (i + 1) % slogans.length), 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terminal-text text-base sm:text-lg font-semibold mb-4 font-mono">
            <span className="text-terminal-green">$</span> whoami
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TerminalWindow title="sameer@ubuntu:~/about">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-terminal-green/30 rounded" />
                  <div className="pl-4 sm:pl-5">
                    <p className="text-base text-terminal-green/60 font-mono mb-3">
                      <span className="text-terminal-green">$</span> cat about.txt
                    </p>
                    <div className="text-base sm:text-lg text-terminal-text leading-relaxed sm:leading-[1.75] space-y-4 whitespace-pre-line font-mono">
                      {(profile?.about || profile?.bio)?.split("\n\n").map((para, i) => (
                        <p key={i}>
                          <span className="text-terminal-text-dim/40 select-none">{"> "}</span>
                          {para}
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-terminal-border/50 flex items-center gap-2 text-base text-terminal-text-dim/50 font-mono">
                      <span className="animate-pulse">■</span>
                      <span>about.txt — {((profile?.about || profile?.bio)?.length ?? 0)} chars / {(profile?.about || profile?.bio)?.split(" ").length ?? 0} words</span>
                    </div>
                  </div>
                </div>
              </TerminalWindow>

            <TerminalWindow title="sameer@ubuntu:~/neofetch">
                <div>
                  <div className="mb-4 pb-3 border-b border-terminal-border/50">
                    <p className="text-lg font-semibold text-terminal-text font-mono">
                      {profile?.fullName || "Sameer Dhakal"}
                    </p>
                    {profile?.roles?.length ? (
                      <p className="text-base text-terminal-green font-mono leading-snug mt-0.5">
                        {profile.roles.map(r => r.title).join(", ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="font-mono space-y-1">
                    <div className="group grid grid-cols-[5rem_1fr] gap-2 px-2 -mx-2 py-2 rounded hover:bg-terminal-border/30 transition-colors items-center">
                      <span className="text-base text-terminal-text-dim/50">OS</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-terminal-orange animate-pulse shrink-0" />
                        <span className="text-terminal-orange text-lg font-medium">Ubuntu 24.04 LTS</span>
                      </span>
                    </div>
                    {profile?.email && (
                      <div className="group grid grid-cols-[5rem_1fr] gap-2 px-2 -mx-2 py-2 rounded hover:bg-terminal-border/30 hover:shadow-[inset_2px_0_0_0] hover:shadow-terminal-blue/40 transition-all items-center">
                        <span className="text-base text-terminal-text-dim/50">Email</span>
                        <a href={`mailto:${profile.email}`} className="text-terminal-blue text-lg hover:underline break-all">{profile.email}</a>
                      </div>
                    )}
                    {profile?.github && (
                      <div className="group grid grid-cols-[5rem_1fr] gap-2 px-2 -mx-2 py-2 rounded hover:bg-terminal-border/30 hover:shadow-[inset_2px_0_0_0] hover:shadow-terminal-green/40 transition-all items-center">
                        <span className="text-base text-terminal-text-dim/50">GitHub</span>
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-terminal-text-dim text-lg hover:text-terminal-green break-all transition-colors">{profile.github.replace("https://github.com/", "")}</a>
                      </div>
                    )}
                    {profile?.linkedin && (
                      <div className="group grid grid-cols-[5rem_1fr] gap-2 px-2 -mx-2 py-2 rounded hover:bg-terminal-border/30 hover:shadow-[inset_2px_0_0_0] hover:shadow-terminal-blue/40 transition-all items-center">
                        <span className="text-base text-terminal-text-dim/50">LinkedIn</span>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-text-dim text-lg hover:text-terminal-green break-all transition-colors">{profile.linkedin.replace("https://www.linkedin.com/in/", "")}</a>
                      </div>
                    )}
                    {profile?.resume && (
                      <div className="pt-3 mt-2 border-t border-terminal-border/50">
                        <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-base text-terminal-green hover:text-terminal-green-dim transition-colors px-2 -mx-2 py-1.5 rounded hover:bg-terminal-border/30">
                          <Terminal size={16} /> ./view-resume.sh
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-terminal-border/50">
                    <p className="font-mono leading-relaxed flex items-center gap-2">
                      <span className="text-terminal-green shrink-0 text-lg">$</span>
                      <span className="relative w-[16rem] sm:w-[20rem]">
                        <motion.span
                          key={sloganIndex}
                          initial={{ x: 60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -60, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`block text-base sm:text-lg font-bold ${slogans[sloganIndex][1]}`}
                        >
                          {slogans[sloganIndex][0]}
                        </motion.span>
                      </span>
                      <span className="inline-block w-[3px] h-5 bg-terminal-green animate-pulse shrink-0" />
                    </p>
                  </div>
                </div>
              </TerminalWindow>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
