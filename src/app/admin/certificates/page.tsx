"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Check, ExternalLink, Upload } from "lucide-react"
import { authenticatedFetch } from "@/lib/auth-client"
import type { CertificationData } from "@/types"

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificationData[]>([]); const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<CertificationData | null>(null)
  const [form, setForm] = useState({ title: "", description: "", issuer: "", dateAwarded: "", certificateUrl: "", image: "" })
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

  async function load() {
    const res = await authenticatedFetch("/api/admin/certificates?limit=100")
    if (!res.ok) { setError("Auth failed"); setLoading(false); return }
    const data = await res.json()
    setCerts(data.certs ?? data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm({ title: "", description: "", issuer: "", dateAwarded: "", certificateUrl: "", image: "" }); setShowForm(true); setError("") }
  function openEdit(c: CertificationData) { setEditing(c); setForm({ title: c.title, description: c.description, issuer: c.issuer, dateAwarded: c.dateAwarded ?? "", certificateUrl: c.certificateUrl ?? "", image: c.image ?? "" }); setShowForm(true); setError("") }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const data = { ...form, dateAwarded: form.dateAwarded || null, certificateUrl: form.certificateUrl || null, image: form.image || null }
    const method = editing ? "PUT" : "POST"
    const res = await authenticatedFetch("/api/admin/certificates", { method, body: JSON.stringify(editing ? { id: editing.id, ...data } : data) })
    if (!res.ok) { setError("Save failed"); return }
    setShowForm(false); setEditing(null); load()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await authenticatedFetch("/api/admin/upload", { method: "POST", body: fd })
      if (!res.ok) { setError("Upload failed"); return }
      const data = await res.json()
      setForm(p => ({ ...p, image: data.url }))
    } catch { setError("Upload failed") }
    finally { setUploading(false) }
  }

  async function handleDelete(id: string) {
    setError(""); const res = await authenticatedFetch("/api/admin/certificates", { method: "DELETE", body: JSON.stringify({ id }) })
    if (!res.ok) { setError("Delete failed"); return }; load()
  }

  if (loading) return <div className="text-terminal-text-dim text-sm animate-pulse">[ LOADING... ]</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-terminal-green text-lg font-semibold">certificates</h1><p className="text-terminal-text-dim text-xs mt-1">Manage your certifications</p></div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-terminal-amber text-terminal-bg rounded text-sm font-semibold"><Plus size={16} /> Add Certificate</button>
      </div>
      {error && <div className="text-terminal-red text-xs mb-4">[ERROR] {error}</div>}
      {showForm && (
        <form onSubmit={handleSave} className="border border-terminal-border rounded bg-terminal-surface p-4 mb-6">
          <div className="flex items-center justify-between mb-3"><span className="text-xs text-terminal-amber">{editing ? "edit" : "new"}.certificate</span><button type="button" onClick={() => setShowForm(false)} className="text-terminal-text-dim hover:text-terminal-red"><X size={16} /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="block text-xs text-terminal-text-dim mb-1">title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-amber" required /></div>
            <div><label className="block text-xs text-terminal-text-dim mb-1">issuer *</label><input value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-amber" required /></div>
            <div><label className="block text-xs text-terminal-text-dim mb-1">date</label><input value={form.dateAwarded} onChange={e => setForm(p => ({ ...p, dateAwarded: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-amber" /></div>
            <div><label className="block text-xs text-terminal-text-dim mb-1">URL</label><input value={form.certificateUrl} onChange={e => setForm(p => ({ ...p, certificateUrl: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-amber" /></div>
            <div className="sm:col-span-2"><label className="block text-xs text-terminal-text-dim mb-1">image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 px-3 py-2 bg-terminal-bg border border-terminal-border rounded text-sm text-terminal-text-dim hover:text-terminal-amber hover:border-terminal-amber cursor-pointer transition-all">
                  <Upload size={16} />{uploading ? "Uploading..." : "Choose file"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {form.image && <img src={form.image} alt="" className="w-14 h-14 rounded object-cover border border-terminal-border/60" />}
              </div>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs text-terminal-text-dim mb-1">description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-amber h-20" required /></div>
          </div>
          <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 bg-terminal-amber text-terminal-bg rounded text-sm font-semibold"><Check size={16} /> {editing ? "Update" : "Create"}</button>
        </form>
      )}
      <div className="space-y-3">
        {certs.map(c => (
          <div key={c.id} className="border border-terminal-border rounded bg-terminal-surface p-4 group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {c.image && (
                    <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-terminal-border/60 bg-white/[0.04]">
                      <img src={c.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><h3 className="text-sm font-medium text-terminal-text truncate">{c.title}</h3>{c.certificateUrl && <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-terminal-text-dim hover:text-terminal-amber"><ExternalLink size={14} /></a>}</div>
                    <p className="text-xs text-terminal-text-dim mt-1">{c.issuer}{c.dateAwarded ? ` • ${c.dateAwarded}` : ""}</p>
                  </div>
                </div>
                <p className="text-xs text-terminal-text mt-2 line-clamp-2">{c.description}</p>
              </div>
              <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(c)} className="p-1.5 text-terminal-text-dim hover:text-terminal-blue"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-terminal-text-dim hover:text-terminal-red"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && <div className="text-center text-terminal-text-dim text-sm py-8">No certificates yet.</div>}
      </div>
    </div>
  )
}
