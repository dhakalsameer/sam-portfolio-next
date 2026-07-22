"use client"

import { useState } from "react"
import { Terminal } from "lucide-react"
import { login } from "@/lib/auth-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(email, password)
    if (result.success) {
      window.location.href = "/admin/dashboard"
    } else {
      setError(result.error || "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-terminal-green mb-2">
            <Terminal size={24} />
            <span className="text-lg font-semibold">admin@portfolio:~$</span>
          </div>
          <p className="text-terminal-text-dim text-sm">Authentication required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-terminal-border rounded overflow-hidden bg-terminal-surface">
            <div className="px-3 py-1.5 bg-terminal-border text-xs text-terminal-text-dim border-b border-terminal-border">
              login.ssh
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-terminal-green mb-1">email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green transition-colors"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-terminal-green mb-1">password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text focus:outline-none focus:border-terminal-green transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-terminal-red text-xs text-center">
              [ERROR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-terminal-green text-terminal-bg font-semibold rounded hover:bg-terminal-green-dim transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "[ AUTHENTICATING... ]" : "[ LOGIN ]"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-terminal-text-dim text-xs hover:text-terminal-green transition-colors">
            &lt; back to portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
