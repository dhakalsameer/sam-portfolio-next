const TOKEN_KEY = "portfolio_admin_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setToken(data.token)
      return { success: true }
    }
    return { success: false, error: data.error || "Invalid credentials" }
  } catch {
    return { success: false, error: "Network error" }
  }
}

export async function verifySession(): Promise<boolean> {
  const token = getToken()
  if (!token) return false
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()
    return data.valid === true
  } catch {
    return false
  }
}

export function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = { ...options.headers as Record<string, string> | undefined, ...authHeaders() }
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }
  return fetch(url, {
    ...options,
    headers,
  })
}
