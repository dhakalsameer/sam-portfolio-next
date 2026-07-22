"use client"

import { motion } from "framer-motion"
import TerminalWindow from "@/components/ui/TerminalWindow"
import type { SkillData } from "@/types"

export default function SkillsSection({ skills }: { skills: SkillData[] }) {
  if (skills.length === 0) return null

  return (
    <section id="skills" className="py-20 px-4 bg-terminal-surface/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terminal-text text-base sm:text-lg font-semibold mb-4 font-mono">
            <span className="text-terminal-green">$</span> ls skills/
          </p>

          <TerminalWindow title="sameer@ubuntu:~/skills">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="group relative border border-terminal-border rounded-lg bg-terminal-bg p-4 flex flex-col items-center justify-center gap-2 hover:border-terminal-green/40 hover:shadow-sm hover:shadow-terminal-green/5 transition-all"
                >
                  {skill.icon ? (
                    <span className="text-2xl leading-none">{skill.icon}</span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-terminal-border flex items-center justify-center text-xs text-terminal-text-dim font-bold">
                      {skill.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-base font-mono text-terminal-text text-center leading-tight group-hover:text-terminal-green transition-colors">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  )
}
