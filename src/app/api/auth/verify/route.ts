import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-simple"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true, user: payload })
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
