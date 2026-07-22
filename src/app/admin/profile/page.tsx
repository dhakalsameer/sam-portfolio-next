"use client"

import { useEffect, useState } from "react"
import { Check, Upload, X, Plus, Hash } from "lucide-react"
import { authenticatedFetch } from "@/lib/auth-client"
import type { ProfileData } from "@/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("")
  const [form, setForm] = useState({ fullName: "", bio: "", about: "", email: "", resume: "", linkedin: "", github: "", facebook: "" })
  const [photos, setPhotos] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [newRole, setNewRole] = useState("")

  async function load() {
    const res = await authenticatedFetch("/api/admin/profile")
    if (!res.ok) { setError("Auth failed"); setLoading(false); return }
    const data = await res.json()
    if (data) {
      setProfile(data)
      setForm({ fullName: data.fullName || "", bio: data.bio || "", about: data.about || "", email: data.email || "", resume: data.resume || "", linkedin: data.linkedin || "", github: data.github || "", facebook: data.facebook || "" })
      setPhotos(data.photos?.map((p: { image: string }) => p.image) || [])
      setRoles(data.roles?.map((r: { title: string }) => r.title) || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSuccess("")
    try {
      const res = await authenticatedFetch("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify({ ...form, photos, roles, resume: form.resume || null, linkedin: form.linkedin || null, github: form.github || null, facebook: form.facebook || null }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || "Save failed"); return }
      setSuccess("Profile saved")
      load()
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("portfolio_admin_token")
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    const data = await res.json()
    if (data.url) setPhotos(p => [...p, data.url])
  }

  if (loading) return <div className="text-terminal-text-dim text-sm animate-pulse">[ LOADING... ]</div>
  return (
    <div>
      <div className="mb-6"><h1 className="text-terminal-green text-lg font-semibold">profile</h1><p className="text-terminal-text-dim text-xs mt-1">Edit your personal information</p></div>
      {error && <div className="text-terminal-red text-xs mb-4">[ERROR] {error}</div>}
      {success && <div className="text-terminal-green text-xs mb-4">[OK] {success}</div>}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="border border-terminal-border rounded bg-terminal-surface p-4">
          <div className="text-xs text-terminal-green mb-3">profile.info</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["fullName","bio","email","resume","github","linkedin","facebook"] as const).map(f => (
              <div key={f} className={f === "bio" ? "sm:col-span-2" : ""}>
                <label className="block text-xs text-terminal-text-dim mb-1">{f.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}</label>
                {f === "email" ? <input type="email" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green" />
                : f === "bio" ? <textarea value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green h-20" />
                : <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green" />}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs text-terminal-text-dim mb-1">about</label>
              <textarea value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green h-24" />
            </div>
          </div>
        </div>
        <div className="border border-terminal-border rounded bg-terminal-surface p-4">
          <div className="text-xs text-terminal-green mb-3">profile.photos</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {photos.map((url, i) => (
              <div key={i} className="relative group aspect-square border border-terminal-border rounded overflow-hidden bg-terminal-bg">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-terminal-red opacity-0 group-hover:opacity-100"><X size={14} /></button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-terminal-border rounded cursor-pointer hover:border-terminal-green transition-colors text-terminal-text-dim hover:text-terminal-green text-sm">
            <Upload size={16} /> Upload Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <div className="border border-terminal-border rounded bg-terminal-surface p-4">
          <div className="text-xs text-terminal-green mb-3">profile.roles</div>
          <div className="text-xs text-terminal-text-dim mb-3 font-mono">These cycle every few seconds on the hero section</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {roles.map((role, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-terminal-bg border border-terminal-border rounded text-sm font-mono text-terminal-green group">
                <Hash size={12} className="text-terminal-text-dim/50" />
                <span>{role}</span>
                <button type="button" onClick={() => setRoles(p => p.filter((_, j) => j !== i))} className="text-terminal-text-dim/30 hover:text-terminal-red ml-0.5"><X size={12} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const trimmed = newRole.trim()
                  if (trimmed && !roles.includes(trimmed)) {
                    setRoles(p => [...p, trimmed])
                    setNewRole("")
                  }
                }
              }}
              placeholder="e.g. Rust Backend Developer"
              className="flex-1 bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text font-mono placeholder:text-terminal-text-dim/30 focus:outline-none focus:border-terminal-green"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newRole.trim()
                if (trimmed && !roles.includes(trimmed)) {
                  setRoles(p => [...p, trimmed])
                  setNewRole("")
                }
              }}
              className="flex items-center gap-1 px-3 py-2 border border-terminal-border rounded text-sm text-terminal-text-dim hover:text-terminal-green hover:border-terminal-green transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-terminal-green text-terminal-bg rounded text-sm font-semibold hover:bg-terminal-green-dim disabled:opacity-50"><Check size={16} /> {saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  )
}
