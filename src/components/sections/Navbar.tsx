"use client"

import { useState, useEffect } from "react"
import { Terminal, Menu, X, Moon, Sun, Shield } from "lucide-react"

const sections = [
  { id: "hero", label: "home" },
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "certificates", label: "certificates" },
  { id: "contact", label: "contact" },
]

function getTheme() {
  if (typeof window === "undefined") return "dark"
  return document.documentElement.getAttribute("data-theme") || "dark"
}

function setTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)
}

export default function Navbar() {
  const [active, setActive] = useState("hero")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setThemeState] = useState("light")

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    setThemeState(next)
  }

  return (
    <nav className="sticky top-0 z-50 bg-terminal-surface border-b border-terminal-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 text-terminal-green hover:text-terminal-green-dim transition-colors group">
          <Terminal size={20} className="group-hover:animate-pulse" />
          <span className="text-base sm:text-lg font-mono font-semibold">
            <span className="text-terminal-text-dim">sameer</span>
            <span className="text-terminal-green">@</span>
            <span className="text-terminal-amber">ubuntu</span>
            <span className="text-terminal-text-dim">:~$</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`relative px-3 sm:px-4 py-2 rounded text-base font-mono transition-all ${
                active === id
                  ? "text-terminal-green bg-terminal-green/5"
                  : "text-terminal-text-dim/70 hover:text-terminal-text hover:bg-terminal-border/40"
              }`}
            >
              {active === id && (
                <span className="absolute -top-px left-2 right-2 h-0.5 bg-terminal-green rounded-full" />
              )}
              $ cd {label}/
            </button>
          ))}
            <div className="w-px h-5 bg-terminal-border/40 mx-1" />
            <a
              href="/admin"
              className="p-2 rounded text-terminal-text-dim/40 hover:text-terminal-green hover:bg-terminal-border/40 transition-all"
              title="Admin panel"
            >
              <Shield size={15} />
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all duration-300 hidden md:flex items-center justify-center ${theme === "dark" ? "border-terminal-amber/20 text-terminal-amber hover:bg-terminal-amber/5 hover:border-terminal-amber/40" : "border-terminal-blue/20 text-terminal-blue hover:bg-terminal-blue/5 hover:border-terminal-blue/40"}`}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              <span className={`block transition-transform duration-300 ${theme === "dark" ? "rotate-0" : "rotate-180"}`}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</span>
            </button>
          </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all duration-300 md:hidden ${theme === "dark" ? "border-terminal-amber/20 text-terminal-amber hover:bg-terminal-amber/5" : "border-terminal-blue/20 text-terminal-blue hover:bg-terminal-blue/5"}`}
          >
            <span className={`block transition-transform duration-300 ${theme === "dark" ? "rotate-0" : "rotate-180"}`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</span>
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-terminal-text-dim/60 hover:text-terminal-green transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-terminal-border/50 bg-terminal-surface/95 backdrop-blur-md">
          <div className="px-4 sm:px-6 py-3 space-y-1">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left px-3 py-3 rounded text-base font-mono transition-all ${
                  active === id
                    ? "text-terminal-green bg-terminal-green/5 border-l-2 border-terminal-green"
                    : "text-terminal-text-dim/60 hover:text-terminal-text hover:bg-terminal-border/30 border-l-2 border-transparent"
                }`}
              >
                <span className="text-terminal-text-dim/40">$</span> cd {label}
              </button>
            ))}
            <div className="border-t border-terminal-border/30 my-2" />
            <a
              href="/admin"
              className="flex items-center gap-2 px-3 py-3 rounded text-base font-mono text-terminal-text-dim/40 hover:text-terminal-green hover:bg-terminal-border/30 transition-all"
            >
              <Shield size={14} />
              <span>admin</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
