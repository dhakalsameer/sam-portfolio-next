"use client"

import { motion } from "framer-motion"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons"
import TerminalWindow from "@/components/ui/TerminalWindow"
import { useState } from "react"
import type { ProfileData } from "@/types"
import { cl } from "@/lib/images"

export default function ContactSection({ profile }: { profile: ProfileData | null }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("sent")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terminal-text text-base sm:text-lg font-semibold mb-4 font-mono">
            <span className="text-terminal-green">$</span> echo $CONTACT
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TerminalWindow title="sameer@ubuntu:~/contact">
              <form onSubmit={handleSubmit}>
                <div className="space-y-3 sm:space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-mono mb-1.5 sm:mb-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-text-dim/90">read -p </span>
                      <span className="text-terminal-green/80">&quot;name: &quot;</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="your name"
                      className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 sm:py-2.5 text-sm sm:text-base text-terminal-text font-mono placeholder:text-terminal-text-dim/30 focus:outline-none focus:border-terminal-green focus:shadow-[0_0_8px_rgba(0,255,65,0.08)] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-mono mb-1.5 sm:mb-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-text-dim/90">read -p </span>
                      <span className="text-terminal-green/80">&quot;email: &quot;</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 sm:py-2.5 text-sm sm:text-base text-terminal-text font-mono placeholder:text-terminal-text-dim/30 focus:outline-none focus:border-terminal-green focus:shadow-[0_0_8px_rgba(0,255,65,0.08)] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-mono mb-1.5 sm:mb-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-text-dim/90">cat &gt;&gt; message.txt</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="type your message..."
                      className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 sm:py-2.5 text-sm sm:text-base text-terminal-text font-mono placeholder:text-terminal-text-dim/30 focus:outline-none focus:border-terminal-green focus:shadow-[0_0_8px_rgba(0,255,65,0.08)] transition-all h-24 sm:h-28 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-2.5 sm:py-3 bg-terminal-green/10 border border-terminal-green/30 rounded text-sm sm:text-base font-mono font-semibold text-terminal-green hover:bg-terminal-green/20 hover:border-terminal-green/50 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <><span className="animate-pulse">⟳</span> sending...</>
                    ) : (
                      <><Send size={13} className="sm:hidden" /><Send size={14} className="hidden sm:block" /> ./send-mail.sh --send</>
                    )}
                  </button>

                  {status === "sent" && (
                    <div className="flex items-center gap-2 text-sm sm:text-base text-terminal-green font-mono bg-terminal-green/5 border border-terminal-green/20 rounded px-3 py-2">
                      <CheckCircle size={14} className="sm:hidden" />
                      <CheckCircle size={16} className="hidden sm:block" />
                      <span>✓ Message delivered successfully</span>
                    </div>
                  )}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-sm sm:text-base text-terminal-red font-mono bg-terminal-red/5 border border-terminal-red/20 rounded px-3 py-2">
                      <AlertCircle size={14} className="sm:hidden" />
                      <AlertCircle size={16} className="hidden sm:block" />
                      <span>✗ Delivery failed — try again</span>
                    </div>
                  )}
                </div>
              </form>
            </TerminalWindow>

            <div className="space-y-6">
              <TerminalWindow title="sameer@ubuntu:~/finger">
                <div className="text-sm font-mono text-terminal-text-dim/70 mb-3 border-b border-terminal-border/30 pb-2">
                  Login: sameer &nbsp;&nbsp;&nbsp; Name: {profile?.fullName || "Sameer Dhakal"}
                </div>
                <div className="space-y-3">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-base font-mono text-terminal-text-dim hover:text-terminal-green transition-colors group">
                      <Mail size={18} className="text-terminal-green/60 group-hover:text-terminal-green transition-colors" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-base font-mono text-terminal-text-dim hover:text-terminal-green transition-colors group">
                      <GithubIcon size={18} />
                      <span className="truncate">{profile.github.replace("https://github.com/", "")}</span>
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-base font-mono text-terminal-text-dim hover:text-terminal-green transition-colors group">
                      <LinkedinIcon size={18} />
                      <span className="truncate">{profile.linkedin.replace("https://", "")}</span>
                    </a>
                  )}
                </div>
              </TerminalWindow>

              {profile?.photos?.[1] && (
                <div className="border border-terminal-border rounded overflow-hidden">
                  <img src={cl(profile.photos[1].image, 640)} alt="" className="w-full aspect-video object-cover" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
