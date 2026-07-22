"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { authenticatedFetch } from "@/lib/auth-client"
import type { SkillData } from "@/types"

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SkillData | null>(null)
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [error, setError] = useState("")

  async function load() {
    const res = await authenticatedFetch("/api/admin/skills")
    if (!res.ok) { setError("Auth failed"); setLoading(false); return }
    setSkills(await res.json()); setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setName(""); setIcon(""); setShowForm(true); setError("") }
  function openEdit(s: SkillData) { setEditing(s); setName(s.name); setIcon(s.icon ?? ""); setShowForm(true); setError("") }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const method = editing ? "PUT" : "POST"
    const body = editing ? { id: editing.id, name, icon: icon || null } : { name, icon: icon || null }
    const res = await authenticatedFetch("/api/admin/skills", { method, body: JSON.stringify(body) })
    if (!res.ok) { setError("Save failed"); return }
    setShowForm(false); setEditing(null); load()
  }

  async function handleDelete(id: string) {
    setError("")
    const res = await authenticatedFetch("/api/admin/skills", { method: "DELETE", body: JSON.stringify({ id }) })
    if (!res.ok) { setError("Delete failed"); return }
    load()
  }

  if (loading) return <div className="text-terminal-text-dim text-sm animate-pulse">[ LOADING... ]</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-terminal-green text-lg font-semibold">skills</h1><p className="text-terminal-text-dim text-xs mt-1">Manage your technical skills</p></div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-terminal-green text-terminal-bg rounded text-sm font-semibold hover:bg-terminal-green-dim"><Plus size={16} /> Add Skill</button>
      </div>
      {error && <div className="text-terminal-red text-xs mb-4">[ERROR] {error}</div>}
      {showForm && (
        <form onSubmit={handleSave} className="border border-terminal-border rounded bg-terminal-surface p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-terminal-green">{editing ? "edit" : "new"}.skill</span>
            <button type="button" onClick={() => setShowForm(false)} className="text-terminal-text-dim hover:text-terminal-red"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="block text-xs text-terminal-text-dim mb-1">name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green" required /></div>
            <div><label className="block text-xs text-terminal-text-dim mb-1">icon</label><input value={icon} onChange={e => setIcon(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green" /></div>
          </div>
          <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 bg-terminal-green text-terminal-bg rounded text-sm font-semibold"><Check size={16} /> {editing ? "Update" : "Create"}</button>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map(s => (
          <div key={s.id} className="border border-terminal-border rounded bg-terminal-surface p-3 flex items-center justify-between group">
            <div className="flex items-center gap-3">{s.icon && <span className="text-lg">{s.icon}</span>}<span className="text-sm text-terminal-text">{s.name}</span></div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(s)} className="p-1.5 text-terminal-text-dim hover:text-terminal-blue"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 text-terminal-text-dim hover:text-terminal-red"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <div className="col-span-full text-center text-terminal-text-dim text-sm py-8">No skills yet.</div>}
      </div>
    </div>
  )
}
