import { NextResponse } from "next/server"
import { verifyToken, getTokenFromRequest } from "@/lib/auth-simple"
import { uploadToIPFS } from "@/lib/pinata"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function isAuthorized(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return false
  return !!verifyToken(token)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized()
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const result = await uploadToIPFS(file)
    return NextResponse.json({ url: result.url, cid: result.cid })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Upload failed" }, { status: 500 })
  }
}
