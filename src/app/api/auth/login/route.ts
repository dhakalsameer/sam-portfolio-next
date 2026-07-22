import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-simple"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const token = await authenticateUser(email, password)
    if (!token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
