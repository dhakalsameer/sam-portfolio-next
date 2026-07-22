import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

const TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-change-me"

export function createToken(payload: { id: string; email: string }) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 }))
  const signature = btoa(TOKEN_SECRET + ":" + body)
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): { id: string; email: string } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const body = JSON.parse(atob(parts[1]))
    if (body.exp && body.exp < Date.now()) return null
    const expectedSig = btoa(TOKEN_SECRET + ":" + parts[1])
    if (parts[2] !== expectedSig) return null
    return { id: body.id, email: body.email }
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null

  return createToken({ id: user.id, email: user.email })
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (auth?.startsWith("Bearer ")) return auth.slice(7)
  return null
}
