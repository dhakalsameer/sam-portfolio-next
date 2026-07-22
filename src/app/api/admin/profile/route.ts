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
  const profile = await prisma.profile.findFirst({
    include: { photos: { orderBy: { order: "asc" } }, roles: true },
  })
  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  if (!getUserId(request)) return unauthorized()
  try {
    const body = await request.json()
    const { photos, roles, ...data } = body

    let profile = await prisma.profile.findFirst()
    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data,
      })
    } else {
      profile = await prisma.profile.create({ data })
    }

    if (photos) {
      await prisma.profilePhoto.deleteMany({ where: { profileId: profile.id } })
      if (photos.length > 0) {
        await prisma.profilePhoto.createMany({
          data: photos.map((url: string, i: number) => ({
            image: url,
            order: i,
            profileId: profile.id,
          })),
        })
      }
    }

    if (roles) {
      await prisma.role.deleteMany({ where: { profileId: profile.id } })
      if (roles.length > 0) {
        await prisma.role.createMany({
          data: roles.map((title: string) => ({
            title,
            profileId: profile.id,
          })),
        })
      }
    }

    const updated = await prisma.profile.findFirst({
      where: { id: profile.id },
      include: { photos: { orderBy: { order: "asc" } }, roles: true },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error("Profile update error:", e)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
