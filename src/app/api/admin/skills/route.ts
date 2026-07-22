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
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(skills)
}

export async function POST(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const { name, icon } = await request.json()
    const skill = await prisma.skill.create({ data: { name, icon } })
    return NextResponse.json(skill)
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const { id, name, icon } = await request.json()
    const skill = await prisma.skill.update({ where: { id }, data: { name, icon } })
    return NextResponse.json(skill)
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const { id } = await request.json()
    await prisma.skill.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
