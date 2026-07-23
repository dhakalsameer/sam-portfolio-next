"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Terminal, LayoutDashboard, Code2, Award, FolderGit2, User, LogOut, Menu, Sun, Moon } from "lucide-react"
import { verifySession, clearToken } from "@/lib/auth-client"

function getTheme() {
  if (typeof window === "undefined") return "dark"
  return document.documentElement.getAttribute("data-theme") || "dark"
}

function setTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [theme, setThemeState] = useState("dark")
  const router = useRouter()

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  useEffect(() => {
    verifySession().then((valid) => {
      if (!valid) {
        clearToken()
        router.push("/admin/login")
      } else {
        setChecked(true)
      }
    })
  }, [router])

  const pathname = usePathname()
  const isLogin = pathname === "/admin/login"

  if (isLogin) return <>{children}</>

  if (!checked) {
    return (
      <div className="h-screen flex items-center justify-center bg-terminal-bg">
        <div className="text-terminal-green text-lg animate-pulse">[ LOADING... ]</div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/skills", label: "Skills", icon: Code2 },
    { href: "/admin/certificates", label: "Certificates", icon: Award },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="flex h-screen bg-terminal-bg">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-40 w-64 h-full bg-terminal-surface border-r border-terminal-border transition-transform duration-200 flex flex-col`}>
        <div className="p-4 border-b border-terminal-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-terminal-green">
            <Terminal size={22} />
            <span className="font-semibold text-base">admin@portfolio:~$</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded text-terminal-text-dim hover:text-terminal-green hover:bg-terminal-border transition-colors text-base">
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-terminal-border space-y-1">
          <button onClick={() => { clearToken(); router.push("/admin/login") }} className="flex items-center gap-2 px-3 py-2 w-full rounded text-terminal-red hover:text-terminal-red-dim hover:bg-terminal-red/5 transition-colors text-sm">
            <LogOut size={16} /> Logout
          </button>
          <button onClick={() => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); setThemeState(next) }} className="flex items-center justify-between gap-2 px-3 py-2 w-full rounded text-terminal-text-dim hover:text-terminal-amber hover:bg-terminal-amber/5 border border-transparent hover:border-terminal-amber/30 transition-all duration-300 text-sm group">
            <span className="flex items-center gap-2"><span className={`p-1 rounded-md transition-transform duration-300 ${theme === "dark" ? "bg-terminal-amber/10 rotate-0" : "bg-terminal-blue/10 rotate-180"}`}>{theme === "dark" ? <Sun size={14} className="text-terminal-amber" /> : <Moon size={14} className="text-terminal-blue" />}</span> {theme === "dark" ? "Light" : "Dark"} Mode</span>
            <span className="text-xs opacity-0 group-hover:opacity-60 transition-opacity">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-terminal-border flex items-center justify-between px-4 lg:hidden bg-terminal-surface">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="text-terminal-text-dim hover:text-terminal-green"><Menu size={20} /></button>
            <span className="text-sm text-terminal-text-dim">admin panel</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { clearToken(); router.push("/admin/login") }} className="p-2 text-terminal-text-dim hover:text-terminal-red transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
            <button onClick={() => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); setThemeState(next) }} className={`p-2 rounded-lg border transition-all duration-300 ${theme === "dark" ? "border-terminal-amber/20 text-terminal-amber hover:bg-terminal-amber/5 hover:border-terminal-amber/40" : "border-terminal-blue/20 text-terminal-blue hover:bg-terminal-blue/5 hover:border-terminal-blue/40"}`} title={theme === "dark" ? "Light mode" : "Dark mode"}>
              <span className={`block transition-transform duration-300 ${theme === "dark" ? "rotate-0" : "rotate-180"}`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
