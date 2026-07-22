"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Check, ExternalLink, Download } from "lucide-react"
import { GithubIcon } from "@/components/ui/Icons"
import { authenticatedFetch } from "@/lib/auth-client"
import type { ProjectData } from "@/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]); const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<ProjectData | null>(null)
  const [form, setForm] = useState({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "" })
  const [error, setError] = useState("")
  const [showImport, setShowImport] = useState(false); const [importUrl, setImportUrl] = useState(""); const [importing, setImporting] = useState(false)

  async function importFromGitHub() {
    setError("")
    const match = importUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
    if (!match) { setError("Invalid GitHub repo URL"); return }
    const [, owner, repo] = match
    setImporting(true)
    try {
      const [repoRes, topicsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`),
        fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, { headers: { Accept: "application/vnd.github.mercy-preview+json" } }),
      ])
      if (!repoRes.ok) { setError(`GitHub API error: ${repoRes.status}`); return }
      const repoData = await repoRes.json()
      let topics: string[] = []
      if (topicsRes.ok) { const t = await topicsRes.json(); topics = t.names ?? [] }
      const langs = repoData.language ? [repoData.language] : []
      const techStack = [...langs, ...topics].join(", ")
      setForm({
        title: repoData.name || "",
        description: repoData.description || "",
        techStack,
        githubLink: repoData.html_url || importUrl,
        liveLink: repoData.homepage ? ensureProtocol(repoData.homepage) : "",
        image: "",
      })
      setShowImport(false); setImportUrl(""); setShowForm(true)
    } catch { setError("Failed to fetch from GitHub") }
    finally { setImporting(false) }
  }

  async function load() {
    const res = await authenticatedFetch("/api/admin/projects")
    if (!res.ok) { setError("Auth failed"); setLoading(false); return }
    setProjects(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "" }); setShowForm(true); setError("") }
  function openEdit(p: ProjectData) { setEditing(p); setForm({ title: p.title, description: p.description, techStack: p.techStack, githubLink: p.githubLink ?? "", liveLink: p.liveLink ?? "", image: p.image ?? "" }); setShowForm(true); setError("") }

  function ensureProtocol(url: string) {
    return url && !/^https?:\/\//i.test(url) ? `https://${url}` : url
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const data = { ...form, githubLink: form.githubLink ? ensureProtocol(form.githubLink) : null, liveLink: form.liveLink ? ensureProtocol(form.liveLink) : null, image: form.image || null }
    const method = editing ? "PUT" : "POST"
    const res = await authenticatedFetch("/api/admin/projects", { method, body: JSON.stringify(editing ? { id: editing.id, ...data } : data) })
    if (!res.ok) { setError("Save failed"); return }
    setShowForm(false); setEditing(null); load()
  }

  async function handleDelete(id: string) {
    setError(""); const res = await authenticatedFetch("/api/admin/projects", { method: "DELETE", body: JSON.stringify({ id }) })
    if (!res.ok) { setError("Delete failed"); return }; load()
  }

  if (loading) return <div className="text-terminal-text-dim text-sm animate-pulse">[ LOADING... ]</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-terminal-green text-xl font-semibold">projects</h1><p className="text-terminal-text-dim text-sm mt-1">Manage your portfolio projects</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowImport(!showImport); setShowForm(false) }} className="flex items-center gap-1.5 px-4 py-2 border border-terminal-border rounded text-base text-terminal-text-dim hover:text-terminal-green hover:border-terminal-green transition-all"><Download size={18} /> Import from GitHub</button>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-terminal-blue text-terminal-bg rounded text-base font-semibold"><Plus size={18} /> Add Project</button>
        </div>
      </div>
      {showImport && (
        <div className="border border-terminal-border rounded bg-terminal-surface p-4 mb-6">
          <div className="flex items-center justify-between mb-3"><span className="text-sm text-terminal-blue font-mono font-semibold">import.github</span><button type="button" onClick={() => { setShowImport(false); setImportUrl("") }} className="text-terminal-text-dim hover:text-terminal-red"><X size={18} /></button></div>
          <div className="flex items-center gap-2">
            <input value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="https://github.com/owner/repo" className="flex-1 bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-green" />
            <button onClick={importFromGitHub} disabled={importing} className="flex items-center gap-1.5 px-4 py-2.5 bg-terminal-green text-terminal-bg rounded text-base font-semibold hover:bg-terminal-green-dim disabled:opacity-50 transition-all">{importing ? "Importing..." : "Import"}</button>
          </div>
        </div>
      )}
      {error && <div className="text-terminal-red text-xs mb-4">[ERROR] {error}</div>}
      {showForm && (
        <form onSubmit={handleSave} className="border border-terminal-border rounded bg-terminal-surface p-4 mb-6">
          <div className="flex items-center justify-between mb-3"><span className="text-sm text-terminal-blue font-mono font-semibold">{editing ? "edit" : "new"}.project</span><button type="button" onClick={() => setShowForm(false)} className="text-terminal-text-dim hover:text-terminal-red"><X size={18} /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="block text-sm text-terminal-text-dim mb-1">title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue" required /></div>
            <div><label className="block text-sm text-terminal-text-dim mb-1">tech stack *</label><input value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue" required /></div>
            <div><label className="block text-sm text-terminal-text-dim mb-1">github</label><input value={form.githubLink} onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue" /></div>
            <div><label className="block text-sm text-terminal-text-dim mb-1">live link</label><input value={form.liveLink} onChange={e => setForm(p => ({ ...p, liveLink: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue" /></div>
            <div className="sm:col-span-2"><label className="block text-sm text-terminal-text-dim mb-1">image URL</label><input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue" /></div>
            <div className="sm:col-span-2"><label className="block text-sm text-terminal-text-dim mb-1">description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 text-base text-terminal-text focus:outline-none focus:border-terminal-blue h-24" required /></div>
          </div>
          <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-terminal-blue text-terminal-bg rounded text-base font-semibold"><Check size={18} /> {editing ? "Update" : "Create"}</button>
        </form>
      )}
        <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="border border-terminal-border rounded bg-terminal-surface p-4 group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h3 className="text-base font-semibold text-terminal-text truncate">{p.title}</h3>
                  <div className="flex items-center gap-1">{p.githubLink && <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="text-terminal-text-dim hover:text-terminal-blue"><GithubIcon size={18} /></a>}{p.liveLink && <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="text-terminal-text-dim hover:text-terminal-green"><ExternalLink size={18} /></a>}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">{p.techStack.split(",").map((t, i) => <span key={i} className="text-sm px-2 py-0.5 bg-terminal-border rounded text-terminal-text-dim">{t.trim()}</span>)}</div>
                <p className="text-sm text-terminal-text mt-2 line-clamp-2">{p.description}</p>
              </div>
              <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 text-terminal-text-dim hover:text-terminal-blue"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-terminal-text-dim hover:text-terminal-red"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-center text-terminal-text-dim text-base py-8">No projects yet.</div>}
      </div>
    </div>
  )
}
