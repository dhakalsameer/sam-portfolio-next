import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth-simple"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function getUserId(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.id ?? null
}

export async function GET(request: Request) {
  if (!getUserId(request)) return unauthorized()
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const data = await request.json()
    const project = await prisma.project.create({ data })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const { id, ...data } = await request.json()
    const project = await prisma.project.update({ where: { id }, data })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const { id } = await request.json()
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
